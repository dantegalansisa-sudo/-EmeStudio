import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store';
import { byId, displayName, totals } from '../data/catalog';
import { SITE, money, money2 } from '../data/site';
import { useLang } from '../i18n';
import { goHome, navigate, useRoute } from '../router';
import { EASE, lockScroll, scrollToId } from '../utils';
import { Icon } from './ui';
import { startCheckout } from '../payments';

/* ---------- Resumen: subtotal, descuento, envío, IVU, total ---------- */
export function Summary({ pickup = false }: { pickup?: boolean }) {
  const { lines } = useStore();
  const { t } = useLang();
  const tt = totals(lines, null, pickup);
  return (
    <dl className="sum">
      <div>
        <dt>Subtotal</dt>
        <dd>{money2(tt.subtotal)}</dd>
      </div>
      {tt.discount > 0 && (
        <div className="sum__disc">
          <dt>{t('Descuento', 'Discount')}</dt>
          <dd>-{money2(tt.discount)}</dd>
        </div>
      )}
      <div>
        <dt>{pickup ? t('Recogido', 'Pickup') : t('Envío', 'Shipping')}</dt>
        <dd>{tt.shipping === 0 ? t('Gratis', 'Free') : money2(tt.shipping)}</dd>
      </div>
      <div>
        <dt>IVU (11.5%)</dt>
        <dd>{money2(tt.tax)}</dd>
      </div>
      <div className="sum__total">
        <dt>Total</dt>
        <dd>
          <small>USD</small> {money2(tt.total)}
        </dd>
      </div>
    </dl>
  );
}

