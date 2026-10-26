// Especiales y promociones de EME STUDIO.
// Cada registro tiene la forma que tendrá en el panel de administración:
// el equipo crea la campaña, elige productos del inventario, pone precio o %,
// fechas y colores, y la web la muestra sola (menú, hero, sección Especiales y tienda).

export type PromoKind = 'bundle' | 'discount';

export interface PromoTheme {
  bg: string; // fondo de la campaña
  fg: string; // texto
  accent: string; // color de acento (badges, precios)
}

export interface Promo {
  id: string;
  campaign: string; // "Navidad", "Día de las Madres", "Liquidación"...
  kind: PromoKind;
  title: string; // titular grande; *texto* = serif itálica, \n = salto de línea
  name: string; // nombre comercial del especial
  description: string;
  badge: string;
  image: string;
  theme: PromoTheme;
  startsAt: string; // ISO con zona horaria de PR (-04:00)
  endsAt: string;
  featured?: boolean; // ocupa el hero y la cabecera de Especiales
  stock?: number; // unidades disponibles para el especial
  stockTotal?: number;
  // bundle: combinación de productos del inventario a un precio especial
  items?: { id: string; qty: number }[];
  price?: number;
  // discount: % de descuento sobre un producto existente
  productId?: string;
  percentOff?: number;
}

export const PROMOS: Promo[] = [
  {
    id: 'navidad-2026',
    campaign: 'Temporada Navideña',
    kind: 'bundle',
    title: 'Regala\n*estilo.*',
    name: 'Kit Regalo Navideño',
    description: 'Clay Wax, Curl Cream y Peinilla EME en la bolsa oficial. El regalo listo para el que siempre sale bien peinado.',
    badge: 'Especial Navidad',
    image: '/media/kit-bag.webp',
    theme: { bg: '#0D2A22', fg: '#F5EFE2', accent: '#E6C27A' },
    startsAt: '2026-10-20T00:00:00-04:00',
    endsAt: '2026-12-25T00:00:00-04:00',
    featured: true,
    stock: 34,
    stockTotal: 100,
    items: [
      { id: 'clay-wax', qty: 1 },
      { id: 'curl-cream', qty: 1 },
      { id: 'peinilla', qty: 1 },
    ],
    price: 42,
  },
  {
    id: 'liquidacion-clay',
    campaign: 'Liquidación',
    kind: 'discount',
    title: 'Clay Wax\n*-25%.*',
    name: 'Clay Wax en liquidación',
    description: 'Inventario limitado a precio especial. Cuando se acabe, vuelve a su precio regular.',
    badge: 'Liquidación',
    image: '/media/clay-stack.webp',
    theme: { bg: '#1B46C9', fg: '#F4F6FF', accent: '#FFFFFF' },
    startsAt: '2026-10-01T00:00:00-04:00',
    endsAt: '2026-11-30T23:59:00-04:00',
    stock: 40,
    stockTotal: 120,
    productId: 'clay-wax',
    percentOff: 25,
  },
  {
    id: 'combo-volumen',
    campaign: 'Combo',
    kind: 'bundle',
    title: 'Combo\n*volumen.*',
    name: 'Combo Volumen',
    description: 'Volume Powder para levantar + Clay Wax para fijar. El dúo que más usan nuestros barberos.',
    badge: 'Combo',
    image: '/media/duo-powder-clay.webp',
    theme: { bg: '#14171D', fg: '#F2F1EE', accent: '#4D84FF' },
    startsAt: '2026-10-01T00:00:00-04:00',
    endsAt: '2026-12-31T23:59:00-04:00',
    stock: 25,
    stockTotal: 60,
    items: [
      { id: 'volume-powder', qty: 1 },
      { id: 'clay-wax', qty: 1 },
    ],
    price: 32,
  },
  {
    id: 'madres-2027',
    campaign: 'Día de las Madres',
    kind: 'bundle',
    title: 'Para *ella.*',
    name: 'Especial Día de las Madres',
    description: 'Un especial para la reina de la casa. Actívale el aviso y te escribimos el día que salga.',
    badge: 'Próximamente',
    image: '/media/curl-display.webp',
    theme: { bg: '#3A1730', fg: '#FBEFF5', accent: '#F4A6C6' },
    startsAt: '2027-04-26T00:00:00-04:00',
    endsAt: '2027-05-10T00:00:00-04:00',
    items: [{ id: 'curl-cream', qty: 2 }],
    price: 38,
  },
];

export type PromoStatus = 'upcoming' | 'active' | 'ended';

export function promoStatus(p: Promo, now = Date.now()): PromoStatus {
  if (now < new Date(p.startsAt).getTime()) return 'upcoming';
  if (now > new Date(p.endsAt).getTime()) return 'ended';
  return 'active';
}
