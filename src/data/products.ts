// Catálogo EME STUDIO.
// NOTA: los precios son provisionales hasta recibir la lista oficial del cliente.
export type Category = 'styling' | 'rizos' | 'herramientas' | 'kits';

export interface Product {
  id: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  size: string;
  price: number;
  compareAt?: number;
  category: Category;
  tag?: string;
  finish: string;
  hold: number; // 0-5
  shine: number; // 0-5
  images: string[];
  video?: string;
  benefits: string[];
  howTo: string[];
  accent: string;
  promoId?: string; // especial que afecta este producto
}

const m = (f: string) => `/media/${f}`;

export const PRODUCTS: Product[] = [
  {
    id: 'volume-powder',
    name: 'Volume Powder',
    short: 'Powder',
    tagline: 'Volumen máximo. Fijación fuerte.',
    description:
      'Polvo texturizante que levanta desde la raíz y deja un acabado mate natural. Un toque y el cabello gana cuerpo, agarre y forma — sin peso, sin brillo.',
    size: '20 g · 0.7 oz',
    price: 18,
    category: 'styling',
    tag: 'Bestseller',
    finish: 'Mate',
    hold: 4,
    shine: 1,
    images: [m('powder-front.webp'), m('powder-spray.webp'), m('duo-powder-clay.webp')],
    video: m('v-powder-spin.mp4'),
    benefits: ['Volumen instantáneo desde la raíz', 'Acabado mate, cero brillo', 'Fijación fuerte todo el día', 'Ligero: no apelmaza'],
    howTo: ['Aplica directo a la raíz con el cabello seco.', 'Masajea con los dedos para activar la textura.', 'Define la forma con la Peinilla EME.'],
    accent: '#1E4FD8',
  },
  {
    id: 'clay-wax',
    name: 'Clay Wax',
    short: 'Clay',
    tagline: 'Control flexible. Acabado natural.',
    description:
      'Cera de arcilla con agarre firme y re-moldeable. Esculpe, separa y mantiene la forma desde el sillón hasta el final del día, con un acabado natural de bajo brillo.',
    size: '80 g · 2.8 oz',
    price: 20,
    category: 'styling',
    tag: 'Favorito del barbero',
    finish: 'Natural',
    hold: 4,
    shine: 2,
    images: [m('clay-held.webp'), m('clay-blueglove.webp'), m('clay-stack.webp')],
    benefits: ['Agarre firme y re-moldeable', 'Textura definida y separada', 'Bajo brillo, look natural', 'Se retira fácil con agua'],
    howTo: ['Toma una porción pequeña y caliéntala entre los dedos.', 'Distribuye de atrás hacia adelante.', 'Esculpe y separa con las puntas de los dedos.'],
    accent: '#2B2F38',
  },
  {
    id: 'curl-cream',
    name: 'Curl Cream',
    short: 'Curl',
    tagline: 'Rizo definido. Cero frizz.',
    description:
      'Crema de control extra para rizos. Hidrata, define y combate el encrespamiento sin dejar el cabello duro ni pegajoso. Rizos con flow, en un solo paso.',
    size: '250 ml · 8.8 fl oz',
    price: 22,
    category: 'rizos',
    tag: 'Nuevo',
    finish: 'Natural',
    hold: 2,
    shine: 3,
    images: [m('curl-top.webp'), m('curl-held.webp'), m('model-curls.webp')],
    benefits: ['Control extra del rizo', 'Realza y define cada rizo', 'Combate el frizz', 'Protege la fijación'],
    howTo: ['Aplica sobre el cabello húmedo.', 'Distribuye de medios a puntas, sin frotar.', 'Deja secar al aire o con difusor.'],
    accent: '#E7EAEE',
  },
  {
    id: 'peinilla',
    name: 'Peinilla EME',
    short: 'Peinilla',
    tagline: 'Precisión de barbería, en casa.',
    description:
      'Peinilla de dientes anchos con acabado mate y logo grabado. Diseñada para distribuir producto y dar forma sin romper la textura.',
    size: 'Dientes anchos',
    price: 10,
    category: 'herramientas',
    finish: '—',
    hold: 0,
    shine: 0,
    images: [m('comb.webp'), m('clay-comb.webp')],
    benefits: ['Dientes anchos: no rompe la textura', 'Acabado mate antideslizante', 'Logo EME grabado', 'Ideal con Clay Wax y Curl Cream'],
    howTo: ['Úsala después de aplicar el producto.', 'Peina en la dirección del estilo.', 'Termina con los dedos para un look natural.'],
    accent: '#111318',
  },
  {
    id: 'kit-eme',
    name: 'Kit EME Completo',
    short: 'Kit',
    tagline: 'Los 4 esenciales. Una rutina.',
    description:
      'Volume Powder, Clay Wax, Curl Cream y Peinilla EME en la bolsa oficial. Todo lo que necesitas para llevarte el resultado del sillón a tu rutina diaria.',
    size: '4 productos + bolsa EME',
    price: 62,
    compareAt: 70,
    category: 'kits',
    tag: 'Ahorra $8',
    finish: 'Completo',
    hold: 5,
    shine: 2,
    images: [m('kit-curl-powder.webp'), m('kit-bag.webp')],
    benefits: ['Volume Powder 20 g', 'Clay Wax 80 g', 'Curl Cream 250 ml', 'Peinilla EME + bolsa oficial'],
    howTo: ['Escoge el producto según tu look del día.', 'Combina Powder + Clay para volumen con control.', 'Usa Curl Cream en días de rizo libre.'],
    accent: '#0B0D12',
  },
];

