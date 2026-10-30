// Cloudflare Pages Function: POST /api/checkout
// Recibe [{ id, quantity }] y crea una sesión de Stripe Checkout con los precios del catálogo.
// El navegador nunca envía precios: todo se calcula aquí a partir de src/data/catalog.ts.
import Stripe from 'stripe';
import { MAX_QTY, displayName, makeCatalog } from '../../src/data/catalog';
import { SITE } from '../../src/data/site';

interface Env {
  STRIPE_SECRET_KEY: string;
}

type Item = { id: string; quantity: number };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

function parseItems(body: unknown, exists: (id: string) => boolean): Item[] | string {
  if (!Array.isArray(body) || body.length === 0) return 'El carrito está vacío.';
  if (body.length > 50) return 'Demasiados productos en el carrito.';
  const merged = new Map<string, number>();
  for (const raw of body) {
    if (!raw || typeof raw !== 'object') return 'Formato de producto inválido.';
    const { id, quantity } = raw as Record<string, unknown>;
    if (typeof id !== 'string' || !exists(id)) return `Producto no disponible: ${String(id)}`;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
      return `Cantidad inválida para ${id} (debe ser entre 1 y ${MAX_QTY}).`;
    }
    merged.set(id, (merged.get(id) ?? 0) + quantity);
  }
  for (const [id, q] of merged) if (q > MAX_QTY) return `Máximo ${MAX_QTY} unidades por producto (${id}).`;
  return [...merged].map(([id, quantity]) => ({ id, quantity }));
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: 'El pago no está configurado (falta STRIPE_SECRET_KEY).' }, 500);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'El cuerpo de la solicitud debe ser JSON.' }, 400);
  }

  // El catálogo se arma aquí (dentro de la solicitud) para que las fechas de promociones sean reales
  const catalog = makeCatalog();
  const items = parseItems(body, catalog.exists);
  if (typeof items === 'string') return json({ error: items }, 400);

  const origin = new URL(request.url).origin;
  const q = catalog.quote(items);
  const abs = (path: string) => (path.startsWith('http') ? path : `${origin}${path}`);

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = q.lines.map((l) => ({
    quantity: l.quantity,
    price_data: {
      currency: 'usd',
      unit_amount: l.unitCents,
      product_data: {
        name: displayName(l.product, 'es'),
        description: l.product.size,
        // Stripe solo puede mostrar imágenes públicas (https); en local se omiten
        ...(origin.startsWith('https://') ? { images: [abs(l.product.studio)] } : {}),
        metadata: { product_id: l.product.id },
      },
    },
  }));

  // IVU de Puerto Rico como línea separada (sobre la mercancía)
  if (q.taxCents > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: q.taxCents,
        product_data: { name: `IVU Puerto Rico (${(SITE.taxRate * 100).toFixed(1)}%)` },
      },
    });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'usd',
      line_items,
      locale: 'auto',
      shipping_address_collection: { allowed_countries: ['US', 'PR'] },
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: q.shippingCents === 0 ? 'Envío gratis' : 'Envío estándar',
            fixed_amount: { amount: q.shippingCents, currency: 'usd' },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ],
      metadata: { items: items.map((i) => `${i.id}x${i.quantity}`).join(',').slice(0, 500) },
      success_url: `${origin}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrito`,
    });

    if (!session.url) return json({ error: 'Stripe no devolvió la URL de pago.' }, 500);
    return json({ url: session.url });
  } catch (err) {
    const message = err instanceof Stripe.errors.StripeError ? err.message : 'Error inesperado al crear el pago.';
    console.error('Stripe checkout error:', err);
    return json({ error: `No se pudo iniciar el pago: ${message}` }, 500);
  }
};

export const onRequest: PagesFunction<Env> = async () => json({ error: 'Método no permitido. Usa POST.' }, 405);
