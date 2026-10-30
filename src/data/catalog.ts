// Catálogo efectivo: productos base + promociones activas aplicadas.
// Todo el sitio lee de aquí, así un especial nuevo se refleja solo en tienda, ficha y carrito.
import type { L } from './types';
import { PRODUCTS, type BaseProduct, type Product } from './products';
import { CODES, GIVEAWAYS, PROMOS, promoStatus, type Promo } from './promos';
import { SITE } from './site';

/** Producto base con sus precios en dólares derivados de los centavos */
const withDollars = (b: BaseProduct): Product => ({
  ...b,
  price: b.priceCents / 100,
  compareAt: b.compareAtCents ? b.compareAtCents / 100 : undefined,
});
const BASE = PRODUCTS.map(withDollars);
const base = (id: string) => BASE.find((p) => p.id === id)!;

export interface QuoteLine {
  product: Product;
  quantity: number;
  unitCents: number;
}

export const bundleId = (promo: Promo) => `promo-${promo.id}`;

export function bundleValue(promo: Promo) {
  return (promo.items ?? []).reduce((a, it) => a + base(it.id).priceCents * it.qty, 0) / 100;
}

function bundleToProduct(promo: Promo): Product {
  const items = promo.items ?? [];
  const first = base(items[0].id);
  return {
    ...first,
    id: bundleId(promo),
    name: promo.name.es,
    short: promo.name.es,
    type: promo.campaign,
    tagline: promo.badge,
    description: promo.description,
    size: items.map((it) => `${it.qty} × ${base(it.id).size}`).join(' + '),
    priceCents: promo.priceCents!,
    compareAtCents: Math.round(bundleValue(promo) * 100),
    price: promo.priceCents! / 100,
    compareAt: bundleValue(promo),
    category: 'kits',
    tag: promo.badge,
    studio: promo.studio ?? promo.image,
    cutout: promo.image,
    gallery: [promo.studio ?? promo.image, ...first.gallery],
    benefits: items.map((it) => ({ es: `${it.qty} × ${base(it.id).name} · ${base(it.id).size}`, en: `${it.qty} × ${base(it.id).name} · ${base(it.id).size}` })),
    specs: first.specs,
    promoId: promo.id,
    bundleName: promo.name,
  } as Product & { bundleName: L };
}

/** Arma el catálogo vigente en un momento dado.
 *  En Cloudflare Workers, Date.now() vale 0 fuera de una solicitud: el backend debe
 *  llamar makeCatalog() dentro del handler para que las fechas de las promociones apliquen. */
export function makeCatalog(now = Date.now()) {
  const active = PROMOS.filter((p) => promoStatus(p, now) === 'active');
  const upcoming = PROMOS.filter((p) => promoStatus(p, now) === 'upcoming');

  const withDiscount = (p: Product): Product => {
    const promo = active.find((x) => x.kind === 'discount' && x.productId === p.id);
    if (!promo || !promo.percentOff) return p;
    const priceCents = Math.round(p.priceCents * (1 - promo.percentOff / 100));
    return { ...p, priceCents, compareAtCents: p.priceCents, price: priceCents / 100, compareAt: p.price, tag: { es: `-${promo.percentOff}%`, en: `-${promo.percentOff}%` }, promoId: promo.id };
  };

  const shop = BASE.map(withDiscount);
  const bundles = active.filter((p) => p.kind === 'bundle').map(bundleToProduct);
  const all = [...shop, ...bundles];
  const byId = (id: string) => all.find((p) => p.id === id)!;
  const exists = (id: string) => all.some((p) => p.id === id);

  /** Cotización en centavos (la usa el backend de pago): envío gratis desde el mínimo, IVU sobre la mercancía */
  const quote = (items: { id: string; quantity: number }[]) => {
    const lines: QuoteLine[] = items.map((it) => {
      const product = byId(it.id);
      return { product, quantity: it.quantity, unitCents: product.priceCents };
    });
    const merchCents = lines.reduce((a, l) => a + l.unitCents * l.quantity, 0);
    const shippingCents = merchCents >= SITE.freeShippingThreshold * 100 ? 0 : Math.round(SITE.shippingFlat * 100);
    const taxCents = Math.round(merchCents * SITE.taxRate);
    return { lines, merchCents, shippingCents, taxCents, totalCents: merchCents + shippingCents + taxCents };
  };

  return {
    active,
    upcoming,
    featured: active.find((p) => p.featured) ?? active[0],
    giveaway: GIVEAWAYS.find((g) => now < new Date(g.endsAt).getTime()),
    shop,
    bundles,
    byId,
    exists,
    quote,
  };
}

// Catálogo del navegador (se calcula al cargar la página)
const C = makeCatalog();
export const ACTIVE_PROMOS = C.active;
export const UPCOMING_PROMOS = C.upcoming;
export const FEATURED_PROMO = C.featured;
export const ACTIVE_GIVEAWAY = C.giveaway;
export const SHOP: Product[] = C.shop;
export const BUNDLES: Product[] = C.bundles;
export const byId = C.byId;
export const exists = C.exists;

/** Producto que representa un especial */
export function promoProduct(promo: Promo) {
  return promo.kind === 'bundle' ? byId(bundleId(promo)) : byId(promo.productId!);
}

/** Nombre a mostrar (los bundles traducen su nombre) */
export function displayName(p: Product, lang: 'es' | 'en') {
  const b = (p as Product & { bundleName?: L }).bundleName;
  return b ? b[lang] : p.name;
}

/** Ofertas en las que aparece un producto (para la ficha: "Ahorra con 3x") */
export const bundlesFor = (id: string) => BUNDLES.filter((b) => ACTIVE_PROMOS.find((p) => p.id === b.promoId)?.items?.some((it) => it.id === id));

export const savings = (p: Product) => (p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0);

/* ---------- Totales del carrito (estándar EE. UU.: subtotal, descuento, envío, impuesto) ---------- */
export function findCode(code: string) {
  const c = CODES.find((x) => x.code === code.trim().toUpperCase());
  if (!c) return null;
  if (c.expiresAt && Date.now() > new Date(c.expiresAt).getTime()) return null;
  return c;
}

export function totals(lines: { id: string; qty: number }[], code?: string | null, pickup = false) {
  const subtotal = lines.reduce((a, l) => a + byId(l.id).price * l.qty, 0);
  const c = code ? findCode(code) : null;
  const codeOk = !!c && subtotal >= (c.minSubtotal ?? 0);
  const discount = codeOk ? Math.round(subtotal * (c!.percentOff / 100) * 100) / 100 : 0;
  const merch = subtotal - discount;
  const shipping = pickup || merch === 0 || merch >= SITE.freeShippingThreshold ? 0 : SITE.shippingFlat;
  // IVU (11.5%) sobre la mercancía
  const tax = Math.round(merch * SITE.taxRate * 100) / 100;
  const total = Math.round((merch + shipping + tax) * 100) / 100;
  return { subtotal, discount, code: codeOk ? c : null, codeInvalid: !!code && !codeOk, merch, shipping, tax, total };
}

/* ---------- Límites del backend de pago ---------- */
export const MAX_QTY = 20;

