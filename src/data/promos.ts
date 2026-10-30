// Especiales, ofertas y giveaways de EME STUDIO.
// Cada registro tiene la forma que tendrá en el panel de administración:
// el equipo crea la campaña, elige productos del inventario, pone precio o %,
// fechas, stock y colores, y la web la muestra sola (menú, hero, Especiales y tienda).
import type { L } from './types';

/** bundle: combinación de productos a precio especial (ej. 3 Clay Wax por $25)
 *  discount: % de descuento sobre un producto
 *  spotlight: destaca un producto existente con la imagen de la campaña */
export type PromoKind = 'bundle' | 'discount' | 'spotlight';

export interface PromoTheme {
  bg: string;
  fg: string;
  accent: string;
  accentFg: string;
}

export interface Promo {
  id: string;
  campaign: L;
  kind: PromoKind;
  title: L; // *texto* = serif itálica, \n = salto de línea
  name: L;
  description: L;
  badge: L;
  image: string; // recorte o foto para fondos oscuros
  studio?: string; // foto de estudio para fondos claros
  theme: PromoTheme;
  startsAt: string; // ISO con zona horaria de PR (-04:00)
  endsAt: string;
  featured?: boolean;
  stock?: number;
  stockTotal?: number;
  items?: { id: string; qty: number }[];
  priceCents?: number; // precio del bundle en centavos USD
  productId?: string;
  percentOff?: number;
}

const XMAS: PromoTheme = { bg: '#0E3B2C', fg: '#FFFFFF', accent: '#C8102E', accentFg: '#FFFFFF' };

export const PROMOS: Promo[] = [
  {
    id: 'navidad-kit',
    campaign: { es: 'Navidad EME', en: 'EME Christmas' },
    kind: 'spotlight',
    productId: 'kit-eme',
    title: { es: 'Regala\n*estilo.*', en: 'Gift\n*style.*' },
    name: { es: 'Kit EME STUDIO', en: 'EME STUDIO Kit' },
    description: {
      es: 'Curl Cream, Volume Powder, Clay Wax y Peinilla EME. El regalo listo para el que siempre sale bien peinado.',
      en: 'Curl Cream, Volume Powder, Clay Wax and the EME comb. The ready-made gift for the guy who never has a bad hair day.',
    },
    badge: { es: 'Especial Navidad', en: 'Christmas special' },
    image: '/media/kit-bag.webp',
    studio: '/media/st-kit.webp',
    theme: XMAS,
    startsAt: '2026-10-20T00:00:00-04:00',
    endsAt: '2026-12-25T00:00:00-04:00',
    featured: true,
    stock: 34,
    stockTotal: 100,
  },
  {
    id: '3-clay',
    campaign: { es: 'Oferta 3x', en: '3-pack deal' },
    kind: 'bundle',
    title: { es: '3 Clay Wax\n*por $25.*', en: '3 Clay Wax\n*for $25.*' },
    name: { es: '3 Clay Wax', en: '3 Clay Wax' },
    description: {
      es: 'Tres Clay Wax de 80 g para tener siempre a mano: en casa, en el carro y en el bulto.',
      en: 'Three 80 g Clay Wax so you always have one on hand: at home, in the car and in your bag.',
    },
    badge: { es: 'Ahorra $5', en: 'Save $5' },
    image: '/media/p-3clay.webp',
    studio: '/media/st-3clay.webp',
    theme: { bg: '#14171D', fg: '#F2F1EE', accent: '#C8102E', accentFg: '#FFFFFF' },
    startsAt: '2026-10-01T00:00:00-04:00',
    endsAt: '2026-12-31T23:59:00-04:00',
    stock: 40,
    stockTotal: 120,
    items: [{ id: 'clay-wax', qty: 3 }],
    priceCents: 2500,
  },
  {
    id: '3-volume',
    campaign: { es: 'Oferta 3x', en: '3-pack deal' },
    kind: 'bundle',
    title: { es: '3 Volume Powder\n*por $30.*', en: '3 Volume Powder\n*for $30.*' },
    name: { es: '3 Volume Powder', en: '3 Volume Powder' },
    description: {
      es: 'Tres Volume Powder de 20 g. Volumen máximo para todo el mes — o para compartir con tu gente.',
      en: 'Three 20 g Volume Powder. Maximum volume all month long — or to share with your crew.',
    },
    badge: { es: 'Ahorra $6', en: 'Save $6' },
    image: '/media/p-3volume.webp',
    studio: '/media/st-3volume.webp',
    theme: { bg: '#B30F29', fg: '#FFFFFF', accent: '#FFFFFF', accentFg: '#B30F29' },
    startsAt: '2026-10-01T00:00:00-04:00',
    endsAt: '2026-12-31T23:59:00-04:00',
    stock: 30,
    stockTotal: 90,
    items: [{ id: 'volume-powder', qty: 3 }],
    priceCents: 3000,
  },
  {
    id: 'madres-2027',
    campaign: { es: 'Día de las Madres', en: "Mother's Day" },
    kind: 'bundle',
    title: { es: 'Para *ella.*', en: 'For *her.*' },
    name: { es: 'Especial Día de las Madres', en: "Mother's Day special" },
    description: {
      es: 'Un especial para la reina de la casa. Actívale el aviso y te escribimos el día que salga.',
      en: 'A special for the queen of the house. Turn on the alert and we’ll message you the day it drops.',
    },
    badge: { es: 'Próximamente', en: 'Coming soon' },
    image: '/media/curl-display.webp',
    theme: { bg: '#3A1730', fg: '#FBEFF5', accent: '#F4A6C6', accentFg: '#3A1730' },
    startsAt: '2027-04-26T00:00:00-04:00',
    endsAt: '2027-05-10T00:00:00-04:00',
  },
];

