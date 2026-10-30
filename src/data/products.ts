// Catálogo base de EME STUDIO (información oficial enviada por el cliente).
// Cada campo de texto es bilingüe; en el panel serán dos campos (ES / EN).
import type { L } from './types';

export type Category = 'styling' | 'rizos' | 'herramientas' | 'kits';

export interface Spec {
  label: L;
  value: number; // 0–5 (admite .5)
  note: L;
}

export interface Product {
  id: string;
  name: string; // nombre comercial (igual en ambos idiomas)
  short: string;
  type: L; // "Polvo para el cabello"
  tagline: L;
  description: L;
  size: string;
  /** Precio en centavos USD: fuente de verdad (el backend de pago cobra este valor) */
  priceCents: number;
  compareAtCents?: number;
  /** Derivados en catalog.ts (dólares) para mostrar en pantalla */
  price: number;
  compareAt?: number;
  category: Category;
  tag?: L;
  finish: L;
  hold: number; // 0–5
  shine: number; // 0–5
  specs: Spec[];
  /** Foto de estudio en fondo blanco: se funde con mix-blend-mode: multiply en fondos claros */
  studio: string;
  /** Recorte con transparencia para fondos oscuros (si existe) */
  cutout?: string;
  gallery: string[];
  video?: string;
  benefits: L[];
  howTo: L[];
  ingredients?: L;
  warnings?: L;
  accent: string;
  promoId?: string;
}

const m = (f: string) => `/media/${f}`;

const COSMETIC_WARNING: L = {
  es: 'Solo para uso externo. Evita el contacto con los ojos; si ocurre, enjuaga con abundante agua. Suspende su uso si aparece irritación. Mantener fuera del alcance de los niños. Recomendamos una prueba en una pequeña zona de la piel antes del primer uso.',
  en: 'For external use only. Avoid contact with eyes; if contact occurs, rinse thoroughly with water. Discontinue use if irritation occurs. Keep out of reach of children. We recommend a small patch test before first use.',
};

/** Producto tal como se edita aquí (los precios en dólares los calcula catalog.ts) */
export type BaseProduct = Omit<Product, 'price' | 'compareAt'>;

