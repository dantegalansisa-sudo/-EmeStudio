import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { useStore } from '../store';
import { byId } from '../data/catalog';
import { SITE, money, whatsappLink } from '../data/site';
import { EASE, lockScroll, useMedia } from '../utils';
import { Icon, Meter } from './ui';

/* ---------- Ficha de producto (bottom sheet en móvil, panel en desktop) ---------- */
export function ProductSheet() {
  const { sheet: p, closeSheet, add, setCartOpen } = useStore();
  const desktop = useMedia('(min-width: 900px)');
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [tab, setTab] = useState<'beneficios' | 'uso'>('beneficios');
  const drag = useDragControls();

  useEffect(() => {
    lockScroll(!!p);
    setQty(1);
    setImg(0);
    setTab('beneficios');
  }, [p]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeSheet();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeSheet]);

  const variants = desktop
    ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } };

  return (
    <AnimatePresence>
      {p && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSheet} />
          <motion.aside
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={p.name}
            {...variants}
            transition={{ duration: 0.7, ease: EASE.premium }}
            drag={desktop ? false : 'y'}
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) closeSheet();
            }}
          >
            <div className="sheet__grab" onPointerDown={(e) => drag.start(e)} />
            <button className="sheet__close" onClick={closeSheet} aria-label="Cerrar">
              <Icon.Close />
            </button>
            <div className="sheet__scroll">
              <div className="sheet__gallery">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={p.images[img]}
                    src={p.images[img]}
                    alt={p.name}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE.out }}
                  />
                </AnimatePresence>
                {p.tag && <span className="card__tag mono">{p.tag}</span>}
                <div className="sheet__thumbs">
                  {p.images.map((src, i) => (
                    <button key={src} className={i === img ? 'is-active' : ''} onClick={() => setImg(i)} aria-label={`Imagen ${i + 1}`}>
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="sheet__body">
                <span className="mono sheet__size">{p.size}</span>
                <h2>{p.name}</h2>
                <p className="sheet__tagline serif">{p.tagline}</p>
                <div className="sheet__price">
                  <strong>{money(p.price)}</strong>
                  {p.compareAt && <s>{money(p.compareAt)}</s>}
                </div>
                <p className="sheet__desc">{p.description}</p>

                {p.hold > 0 && p.category !== 'kits' && (
                  <div className="sheet__specs">
                    <Meter label="Fijación" value={p.hold} />
                    <Meter label="Brillo" value={p.shine} />
                    <div className="meter">
                      <span className="meter__label">Acabado</span>
                      <span className="meter__val">{p.finish}</span>
                    </div>
                  </div>
                )}

                <div className="tabs">
                  {(['beneficios', 'uso'] as const).map((t) => (
                    <button key={t} className={tab === t ? 'is-active' : ''} onClick={() => setTab(t)}>
                      {t === 'beneficios' ? (p.category === 'kits' ? 'Incluye' : 'Beneficios') : 'Cómo usar'}
                      {tab === t && <motion.i layoutId="tab-line" />}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.ol
                    key={tab}
                    className={`sheet__list ${tab === 'uso' ? 'is-steps' : ''}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    {(tab === 'beneficios' ? p.benefits : p.howTo).map((b, i) => (
                      <li key={b}>
                        <span className="mono">{tab === 'uso' ? `0${i + 1}` : <Icon.Check />}</span>
                        {b}
                      </li>
                    ))}
                  </motion.ol>
                </AnimatePresence>
              </div>
            </div>

            <div className="sheet__bar">
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos">
                  <Icon.Minus />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Más">
                  <Icon.Plus />
                </button>
              </div>
              <button
                className="btn btn--dark btn--block"
                onClick={() => {
                  add(p.id, qty);
                  closeSheet();
                  setTimeout(() => setCartOpen(true), 350);
                }}
              >
                Añadir · {money(p.price * qty)}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------- Carrito ---------- */
export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, setQty, subtotal, add, count } = useStore();
  const goal = SITE.freeShippingThreshold;
  const left = Math.max(0, goal - subtotal);
  const pct = Math.min(1, subtotal / goal);
  const hasComb = lines.some((l) => l.id === 'peinilla' || l.id === 'kit-eme');

  useEffect(() => lockScroll(cartOpen), [cartOpen]);

  const checkout = () => {
    const body = lines.map((l) => `• ${l.qty} × ${byId(l.id).name} — ${money(byId(l.id).price * l.qty)}`).join('\n');
    const msg = `¡Hola EME STUDIO! Quiero hacer este pedido:\n\n${body}\n\nSubtotal: ${money(subtotal)}`;
    window.open(whatsappLink(msg), '_blank', 'noreferrer');
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
          <motion.aside
            className="cart"
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: EASE.premium }}
          >
            <div className="cart__head">
              <h2>
                Tu bolsa <sup className="mono">{count}</sup>
              </h2>
              <button className="sheet__close" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">
                <Icon.Close />
              </button>
            </div>

            <div className="ship">
              <p>
                {left > 0 ? (
                  <>
                    Te faltan <strong>{money(left)}</strong> para envío gratis
                  </>
                ) : (
                  <>
                    <strong>¡Tienes envío gratis!</strong> 🔥
                  </>
                )}
              </p>
              <div className="ship__bar">
                <motion.i animate={{ scaleX: pct }} transition={{ duration: 0.8, ease: EASE.out }} />
              </div>
            </div>

            <div className="cart__lines">
              {lines.length === 0 && (
                <div className="cart__empty">
                  <p className="serif">Tu bolsa está vacía.</p>
                  <button
                    className="btn btn--dark"
                    onClick={() => {
                      setCartOpen(false);
                      setTimeout(() => document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' }), 400);
                    }}
                  >
                    Ver la colección <Icon.Arrow />
                  </button>
                </div>
              )}
              <AnimatePresence initial={false}>
                {lines.map((l) => {
                  const p = byId(l.id);
                  return (
                    <motion.div
                      key={l.id}
                      className="line"
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.4, ease: EASE.out }}
                    >
                      <img src={p.images[0]} alt="" />
                      <div className="line__info">
                        <strong>{p.name}</strong>
                        <span className="mono">{p.size}</span>
                        <div className="qty qty--sm">
                          <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Menos">
                            <Icon.Minus />
                          </button>
                          <span>{l.qty}</span>
                          <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Más">
                            <Icon.Plus />
                          </button>
                        </div>
                      </div>
                      <span className="line__price">{money(p.price * l.qty)}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {lines.length > 0 && !hasComb && (
                <div className="upsell">
                  <img src="/media/comb.webp" alt="" />
                  <div>
                    <span className="mono">Completa la rutina</span>
                    <strong>Peinilla EME · {money(byId('peinilla').price)}</strong>
                  </div>
                  <button onClick={() => add('peinilla')} aria-label="Añadir Peinilla">
                    <Icon.Plus />
                  </button>
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="cart__foot">
                <div className="cart__total">
                  <span>Subtotal</span>
                  <strong>{money(subtotal)}</strong>
                </div>
                <button className="btn btn--blue btn--block" onClick={checkout}>
                  <Icon.WhatsApp /> Completar pedido por WhatsApp
                </button>
                <p className="mono cart__note">Confirmamos tu pedido por WhatsApp</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------- Pastilla flotante de carrito (móvil) ---------- */
export function FloatingCart() {
  const { count, subtotal, setCartOpen, cartOpen, sheet, menuOpen } = useStore();
  const show = count > 0 && !cartOpen && !sheet && !menuOpen;
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="fab"
          onClick={() => setCartOpen(true)}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE.out }}
        >
          <span className="fab__count">{count}</span>
          Ver bolsa
          <strong>{money(subtotal)}</strong>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
