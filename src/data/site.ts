// Datos de contacto y negocio. Editar aquí cuando el cliente confirme.
export const SITE = {
  instagram: 'https://www.instagram.com/emestudiopr/',
  instagramHandle: '@emestudiopr',
  // TODO: número de WhatsApp del cliente en formato internacional, sin "+" (ej. 17875551234)
  whatsapp: '',
  freeShippingThreshold: 50,
  currency: 'USD',
};

export const EVENT = {
  title: 'Contornos y peinados modernos',
  show: 'San Juan Beauty Show',
  stage: 'Barber Stage',
  venue: 'Centro de Convenciones de PR',
  dates: '8 & 9 Nov',
  time: '11:20 AM',
  // 8 de noviembre 2026, 11:20 a.m. hora de Puerto Rico (UTC-4)
  startsAt: '2026-11-08T11:20:00-04:00',
  url: 'https://www.sanjuanbeautyshow.com',
};

export function whatsappLink(message: string) {
  const base = SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function money(n: number) {
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}
