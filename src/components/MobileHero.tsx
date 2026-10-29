import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ACTIVE_GIVEAWAY, FEATURED_PROMO, displayName, promoProduct, SHOP as PRODUCTS, byId } from '../data/catalog';
import type { Promo } from '../data/promos';
import { money, SITE } from '../data/site';
import { useLang, type L } from '../i18n';
import { useStore } from '../store';
import { EASE, scrollToId } from '../utils';
import { Icon, Snow } from './ui';

/* Hero móvil con lenguaje de app de tienda: historias, círculos y beneficios */
interface Slide {
  img: string;
  product: string;
  title: L;
  pos: string;
  promo?: Promo;
}

const BASE_SLIDES: Slide[] = [
  { img: '/media/powder-spray.webp', product: 'volume-powder', title: { es: 'Sube el\nvolumen.', en: 'Turn up\nthe volume.' }, pos: '50% 38%' },
  { img: '/media/model-curls.webp', product: 'curl-cream', title: { es: 'Rizo con\nflow.', en: 'Curls with\nflow.' }, pos: '50% 30%' },
  { img: '/media/clay-blueglove.webp', product: 'clay-wax', title: { es: 'Esculpe\ntu estilo.', en: 'Sculpt\nyour style.' }, pos: '50% 55%' },
];

// El especial destacado (si hay uno activo) abre las historias
const promo = FEATURED_PROMO;
const SLIDES: Slide[] = promo
  ? [{ img: promo.image, product: promoProduct(promo).id, title: promo.title, pos: '50% 50%', promo }, ...BASE_SLIDES]
  : BASE_SLIDES;
const DURATION = 5;

const themeVars = (pr?: Promo) =>
  pr
    ? ({ '--p-bg': pr.theme.bg, '--p-fg': pr.theme.fg, '--p-accent': pr.theme.accent, '--p-accent-fg': pr.theme.accentFg } as CSSProperties)
    : undefined;

export default function MobileHero({ ready }: { ready: boolean }) {
  const { add, openSheet } = useStore();
  const { t, l, lang } = useLang();
  const [i, setI] = useState(0);
  const [added, setAdded] = useState(false);
  const slide = SLIDES[i];
  const p = byId(slide.product);

  useEffect(() => {
    if (!ready) return;
    const tm = setTimeout(() => setI((n) => (n + 1) % SLIDES.length), DURATION * 1000);
    return () => clearTimeout(tm);
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
      <Snow density={0.8} className="mhero__snow" />
      <motion.div className="mhero__head" {...enter(0.15)}>
        <div>
          <span className="mono mhero__hello">
            <span className="dot" /> Puerto Rico · Est. 2025
          </span>
          <h1 className="mhero__title">
            {t('Eleva tu', 'Elevate your')} <em>{t('imagen.', 'image.')}</em>
          </h1>
        </div>
        <button className="mhero__search" onClick={() => scrollToId('finder')} aria-label={t('Encuentra tu producto', 'Find your product')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
            <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>

      {/* Historia principal */}
      <motion.div
        className={`mstory ${slide.promo ? 'mstory--promo' : ''}`}
        style={themeVars(slide.promo)}
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
            alt={displayName(p, lang)}
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
        {slide.promo && <Snow density={0.6} />}

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
          <span className="mono">
            {slide.promo ? `${l(slide.promo.badge)} · -${Math.round((1 - p.price / p.compareAt!) * 100)}%` : p.tag ? l(p.tag) : 'EME STUDIO'}
          </span>
        </div>

        <button className="mstory__tap mstory__tap--prev" onClick={() => go(-1)} aria-label={t('Anterior', 'Previous')} />
        <button className="mstory__tap mstory__tap--next" onClick={() => go(1)} aria-label={t('Siguiente', 'Next')} />

        <div className="mstory__body">
          <AnimatePresence mode="wait">
            <motion.div key={`${i}-${lang}`} initial="hide" animate="show" exit="out" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
              <motion.span className="mstory__kicker mono" variants={{ hide: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 }, out: { opacity: 0 } }}>
                {displayName(p, lang)} · {p.size}
              </motion.span>
              <h2 className="mstory__title">
                {l(slide.title)
                  .split('\n')
                  .map((line) => (
                    <span key={line} className="mstory__mask">
                      <motion.span variants={{ hide: { y: '105%' }, show: { y: 0 }, out: { y: '-105%' } }} transition={{ duration: 0.7, ease: EASE.premium }}>
                        {line.split(/(\*[^*]+\*)/).map((part, k) =>
                          part.startsWith('*') ? (
                            <span key={k} className="accent">
                              {part.replace(/\*/g, '')}
                            </span>
                          ) : (
                            part
                          ),
                        )}
                      </motion.span>
                    </span>
                  ))}
              </h2>
            </motion.div>
          </AnimatePresence>

          <div className="mstory__buy">
            <button className="mstory__price" onClick={() => openSheet(p.id)}>
              <small className="mono">{p.compareAt ? <s>{money(p.compareAt)}</s> : t('Desde', 'From')}</small>
              <strong>{money(p.price)}</strong>
            </button>
            <button className="mstory__cta" onClick={() => (slide.promo ? scrollToId('especiales') : openSheet(p.id))}>
              {slide.promo ? t('Ver especial', 'See special') : t('Ver producto', 'View product')} <Icon.Arrow />
            </button>
            <button className={`mstory__add ${added ? 'is-done' : ''}`} onClick={quickAdd} aria-label={t(`Añadir ${p.name}`, `Add ${p.name}`)}>
              {added ? <Icon.Check /> : <Icon.Plus />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Círculos tipo historias */}
      <motion.div className="mcircles" {...enter(0.45)}>
        {promo && (
          <button onClick={() => scrollToId('especiales')} className={slide.promo ? 'is-live' : ''}>
            <span className="mcircles__ring mcircles__ring--promo">
              <img src={promo.image} alt="" loading="eager" />
            </span>
            <small className="is-promo">{t('Especiales', 'Specials')}</small>
          </button>
        )}
        {ACTIVE_GIVEAWAY && (
          <button onClick={() => scrollToId('giveaway')}>
            <span className="mcircles__ring mcircles__ring--promo">
              <img src="/media/st-clay-comb.webp" alt="" loading="eager" className="is-studio" />
            </span>
            <small className="is-promo">Giveaway</small>
          </button>
        )}
        {PRODUCTS.filter((pr) => pr.category !== 'kits').map((pr) => (
          <button key={pr.id} onClick={() => openSheet(pr.id)} className={pr.id === slide.product ? 'is-live' : ''}>
            <span className="mcircles__ring">
              <img src={pr.studio} alt="" loading="eager" className="is-studio" />
            </span>
            <small>{pr.short}</small>
          </button>
        ))}
      </motion.div>

      <motion.div className="mperks" {...enter(0.6)}>
        <span>
          <Icon.Bag /> {t('Envío gratis', 'Free shipping')} ${SITE.freeShippingThreshold}+
        </span>
        <span>
          <Icon.Check /> {t('Probado en barbería', 'Barber tested')}
        </span>
        <span>
          <Icon.WhatsApp /> {t('Atención por WhatsApp', 'WhatsApp support')}
        </span>
      </motion.div>
    </section>
  );
}
