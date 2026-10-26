import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { byId, PRODUCTS } from '../data/products';
import { money, SITE } from '../data/site';
import { useStore } from '../store';
import { EASE, scrollToId } from '../utils';
import { Icon } from './ui';

/* Hero móvil con lenguaje de app de tienda: historias, círculos y rail rápido */
const SLIDES = [
  { img: '/media/powder-spray.webp', product: 'volume-powder', title: 'Sube el\nvolumen.', pos: '50% 38%' },
  { img: '/media/model-curls.webp', product: 'curl-cream', title: 'Rizo con\nflow.', pos: '50% 30%' },
  { img: '/media/clay-blueglove.webp', product: 'clay-wax', title: 'Esculpe\ntu estilo.', pos: '50% 55%' },
];
const DURATION = 5;

export default function MobileHero({ ready }: { ready: boolean }) {
  const { add, openSheet } = useStore();
  const [i, setI] = useState(0);
  const [added, setAdded] = useState(false);
  const slide = SLIDES[i];
  const p = byId(slide.product);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setI((n) => (n + 1) % SLIDES.length), DURATION * 1000);
    return () => clearTimeout(t);
  }, [i, ready]);

  const go = (dir: 1 | -1) => setI((n) => (n + dir + SLIDES.length) % SLIDES.length);

  const quickAdd = () => {
    add(p.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  };

  const enter = (d: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { delay: d, duration: 0.8, ease: EASE.out },
  });

  return (
    <section className="mhero" id="inicio">
      <motion.div className="mhero__head" {...enter(0.15)}>
        <div>
          <span className="mono mhero__hello">
            <span className="dot" /> Puerto Rico · Est. 2025
          </span>
          <h1 className="mhero__title">
            Eleva tu <em>imagen.</em>
          </h1>
        </div>
        <button className="mhero__search" onClick={() => scrollToId('finder')} aria-label="Encuentra tu producto">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
            <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>

      {/* Historia principal */}
      <motion.div
        className="mstory"
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={ready ? { opacity: 1, scale: 1, y: 0 } : undefined}
        transition={{ delay: 0.25, duration: 1, ease: EASE.out }}
        onPanEnd={(_, info) => {
          if (info.offset.x < -40) go(1);
          else if (info.offset.x > 40) go(-1);
        }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={slide.img}
            src={slide.img}
            alt={p.name}
            className="mstory__img"
            style={{ objectPosition: slide.pos }}
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.7 }, scale: { duration: DURATION + 1, ease: 'linear' } }}
            draggable={false}
          />
        </AnimatePresence>
        <div className="mstory__shade" />

        <div className="mstory__bars">
          {SLIDES.map((s, n) => (
            <span key={s.img}>
              <motion.i
                key={n === i ? `on-${i}` : `off-${n}`}
                initial={{ scaleX: n < i ? 1 : 0 }}
                animate={{ scaleX: n < i ? 1 : n === i && ready ? 1 : 0 }}
                transition={n === i ? { duration: DURATION, ease: 'linear' } : { duration: 0 }}
              />
            </span>
          ))}
        </div>

        <div className="mstory__brand">
          <img src="/media/logo.png" alt="" />
          <span className="mono">{p.tag ?? 'EME STUDIO'}</span>
        </div>

        <button className="mstory__tap mstory__tap--prev" onClick={() => go(-1)} aria-label="Anterior" />
        <button className="mstory__tap mstory__tap--next" onClick={() => go(1)} aria-label="Siguiente" />

        <div className="mstory__body">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial="hide"
              animate="show"
              exit="out"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            >
              <motion.span
                className="mstory__kicker mono"
                variants={{ hide: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 }, out: { opacity: 0 } }}
              >
                {p.name} · {p.size}
              </motion.span>
              <h2 className="mstory__title">
                {slide.title.split('\n').map((line) => (
                  <span key={line} className="mstory__mask">
                    <motion.span
                      variants={{ hide: { y: '105%' }, show: { y: 0 }, out: { y: '-105%' } }}
                      transition={{ duration: 0.7, ease: EASE.premium }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h2>
            </motion.div>
          </AnimatePresence>

          <div className="mstory__buy">
            <button className="mstory__price" onClick={() => openSheet(p.id)}>
              <small className="mono">Desde</small>
              <strong>{money(p.price)}</strong>
            </button>
            <button className="mstory__cta" onClick={() => openSheet(p.id)}>
              Ver producto <Icon.Arrow />
            </button>
            <button className={`mstory__add ${added ? 'is-done' : ''}`} onClick={quickAdd} aria-label={`Añadir ${p.name}`}>
              {added ? <Icon.Check /> : <Icon.Plus />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Círculos tipo historias */}
      <motion.div className="mcircles" {...enter(0.45)}>
        {PRODUCTS.map((pr) => (
          <button key={pr.id} onClick={() => openSheet(pr.id)} className={pr.id === slide.product ? 'is-live' : ''}>
            <span className="mcircles__ring">
              <img src={pr.images[0]} alt="" loading="eager" />
            </span>
            <small>{pr.short}</small>
          </button>
        ))}
      </motion.div>

      <motion.div className="mperks" {...enter(0.6)}>
        <span>
          <Icon.Bag /> Envío gratis ${SITE.freeShippingThreshold}+
        </span>
        <span>
          <Icon.Check /> Probado en barbería
        </span>
        <span>
          <Icon.WhatsApp /> Pedido por WhatsApp
        </span>
      </motion.div>
    </section>
  );
}
