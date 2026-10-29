import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { byId, displayName, totals } from '../data/catalog';
import { SITE, money2, whatsappLink } from '../data/site';
import { useLang } from '../i18n';
import { goHome, navigate } from '../router';
import { useStore } from '../store';
import { EASE } from '../utils';
import { Icon } from './ui';
import { CodeField, Summary } from './Overlays';
import { Stage } from './Collection';

/* Checkout estilo EE. UU.: contacto → entrega → resumen con IVU → consentimiento.
   En la demo la orden se confirma por WhatsApp; en producción se conecta la pasarela de pago. */
export default function Checkout() {
  const { lines, code, clear } = useStore();
  const { t, lang } = useLang();
  const [mode, setMode] = useState<'ship' | 'pickup'>('ship');
  const [f, setF] = useState({ name: '', email: '', phone: '', street: '', city: '', zip: '', notes: '', terms: false, sms: false });
  const [placed, setPlaced] = useState<string | null>(null);
  const tt = totals(lines, code, mode === 'pickup');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value });

  const valid =
    f.name.trim() && /\S+@\S+\.\S+/.test(f.email) && f.phone.replace(/\D/g, '').length >= 10 && f.terms && (mode === 'pickup' || (f.street.trim() && f.city.trim() && /^\d{5}$/.test(f.zip)));

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const order = `EME-${Date.now().toString().slice(-6)}`;
    const items = lines.map((l) => `• ${l.qty} × ${displayName(byId(l.id), 'es')} — ${money2(byId(l.id).price * l.qty)}`).join('\n');
    const msg = [
      `¡Hola EME STUDIO! Nueva orden ${order}`,
      '',
      items,
      '',
      `Subtotal: ${money2(tt.subtotal)}`,
      tt.discount ? `Descuento (${tt.code?.code}): -${money2(tt.discount)}` : '',
      `${mode === 'pickup' ? 'Recogido' : 'Envío'}: ${tt.shipping ? money2(tt.shipping) : 'Gratis'}`,
      `IVU 11.5%: ${money2(tt.tax)}`,
      `TOTAL: ${money2(tt.total)}`,
      '',
      `Nombre: ${f.name}`,
      `Email: ${f.email}`,
      `Tel: ${f.phone}`,
      mode === 'ship' ? `Dirección: ${f.street}, ${f.city}, PR ${f.zip}` : 'Entrega: recogido (coordinar)',
      f.notes ? `Notas: ${f.notes}` : '',
    ]
      .filter((x) => x !== '')
      .join('\n');
    window.open(whatsappLink(msg), '_blank', 'noreferrer');
    setPlaced(order);
    clear();
  };

  if (placed) {
    return (
      <main className="co co--done container" id="main" tabIndex={-1}>
        <motion.div className="co__done" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE.out }}>
          <span className="give__okicon">
            <Icon.Check />
          </span>
          <span className="mono">
            {t('Orden', 'Order')} {placed}
          </span>
          <h1>{t('¡Gracias por tu orden!', 'Thanks for your order!')}</h1>
          <p>
            {t(
              'Te enviamos el detalle por WhatsApp. Allí confirmamos el pago y el tiempo de entrega. Si no se abrió WhatsApp, escríbenos a ',
              'We sent the details via WhatsApp, where we’ll confirm payment and delivery time. If WhatsApp didn’t open, email us at ',
            )}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
          <button className="btn btn--dark" onClick={() => goHome()}>
            {t('Seguir comprando', 'Continue shopping')} <Icon.Arrow />
          </button>
        </motion.div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="co co--done container" id="main" tabIndex={-1}>
        <h1>{t('Tu bolsa está vacía.', 'Your bag is empty.')}</h1>
        <button className="btn btn--dark" onClick={() => goHome('coleccion')}>
          {t('Ver la tienda', 'Go to shop')} <Icon.Arrow />
        </button>
      </main>
    );
  }

  return (
    <main className="co" id="main" tabIndex={-1}>
      <div className="container">
        <button className="co__back mono" onClick={() => goHome()}>
          <Icon.Back /> {t('Seguir comprando', 'Continue shopping')}
        </button>
        <h1 className="co__title">{t('Finalizar compra', 'Checkout')}</h1>
      </div>

      <form className="container co__grid" onSubmit={place} noValidate>
        <div className="co__form">
          <fieldset>
            <legend>
              <span className="mono">01</span> {t('Contacto', 'Contact')}
            </legend>
            <label>
              <span>{t('Nombre completo', 'Full name')}</span>
              <input required autoComplete="name" value={f.name} onChange={set('name')} />
            </label>
            <div className="co__row">
              <label>
                <span>{t('Correo electrónico', 'Email')}</span>
                <input required type="email" autoComplete="email" value={f.email} onChange={set('email')} />
              </label>
              <label>
                <span>{t('Teléfono', 'Phone')}</span>
                <input required type="tel" autoComplete="tel" inputMode="tel" placeholder="787-000-0000" value={f.phone} onChange={set('phone')} />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <span className="mono">02</span> {t('Entrega', 'Delivery')}
            </legend>
            <div className="co__modes" role="radiogroup">
              {(
                [
                  ['ship', t('Envío a domicilio', 'Home delivery'), tt.merch >= SITE.freeShippingThreshold ? t('Gratis', 'Free') : money2(SITE.shippingFlat)],
                  ['pickup', t('Recogido', 'Pickup'), t('Gratis · coordinamos por WhatsApp', 'Free · arranged via WhatsApp')],
                ] as const
              ).map(([id, label, sub]) => (
                <button type="button" key={id} role="radio" aria-checked={mode === id} className={mode === id ? 'is-active' : ''} onClick={() => setMode(id)}>
                  <i />
                  <span>
                    <strong>{label}</strong>
                    <small>{sub}</small>
                  </span>
                </button>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {mode === 'ship' && (
                <motion.div className="co__addr" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <label>
                    <span>{t('Dirección', 'Street address')}</span>
                    <input autoComplete="street-address" value={f.street} onChange={set('street')} />
                  </label>
                  <div className="co__row">
                    <label>
                      <span>{t('Pueblo / Ciudad', 'Town / City')}</span>
                      <input autoComplete="address-level2" value={f.city} onChange={set('city')} />
                    </label>
                    <label>
                      <span>{t('Código postal', 'ZIP code')}</span>
                      <input autoComplete="postal-code" inputMode="numeric" maxLength={5} placeholder="00901" value={f.zip} onChange={set('zip')} />
                    </label>
                  </div>
                  <p className="co__hint">
                    {t('Enviamos a todo Puerto Rico · sale en', 'We ship across Puerto Rico · ships in')} {SITE.shipsIn[lang]}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <label>
              <span>{t('Notas para la orden (opcional)', 'Order notes (optional)')}</span>
              <textarea rows={2} value={f.notes} onChange={set('notes')} />
            </label>
          </fieldset>

          <fieldset>
            <legend>
              <span className="mono">03</span> {t('Confirmación', 'Confirmation')}
            </legend>
            <label className="check">
              <input type="checkbox" checked={f.terms} onChange={set('terms')} required />
              <span>
                {t('Acepto los ', 'I agree to the ')}
                <button type="button" className="inline-link" onClick={() => navigate('/legal/terminos')}>
                  {t('Términos y condiciones', 'Terms & conditions')}
                </button>
                {t(', la ', ', the ')}
                <button type="button" className="inline-link" onClick={() => navigate('/legal/privacidad')}>
                  {t('Política de privacidad', 'Privacy policy')}
                </button>
                {t(' y la ', ' and the ')}
                <button type="button" className="inline-link" onClick={() => navigate('/legal/envios')}>
                  {t('Política de envíos y devoluciones', 'Shipping & returns policy')}
                </button>
                .
              </span>
            </label>
            <label className="check">
              <input type="checkbox" checked={f.sms} onChange={set('sms')} />
              <span>
                {t(
                  'Acepto recibir mensajes de marketing de EME STUDIO por WhatsApp/SMS. Opcional; no es condición de compra. Pueden aplicar cargos de mensajes y datos. Responde STOP para cancelar.',
                  'I agree to receive marketing messages from EME STUDIO via WhatsApp/SMS. Optional; not a condition of purchase. Msg & data rates may apply. Reply STOP to opt out.',
                )}
              </span>
            </label>
          </fieldset>
        </div>

        <aside className="co__side">
          <h2>{t('Tu orden', 'Your order')}</h2>
          <ul className="co__lines">
            {lines.map((ln) => {
              const p = byId(ln.id);
              return (
                <li key={ln.id}>
                  <span className="co__thumb">
                    <Stage p={p} className="stage--mini" />
                    <b>{ln.qty}</b>
                  </span>
                  <span className="co__name">
                    {displayName(p, lang)}
                    <small>{p.size}</small>
                  </span>
                  <span>{money2(p.price * ln.qty)}</span>
                </li>
              );
            })}
          </ul>
          <CodeField />
          <Summary pickup={mode === 'pickup'} />
          <button className="btn btn--blue btn--block co__place" type="submit" disabled={!valid}>
            <Icon.WhatsApp /> {t('Confirmar orden', 'Place order')} · {money2(tt.total)}
          </button>
          {!valid && <p className="co__hint">{t('Completa los campos y acepta los términos para continuar.', 'Complete the fields and accept the terms to continue.')}</p>}
          <p className="co__secure mono">
            <Icon.Shield /> {t('Confirmamos pago y entrega por WhatsApp', 'Payment & delivery confirmed via WhatsApp')}
          </p>
        </aside>
      </form>
    </main>
  );
}