export const PRODUCTS: BaseProduct[] = [
  {
    id: 'volume-powder',
    name: 'Volume Powder',
    short: 'Powder',
    type: { es: 'Polvo para el cabello', en: 'Hair styling powder' },
    tagline: { es: 'Máximo volumen. Fijación fuerte.', en: 'Maximum volume. Strong hold.' },
    description: {
      es: 'Polvo texturizante que aporta volumen y fijación fuerte desde la raíz. Proporciona gran volumen y textura con un acabado mate, sin peso.',
      en: 'A texturizing powder that delivers volume and strong hold from the roots. Big volume and texture with a matte, weightless finish.',
    },
    size: '20 g · 0.7 oz',
    priceCents: 1200,
    category: 'styling',
    tag: { es: 'Bestseller', en: 'Bestseller' },
    finish: { es: 'Mate', en: 'Matte' },
    hold: 4,
    shine: 0.5,
    specs: [
      { label: { es: 'Volumen', en: 'Volume' }, value: 5, note: { es: 'Máximo', en: 'Maximum' } },
      { label: { es: 'Fijación', en: 'Hold' }, value: 4, note: { es: 'Fuerte', en: 'Strong' } },
      { label: { es: 'Acabado mate', en: 'Matte finish' }, value: 5, note: { es: 'Mate total', en: 'Fully matte' } },
    ],
    studio: m('st-volume.webp'),
    cutout: m('p-volume.webp'),
    gallery: [m('powder-spray.webp'), m('powder-front.webp'), m('duo-powder-clay.webp')],
    video: m('v-powder-spin.mp4'),
    benefits: [
      { es: 'Máximo volumen desde la raíz', en: 'Maximum volume from the roots' },
      { es: 'Fijación fuerte y duradera', en: 'Strong, long-lasting hold' },
      { es: 'Gran textura con acabado mate', en: 'Big texture with a matte finish' },
      { es: 'Cunde mucho: poca cantidad basta', en: 'A little goes a long way' },
    ],
    howTo: [
      { es: 'Aplica sobre el cabello seco.', en: 'Apply to dry hair.' },
      { es: 'Espolvorea una pequeña cantidad en las raíces.', en: 'Sprinkle a small amount at the roots.' },
      { es: 'Distribuye suavemente con las yemas de los dedos.', en: 'Work it in gently with your fingertips.' },
      { es: 'Peina como desees. Usa con moderación: cunde mucho.', en: 'Style as desired. Use sparingly — it goes a long way.' },
    ],
    ingredients: {
      es: 'Almidón de Zea Mays (maíz), sílice sililada, agua, glicerina, PVP, niacinamida, ceramida NP, extracto de Camellia Sinensis, tocoferol, benzoato de sodio.',
      en: 'Zea Mays (Corn) Starch, Silica Silylate, Water, Glycerin, PVP, Niacinamide, Ceramide NP, Camellia Sinensis Extract, Tocopherol, Sodium Benzoate.',
    },
    warnings: COSMETIC_WARNING,
    accent: '#1E4FD8',
  },
  {
    id: 'clay-wax',
    name: 'Clay Wax',
    short: 'Clay',
    type: { es: 'Cera de arcilla', en: 'Clay wax' },
    tagline: { es: 'Fijación extra fuerte. Acabado natural.', en: 'Extra-strong hold. Natural finish.' },
    description: {
      es: 'Cera de arcilla de textura firme que aumenta el grosor y aporta textura. Fijación extra fuerte con un acabado mate medio de aspecto natural. Ideal para cabello ondulado.',
      en: 'A firm-texture clay wax that builds thickness and texture. Extra-strong hold with a medium-matte, natural-looking finish. Ideal for wavy hair.',
    },
    size: '80 g · 2.8 oz',
    priceCents: 1000,
    category: 'styling',
    tag: { es: 'Favorito del barbero', en: "Barber's favorite" },
    finish: { es: 'Mate medio', en: 'Medium matte' },
    hold: 4,
    shine: 1.5,
    specs: [
      { label: { es: 'Fijación', en: 'Hold' }, value: 4, note: { es: 'Extra fuerte', en: 'Extra strong' } },
      { label: { es: 'Textura', en: 'Texture' }, value: 4.5, note: { es: 'Dura / rígida', en: 'Firm / rigid' } },
      { label: { es: 'Acabado mate', en: 'Matte finish' }, value: 3.5, note: { es: 'Mate medio, natural', en: 'Medium matte, natural' } },
    ],
    studio: m('st-clay.webp'),
    cutout: m('p-clay.webp'),
    gallery: [m('st-clay-open.webp'), m('clay-held.webp'), m('clay-blueglove.webp'), m('st-clay-top.webp')],
    benefits: [
      { es: 'Fijación extra fuerte', en: 'Extra-strong hold' },
      { es: 'Aumenta el grosor del cabello', en: 'Builds hair thickness' },
      { es: 'Aporta textura definida', en: 'Adds defined texture' },
      { es: 'Ideal para cabello ondulado', en: 'Ideal for wavy hair' },
    ],
    howTo: [
      { es: 'Toma una cantidad adecuada de cera de arcilla.', en: 'Take an adequate amount of clay wax.' },
      { es: 'Frótala en la palma de la mano hasta que se derrita.', en: 'Rub it between your palms until it melts.' },
      { es: 'Aplícala sobre el cabello y da forma.', en: 'Apply it to your hair and shape.' },
    ],
    ingredients: {
      es: 'Agua, cera microcristalina, ceteareth-20, estearato de glicerilo, propilenglicol, cera de carnauba PEG-12, aceite de argán, ceresina, copolímero de acrilatos/VP, PVP, bentonita, DMDM hidantoína, perfume.',
      en: 'Water, Microcrystalline Wax, Ceteareth-20, Glyceryl Stearate, Propylene Glycol, PEG-12 Carnauba Wax, Argan Oil, Ceresin, Acrylates/VP Copolymer, PVP, Bentonite, DMDM Hydantoin, Fragrance (Parfum).',
    },
    warnings: COSMETIC_WARNING,
    accent: '#2B2F38',
  },
  {
    id: 'curl-cream',
    name: 'Curl Cream',
    short: 'Curl',
    type: { es: 'Crema para rizos', en: 'Curl cream' },
    tagline: { es: 'Rizo definido. Cero frizz.', en: 'Defined curls. Zero frizz.' },
    description: {
      es: 'Crema de control extra que realza los rizos, combate el encrespamiento y protege la fijación. Deja un tacto sedoso, aporta suavidad y brillo. No se enjuaga.',
      en: 'An extra-control cream that enhances curls, fights frizz and protects hold. Leaves a silky feel with added softness and shine. Leave-in formula.',
    },
    size: '250 ml · 8.8 fl oz',
    priceCents: 1200,
    category: 'rizos',
    tag: { es: 'Nuevo', en: 'New' },
    finish: { es: 'Natural con brillo', en: 'Natural with shine' },
    hold: 2.5,
    shine: 3,
    specs: [
      { label: { es: 'Control', en: 'Control' }, value: 4, note: { es: 'Control extra', en: 'Extra control' } },
      { label: { es: 'Anti-frizz', en: 'Anti-frizz' }, value: 4.5, note: { es: 'Combate el encrespamiento', en: 'Fights frizz' } },
      { label: { es: 'Brillo', en: 'Shine' }, value: 3, note: { es: 'Aporta brillo', en: 'Adds shine' } },
    ],
    studio: m('st-curl.webp'),
    gallery: [m('st-curl-open.webp'), m('model-curls.webp'), m('curl-held.webp'), m('curl-top.webp')],
    benefits: [
      { es: 'Control extra del peinado', en: 'Extra styling control' },
      { es: 'Realza y define los rizos', en: 'Enhances and defines curls' },
      { es: 'Combate el encrespamiento', en: 'Fights frizz' },
      { es: 'Tacto sedoso, suavidad y brillo', en: 'Silky feel, softness and shine' },
    ],
    howTo: [
      { es: 'Aplica por secciones, desde la raíz hacia las puntas. No enjuagues.', en: 'Apply section by section, from roots to ends. Do not rinse.' },
      { es: 'Cabello húmedo: divide en secciones y distribuye uniformemente con los dedos. Ideal para lavado y listo.', en: 'Damp hair: section the hair and distribute evenly with your fingers. Perfect for wash-and-go.' },
      { es: 'Cabello seco: aplica una pequeña cantidad directamente sobre los rizos para definirlos, rehidratarlos y controlar el frizz.', en: 'Dry hair: apply a small amount directly to curls to define, rehydrate and control frizz.' },
    ],
    ingredients: {
      es: 'Agua, copolímero de acrilatos, miristato de isopropilo, ceteareth-25, ceteareth-6, fragancia, propilenglicol, diazolidinil urea, alcohol estearílico, aceite de semilla de Macadamia Ternifolia, aceite de argán (Argania Spinosa), extracto de fruto de Chaenomeles Sinensis, butilcarbamato de yodopropinilo, manteca de karité (Butyrospermum Parkii), extracto de semilla de soja (Glycine Soja), aceite de oliva (Olea Europaea), tocoferol, queratina hidrolizada, queratina, fenoxietanol, queratina oxidada.',
      en: 'Water, Acrylates Copolymer, Isopropyl Myristate, Ceteareth-25, Ceteareth-6, Fragrance, Propylene Glycol, Diazolidinyl Urea, Stearyl Alcohol, Macadamia Ternifolia Seed Oil, Argania Spinosa (Argan) Kernel Oil, Chaenomeles Sinensis Fruit Extract, Iodopropynyl Butylcarbamate, Butyrospermum Parkii (Shea) Butter, Glycine Soja (Soybean) Seed Extract, Olea Europaea (Olive) Oil, Tocopherol, Hydrolyzed Keratin, Keratin, Phenoxyethanol, Oxidized Keratin.',
    },
    warnings: COSMETIC_WARNING,
    accent: '#E7EAEE',
  },
  {
    id: 'peinilla',
    name: 'Peinilla EME',
    short: 'Peinilla',
    type: { es: 'Peinilla de fibra de carbono', en: 'Carbon fiber comb' },
    tagline: { es: 'Fibra de carbono. Cero estática.', en: 'Carbon fiber. Zero static.' },
    description: {
      es: 'Peinilla de dientes anchos en fibra de carbono: antiestática y resistente al calor. Diseñada para estilos masculinos con textura, sin romper la definición.',
      en: 'A wide-tooth carbon fiber comb: antistatic and heat resistant. Designed for textured men’s styles without breaking definition.',
    },
    size: 'Carbon fiber',
    priceCents: 800,
    category: 'herramientas',
    finish: { es: 'Fibra de carbono', en: 'Carbon fiber' },
    hold: 0,
    shine: 0,
    specs: [],
    studio: m('p-comb.webp'),
    cutout: m('p-comb.webp'),
    gallery: [m('comb.webp'), m('st-clay-comb.webp'), m('clay-comb.webp')],
    benefits: [
      { es: 'Fibra de carbono', en: 'Carbon fiber' },
      { es: 'Antiestática: menos frizz', en: 'Antistatic: less frizz' },
      { es: 'Resistente al calor', en: 'Heat resistant' },
      { es: 'Para estilos con textura', en: 'Made for textured styles' },
    ],
    howTo: [
      { es: 'Úsala después de aplicar tu producto EME.', en: 'Use it after applying your EME product.' },
      { es: 'Peina en la dirección del estilo.', en: 'Comb in the direction of your style.' },
      { es: 'Termina con los dedos para un look natural.', en: 'Finish with your fingers for a natural look.' },
    ],
    accent: '#111318',
  },
  {
    id: 'kit-eme',
    name: 'Kit EME STUDIO',
    short: 'Kit',
    type: { es: 'Kit completo', en: 'Complete kit' },
    tagline: { es: 'Los 4 esenciales. Una rutina.', en: 'The 4 essentials. One routine.' },
    description: {
      es: '1 Curl Cream, 1 Volume Powder, 1 Clay Wax y 1 Peinilla EME. Todo lo que necesitas para llevarte el resultado del sillón a tu rutina diaria.',
      en: '1 Curl Cream, 1 Volume Powder, 1 Clay Wax and 1 EME comb. Everything you need to take the barber-chair result into your daily routine.',
    },
    size: '4 productos · 4 products',
    priceCents: 3500,
    compareAtCents: 4200,
    category: 'kits',
    tag: { es: 'Ahorra $7', en: 'Save $7' },
    finish: { es: 'Completo', en: 'Complete' },
    hold: 0,
    shine: 0,
    specs: [],
    studio: m('st-kit.webp'),
    gallery: [m('kit-bag.webp'), m('kit-curl-powder.webp'), m('st-clay-comb.webp')],
    benefits: [
      { es: '1 Curl Cream · 250 ml', en: '1 Curl Cream · 250 ml' },
      { es: '1 Volume Powder · 20 g', en: '1 Volume Powder · 20 g' },
      { es: '1 Clay Wax · 80 g', en: '1 Clay Wax · 80 g' },
      { es: '1 Peinilla EME de fibra de carbono', en: '1 EME carbon fiber comb' },
    ],
    howTo: [
      { es: 'Volume Powder para volumen y textura mate.', en: 'Volume Powder for volume and matte texture.' },
      { es: 'Clay Wax para fijar con acabado natural.', en: 'Clay Wax to lock it in with a natural finish.' },
      { es: 'Curl Cream los días de rizo libre.', en: 'Curl Cream on free-curl days.' },
    ],
    warnings: COSMETIC_WARNING,
    accent: '#0B0D12',
  },
];