/* ---------- Giveaways (sorteos) ---------- */
export interface Giveaway {
  id: string;
  title: L;
  prize: L;
  prizeValue: number;
  image: string;
  endsAt: string;
  drawAt: string;
  winners: number;
  steps: L[];
}

export const GIVEAWAYS: Giveaway[] = [
  {
    id: 'giveaway-navidad',
    title: { es: 'Giveaway\n*navideño.*', en: 'Christmas\n*giveaway.*' },
    prize: { es: '1 Kit EME STUDIO completo', en: '1 complete EME STUDIO Kit' },
    prizeValue: 35,
    image: '/media/kit-bag.webp',
    endsAt: '2026-12-15T23:59:00-04:00',
    drawAt: '2026-12-16T12:00:00-04:00',
    winners: 3,
    steps: [
      { es: 'Sigue a @emestudiopr en Instagram', en: 'Follow @emestudiopr on Instagram' },
      { es: 'Etiqueta a 2 amigos en el post del giveaway', en: 'Tag 2 friends on the giveaway post' },
      { es: 'Regístrate aquí para confirmar tu entrada', en: 'Register here to confirm your entry' },
    ],
  },
];

/* ---------- Códigos de descuento ---------- */
export interface DiscountCode {
  code: string;
  percentOff: number;
  label: L;
  minSubtotal?: number;
  expiresAt?: string;
}

export const CODES: DiscountCode[] = [
  { code: 'CLUBEME10', percentOff: 10, label: { es: 'Club EME · primera orden', en: 'Club EME · first order' } },
  { code: 'NAVIDAD15', percentOff: 15, minSubtotal: 40, expiresAt: '2026-12-25T00:00:00-04:00', label: { es: 'Navidad · órdenes de $40+', en: 'Christmas · orders $40+' } },
];

export type PromoStatus = 'upcoming' | 'active' | 'ended';

export function promoStatus(p: { startsAt: string; endsAt: string }, now = Date.now()): PromoStatus {
  if (now < new Date(p.startsAt).getTime()) return 'upcoming';
  if (now > new Date(p.endsAt).getTime()) return 'ended';
  return 'active';
}
