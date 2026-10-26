// Catálogo efectivo: productos base + promociones activas aplicadas.
// Todo el sitio lee de aquí, así un especial nuevo se refleja solo en tienda, ficha y carrito.
import { PRODUCTS, type Product } from './products';
import { PROMOS, promoStatus, type Promo } from './promos';

const base = (id: string) => PRODUCTS.find((p) => p.id === id)!;

export const ACTIVE_PROMOS = PROMOS.filter((p) => promoStatus(p) === 'active');
export const UPCOMING_PROMOS = PROMOS.filter((p) => promoStatus(p) === 'upcoming');
export const FEATURED_PROMO = ACTIVE_PROMOS.find((p) => p.featured) ?? ACTIVE_PROMOS[0];

export const bundleId = (promo: Promo) => `promo-${promo.id}`;

/* Precio regular de un bundle = suma de sus productos */
export function bundleValue(promo: Promo) {
  return (promo.items ?? []).reduce((a, it) => a + base(it.id).price * it.qty, 0);
}

function bundleToProduct(promo: Promo): Product {
  const items = promo.items ?? [];
  return {
    id: bundleId(promo),
    name: promo.name,
    short: promo.campaign,
    tagline: promo.badge,
    description: promo.description,
    size: items.map((it) => `${it.qty > 1 ? `${it.qty}× ` : ''}${base(it.id).short}`).join(' + '),
    price: promo.price!,
    compareAt: bundleValue(promo),
    category: 'kits',
    tag: promo.badge,
    finish: 'Especial',
    hold: 0,
    shine: 0,
    images: [promo.image, ...items.map((it) => base(it.id).images[0])],
    benefits: items.map((it) => `${it.qty > 1 ? `${it.qty} × ` : ''}${base(it.id).name} · ${base(it.id).size}`),
    howTo: ['Añádelo a tu bolsa.', 'Confirma tu pedido por WhatsApp.', 'Disponible hasta agotar inventario del especial.'],
    accent: promo.theme.accent,
    promoId: promo.id,
  };
}

function withDiscount(p: Product): Product {
  const promo = ACTIVE_PROMOS.find((x) => x.kind === 'discount' && x.productId === p.id);
  if (!promo || !promo.percentOff) return p;
  const price = Math.round(p.price * (1 - promo.percentOff / 100) * 100) / 100;
  return { ...p, price, compareAt: p.price, tag: `-${promo.percentOff}% · ${promo.badge}`, promoId: promo.id };
}

export const SHOP: Product[] = PRODUCTS.map(withDiscount);
export const BUNDLES: Product[] = ACTIVE_PROMOS.filter((p) => p.kind === 'bundle').map(bundleToProduct);
const ALL = [...SHOP, ...BUNDLES];

export const byId = (id: string) => ALL.find((p) => p.id === id)!;
export const promoById = (id: string) => PROMOS.find((p) => p.id === id)!;

/* Producto que representa un especial (bundle o producto con descuento) */
export function promoProduct(promo: Promo) {
  return promo.kind === 'bundle' ? byId(bundleId(promo)) : byId(promo.productId!);
}

export const savings = (p: Product) => (p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0);
