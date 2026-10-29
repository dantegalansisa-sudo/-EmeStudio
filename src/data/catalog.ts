// Catálogo efectivo: productos base + promociones activas aplicadas.
// Todo el sitio lee de aquí, así un especial nuevo se refleja solo en tienda, ficha y carrito.
import type { L } from '../i18n';
import { PRODUCTS, type Product } from './products';
import { CODES, GIVEAWAYS, PROMOS, promoStatus, type Promo } from './promos';
import { SITE } from './site';

const base = (id: string) => PRODUCTS.find((p) => p.id === id)!;

export const ACTIVE_PROMOS = PROMOS.filter((p) => promoStatus(p) === 'active');
export const UPCOMING_PROMOS = PROMOS.filter((p) => promoStatus(p) === 'upcoming');
export const FEATURED_PROMO = ACTIVE_PROMOS.find((p) => p.featured) ?? ACTIVE_PROMOS[0];
export const ACTIVE_GIVEAWAY = GIVEAWAYS.find((g) => Date.now() < new Date(g.endsAt).getTime());

export const bundleId = (promo: Promo) => `promo-${promo.id}`;

export function bundleValue(promo: Promo) {
  return (promo.items ?? []).reduce((a, it) => a + base(it.id).price * it.qty, 0);
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
    price: promo.price!,
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

function withDiscount(p: Product): Product {
  const promo = ACTIVE_PROMOS.find((x) => x.kind === 'discount' && x.productId === p.id);
  if (!promo || !promo.percentOff) return p;
  const price = Math.round(p.price * (1 - promo.percentOff / 100) * 100) / 100;
  return { ...p, price, compareAt: p.price, tag: { es: `-${promo.percentOff}%`, en: `-${promo.percentOff}%` }, promoId: promo.id };
}

export const SHOP: Product[] = PRODUCTS.map(withDiscount);
export const BUNDLES: Product[] = ACTIVE_PROMOS.filter((p) => p.kind === 'bundle').map(bundleToProduct);
const ALL = [...SHOP, ...BUNDLES];

export const byId = (id: string) => ALL.find((p) => p.id === id)!;
export const exists = (id: string) => ALL.some((p) => p.id === id);

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
