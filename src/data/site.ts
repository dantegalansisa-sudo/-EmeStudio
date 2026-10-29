// Datos de negocio. Todo lo marcado TODO lo debe confirmar el cliente.
export const SITE = {
  brand: 'EME STUDIO',
  // TODO: razón social exacta y dirección física (aparecen en Términos y Privacidad)
  legalName: 'EME STUDIO',
  address: 'Puerto Rico',
  email: 'hola@eme-studio.com', // TODO: confirmar correo de servicio al cliente
  instagram: 'https://www.instagram.com/emestudiopr/',
  instagramHandle: '@emestudiopr',
  // TODO: número de WhatsApp del cliente en formato internacional, sin "+" (ej. 17875551234)
  whatsapp: '',
  currency: 'USD',
  freeShippingThreshold: 50,
  // TODO: tarifa real de envío en PR (por debajo del mínimo de envío gratis)
  shippingFlat: 6,
  // IVU de Puerto Rico: 10.5% estatal + 1% municipal
  taxRate: 0.115,
  shipsIn: { es: '1 a 3 días laborables', en: '1–3 business days' }, // TODO: confirmar
  returnDays: 14, // TODO: confirmar política de devoluciones
};

/* Temporada activa: cambia la paleta y las animaciones de todo el sitio.
   null = marca normal (azul cobalto). */
export type SeasonId = 'navidad';
export const SEASON: { id: SeasonId; primary: string; primary2: string; green: string; snow: boolean } | null = {
  id: 'navidad',
  primary: '#C8102E', // rojo navideño
  primary2: '#E5383B',
  green: '#0E3B2C', // verde pino
  snow: true,
};

export const BRAND_BLUE = '#1E4FD8';

export function whatsappLink(message: string) {
  const base = SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function money(n: number) {
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}

export function money2(n: number) {
  return `$${n.toFixed(2)}`;
}