/* ---------- Bolsa ---------- */
export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, setQty, add, count } = useStore();
  const { t, lang } = useLang();
  const tt = totals(lines, null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const pay = async () => {
    setPaying(true);
    setPayError(null);
    try {
      await startCheckout(lines);
    } catch (e) {
      setPayError(e instanceof Error ? e.message : String(e));
      setPaying(false);
    }
  };
  const goal = SITE.freeShippingThreshold;
  const left = Math.max(0, goal - tt.merch);
  const pct = Math.min(1, tt.merch / goal);
  const hasComb = lines.some((l) => l.id === 'peinilla' || l.id === 'kit-eme');

  useEffect(() => lockScroll(cartOpen), [cartOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
          <motion.aside
            className="cart"
            role="dialog"
            aria-modal="true"
            aria-label={t('Tu bolsa', 'Your bag')}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: EASE.premium }}
          >
            <div className="cart__head">
              <h2>
                {t('Tu bolsa', 'Your bag')} <sup className="mono">{count}</sup>
              </h2>
              <button className="sheet__close" onClick={() => setCartOpen(false)} aria-label={t('Cerrar', 'Close')}>
                <Icon.Close />
              </button>
            </div>

            <div className="ship">
              <p>
                {left > 0 ? (
                  <>
                    {t('Te faltan', 'You’re')} <strong>{money2(left)}</strong> {t('para envío gratis', 'away from free shipping')}
                  </>
                ) : (
                  <strong>{t('¡Tienes envío gratis!', 'You’ve got free shipping!')}</strong>
                )}
              </p>
              <div className="ship__bar">
                <motion.i animate={{ scaleX: pct }} transition={{ duration: 0.8, ease: EASE.out }} />
              </div>
            </div>

            <div className="cart__lines">
              {lines.length === 0 && (
                <div className="cart__empty">
                  <p className="serif">{t('Tu bolsa está vacía.', 'Your bag is empty.')}</p>
                  <button
                    className="btn btn--dark"
                    onClick={() => {
                      setCartOpen(false);
                      setTimeout(() => scrollToId('coleccion'), 350);
                    }}
                  >
                    {t('Ver la colección', 'Shop the collection')} <Icon.Arrow />
                  </button>
                </div>
              )}
              <AnimatePresence initial={false}>
                {lines.map((ln) => {
                  const p = byId(ln.id);
                  return (
                    <motion.div
                      key={ln.id}
                      className="line"
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.4, ease: EASE.out }}
                    >
                      <button className="line__img stage" onClick={() => (setCartOpen(false), navigate(`/p/${p.id}`))} aria-label={p.name}>
                        <img src={p.studio} alt="" />
                      </button>
                      <div className="line__info">
                        <strong>{displayName(p, lang)}</strong>
                        <span className="mono">{p.size}</span>
                        <div className="qty qty--sm">
                          <button onClick={() => setQty(ln.id, ln.qty - 1)} aria-label={t('Menos', 'Less')}>
                            <Icon.Minus />
                          </button>
                          <span aria-live="polite">{ln.qty}</span>
                          <button onClick={() => setQty(ln.id, ln.qty + 1)} aria-label={t('Más', 'More')}>
                            <Icon.Plus />
                          </button>
                        </div>
                      </div>
                      <span className="line__price">
                        {money2(p.price * ln.qty)}
                        {p.compareAt && <s>{money2(p.compareAt * ln.qty)}</s>}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {lines.length > 0 && !hasComb && (
                <div className="upsell">
                  <span className="stage">
                    <img src={byId('peinilla').studio} alt="" />
                  </span>
                  <div>
                    <span className="mono">{t('Completa la rutina', 'Complete the routine')}</span>
                    <strong>Peinilla EME · {money(byId('peinilla').price)}</strong>
                  </div>
                  <button onClick={() => add('peinilla')} aria-label={t('Añadir Peinilla', 'Add comb')}>
                    <Icon.Plus />
                  </button>
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="cart__foot">
                <Summary />
                <button className="btn btn--blue btn--block" onClick={pay} disabled={paying} aria-busy={paying}>
                  {paying ? (
                    <>
                      <span className="spin" aria-hidden /> {t('Conectando con el pago seguro…', 'Opening secure checkout…')}
                    </>
                  ) : (
                    <>
                      <Icon.Shield /> {t('Pagar', 'Pay')} · {money2(tt.total)}
                    </>
                  )}
                </button>
                {payError && (
                  <p className="pay__err" role="alert">
                    {payError}
                  </p>
                )}
                <p className="cart__terms">
                  {t('Pago seguro con Stripe · Tarjeta, Apple Pay o Google Pay. Al pagar aceptas los ', 'Secure payment by Stripe · Card, Apple Pay or Google Pay. By paying you accept the ')}
                  <button className="inline-link" onClick={() => (setCartOpen(false), navigate('/legal/terminos'))}>
                    {t('Términos', 'Terms')}
                  </button>
                  {t(' y la ', ' and the ')}
                  <button className="inline-link" onClick={() => (setCartOpen(false), navigate('/legal/privacidad'))}>
                    {t('Política de privacidad', 'Privacy policy')}
                  </button>
                  .
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------- Barra inferior tipo app (móvil) ---------- */
export function BottomBar() {
  const { count, setCartOpen, cartOpen, menuOpen } = useStore();
  const { t } = useLang();
  const route = useRoute();
  const [bump, setBump] = useState(0);
  const { lastAdded } = useStore();
  useEffect(() => {
    if (lastAdded) setBump((b) => b + 1);
  }, [lastAdded]);
  if (route.page === 'thanks' || route.page === 'product') return null;

  const items = [
    { id: 'inicio', es: 'Inicio', en: 'Home', icon: <Icon.Home />, go: () => (route.page === 'home' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : goHome()) },
    { id: 'coleccion', es: 'Tienda', en: 'Shop', icon: <Icon.Grid />, go: () => scrollToId('coleccion') },
    { id: 'especiales', es: 'Especiales', en: 'Specials', icon: <Icon.Gift />, go: () => scrollToId('especiales'), hot: true },
  ];

  return (
    <AnimatePresence>
      {!cartOpen && !menuOpen && (
        <motion.nav className="tabbar" aria-label={t('Navegación', 'Navigation')} initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ duration: 0.5, ease: EASE.out }}>
          {items.map((it) => (
            <button key={it.id} onClick={it.go} className={it.hot ? 'is-hot' : ''}>
              {it.icon}
              <span>{t(it.es, it.en)}</span>
            </button>
          ))}
          <button className="tabbar__bag" onClick={() => setCartOpen(true)}>
            <motion.span key={bump} className="tabbar__bagicon" animate={bump ? { scale: [1, 1.25, 1] } : undefined} transition={{ duration: 0.4 }}>
              <Icon.Bag />
              {count > 0 && <b>{count}</b>}
            </motion.span>
            <span>{t('Bolsa', 'Bag')}</span>
          </button>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
