# EME STUDIO — Tienda web

Tienda de EME STUDIO (React + TypeScript + Vite) desplegada en **Cloudflare Pages** (proyecto `emestudio`, dominio [emestudiopr.com](https://emestudiopr.com)). Los pagos van por **Stripe Checkout**, a través de una Pages Function.

## Cómo funciona el pago

1. El carrito vive en el navegador (`src/store.tsx`, guardado en `localStorage`).
2. Al pulsar **Pagar**, el navegador envía **solo** `[{ id, quantity }]` a `POST /api/checkout`. Nunca envía precios.
3. La Function (`functions/api/checkout.ts`):
   - valida los ids y las cantidades (de 1 a 20 por producto) contra el catálogo;
   - toma los precios en centavos de `src/data/products.ts` y `src/data/promos.ts`, que son la misma fuente que usa la web;
   - calcula envío (gratis desde $50; si no, tarifa fija) e IVU de Puerto Rico (11.5%, como línea aparte);
   - crea la sesión de Stripe y devuelve `{ url }`.
4. Stripe cobra y redirige a `/gracias?session_id=…`, que vacía el carrito. Si el cliente cancela, vuelve a `/carrito`, que abre la bolsa.

> No hay webhook todavía. La confirmación del pago se hará con el panel de administración (Supabase).

## Archivos clave

| Archivo | Qué hace |
|---|---|
| `src/data/products.ts` | Catálogo base; precios en **centavos USD** (`priceCents`) |
| `src/data/promos.ts` | Especiales y bundles (ej. 3 Clay Wax por $25), también en centavos |
| `src/data/catalog.ts` | Catálogo vigente (`makeCatalog()`): aplica promociones y cotiza en centavos |
| `functions/api/checkout.ts` | Pages Function que crea la sesión de Stripe Checkout |
| `src/payments.ts` | Llamada del frontend a `/api/checkout` |
| `src/components/Thanks.tsx` | Página `/gracias` |
| `public/_redirects` | Sirve la SPA en rutas reales (`/gracias`, `/carrito`); `/api/*` lo atiende la Function |
| `wrangler.toml` | Configuración de Pages (directorio `dist`, fecha de compatibilidad) |
| `.dev.vars.example` | Plantilla de variables locales |

## Desarrollo local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Crea tu archivo de claves local (no se sube a git):

   ```bash
   cp .dev.vars.example .dev.vars
   ```

   Edita `.dev.vars` y pon tu clave **de prueba**: `STRIPE_SECRET_KEY=sk_test_...` (Stripe → Developers → API keys, en modo Test).

3. Opción A, todo como en producción (build + Functions) en http://127.0.0.1:8788:

   ```bash
   npm run pages:dev
   ```

   Opción B, con recarga en caliente: deja corriendo `npm run pages:dev` en una terminal y en otra corre:

   ```bash
   npm run dev
   ```

   Vite reenvía `/api/*` al puerto 8788.

## Probar un pago

1. Agrega productos y pulsa **Pagar**.
2. En Stripe Checkout usa la tarjeta de prueba **4242 4242 4242 4242**, con cualquier fecha futura, cualquier CVC y cualquier código postal.
3. Completa la dirección (EE. UU. o Puerto Rico) y el teléfono, y paga.
4. Debes volver a `/gracias` con el carrito vacío. La compra aparece en Stripe → Payments (modo Test).

Para probar la cancelación, pulsa la flecha "atrás" en Stripe: vuelves a `/carrito` con la bolsa abierta.

## Producción (Cloudflare Pages)

1. Cloudflare → Pages → `emestudio` → Settings → **Variables and Secrets** → agrega `STRIPE_SECRET_KEY`:
   - en *Preview*, la clave `sk_test_…`;
   - en *Production*, la clave `sk_live_…` cuando se lance.
2. Build command: `npm run build` · Output directory: `dist`.
3. Despliega (push a `main`).

## Comandos

```bash
npm run build                # tipos (web + Functions) y build de producción
npm run typecheck:functions  # solo tipos de las Functions
npm run pages:dev            # build + Cloudflare Pages en local con Functions
```
