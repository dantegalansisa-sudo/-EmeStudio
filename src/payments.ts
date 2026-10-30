// Inicia el pago con Stripe Checkout a través de la Pages Function /api/checkout.
// Solo se envían ids y cantidades: el precio lo calcula el servidor desde el catálogo.
export async function startCheckout(lines: { id: string; qty: number }[]) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(lines.map((l) => ({ id: l.id, quantity: l.qty }))),
  });
  let data: { url?: string; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* respuesta no JSON (p. ej. la Function no está desplegada) */
  }
  if (!res.ok || !data.url) {
    throw new Error(data.error ?? `No se pudo conectar con el servidor de pago (${res.status}).`);
  }
  window.location.href = data.url;
}
