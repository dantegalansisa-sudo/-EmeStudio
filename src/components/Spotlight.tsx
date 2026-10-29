import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { byId } from '../data/catalog';
import { money, SEASON } from '../data/site';
import { useLang } from '../i18n';
import { useStore } from '../store';
import { EASE } from '../utils';
import { AutoVideo, Icon, Meter } from './ui';
import { AddButton } from './Collection';

// En temporada (Navidad) los capítulos toman rojo y verde pino
const CHAPTERS = [
  {
    id: 'volume-powder',
    kicker: { es: 'Volumen', en: 'Volume' },
    title: { es: 'Sube.', en: 'Lift.' },
    line: {
      es: 'Espolvorea en la raíz y el cabello gana volumen y textura al instante. Fijación fuerte, acabado mate.',
      en: 'Sprinkle at the roots for instant volume and texture. Strong hold, matte finish.',
    },
    media: { type: 'video' as const, src: '/media/v-powder-spin.mp4', poster: '/media/v-powder-spin.webp' },
    bg: SEASON ? SEASON.primary : '#1B46C9',
    fg: '#FFFFFF',
    theme: 'dark',
  },
  {
    id: 'clay-wax',
    kicker: { es: 'Control', en: 'Control' },
    title: { es: 'Esculpe.', en: 'Sculpt.' },
    line: {
      es: 'Fijación extra fuerte que aumenta el grosor y aporta textura, con un acabado mate de aspecto natural.',
      en: 'Extra-strong hold that builds thickness and texture, with a natural-looking matte finish.',
    },
    media: { type: 'img' as const, src: '/media/clay-blueglove.webp' },
    bg: SEASON ? SEASON.green : '#14171D',
    fg: '#F2F1EE',
    theme: 'dark',
  },
  {
    id: 'curl-cream',
    kicker: { es: 'Rizo', en: 'Curl' },
    title: { es: 'Define.', en: 'Define.' },
    line: {
      es: 'Realza los rizos, combate el frizz y deja un tacto sedoso con brillo. Sin enjuague.',
      en: 'Enhances curls, fights frizz and leaves a silky, shiny feel. Leave-in.',
    },
    media: { type: 'img' as const, src: '/media/model-curls.webp' },
    bg: '#EFEDE8',
    fg: '#0B0D12',
    theme: 'light',
  },
];

export default function Spotlight() {
  const ref = useRef<HTMLElement>(null);
  const { openSheet } = useStore();
  const { t, l } = useLang();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const bg = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.63, 0.73, 1], [CHAPTERS[0].bg, CHAPTERS[0].bg, CHAPTERS[1].bg, CHAPTERS[1].bg, CHAPTERS[2].bg, CHAPTERS[2].bg]);
  const fg = useTransform(scrollYProgress, [0, 0.63, 0.73, 1], [CHAPTERS[0].fg, CHAPTERS[1].fg, CHAPTERS[2].fg, CHAPTERS[2].fg]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(v < 0.35 ? 0 : v < 0.68 ? 1 : 2);
  });

  const ch = CHAPTERS[active];
  const p = byId(ch.id);

  return (
    <motion.section ref={ref} className={`spot spot--${ch.theme}`} style={{ backgroundColor: bg, color: fg }} id="rutina">
      <div className="spot__sticky">
        <div className="spot__top container">
          <div className="sec-label">
            <span className="mono">(03)</span>
            <span className="mono">{t('La rutina EME', 'The EME routine')}</span>
          </div>
          <div className="spot__steps">
            {CHAPTERS.map((c, i) => (
              <span key={c.id} className={i === active ? 'is-active' : ''}>
                <b className="mono">0{i + 1}</b> {l(c.kicker)}
              </span>
            ))}
          </div>
        </div>

        <div className="spot__stage container">
          <div className="spot__media">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={ch.id}
                className="spot__frame"
                initial={{ clipPath: 'inset(100% 0% 0% 0% round 24px)', scale: 1.08 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)', scale: 1 }}
                exit={{ clipPath: 'inset(0% 0% 100% 0% round 24px)', scale: 0.96 }}
                transition={{ duration: 0.9, ease: EASE.premium }}
                onClick={() => openSheet(ch.id)}
               
              >
                {ch.media.type === 'video' ? <AutoVideo src={ch.media.src} poster={ch.media.poster} /> : <img src={ch.media.src} alt={p.name} />}
                <span className="spot__label mono">
                  {p.name} · {p.size}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="spot__copy">
            <AnimatePresence mode="wait">
              <motion.div
                key={ch.id}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={{ show: { transition: { staggerChildren: 0.07 } }, exit: { transition: { staggerChildren: 0.03 } } }}
              >
                <div className="spot__mask">
                  <motion.h2
                    className="spot__title"
                    variants={{ hidden: { y: '105%' }, show: { y: 0 }, exit: { y: '-105%' } }}
                    transition={{ duration: 0.75, ease: EASE.premium }}
                  >
                    {l(ch.title)}
                  </motion.h2>
                </div>
                <motion.p
                  className="spot__line"
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }}
                  transition={{ duration: 0.6, ease: EASE.out }}
                >
                  {l(ch.line)}
                </motion.p>
                <motion.div
                  className="spot__specs"
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0 } }}
                  transition={{ duration: 0.6, ease: EASE.out }}
                >
                  {p.specs.map((sp) => (
                    <Meter key={sp.label.es} label={l(sp.label)} value={sp.value} dark={ch.theme === 'dark'} />
                  ))}
                </motion.div>
                <motion.div
                  className="spot__buy"
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0 } }}
                  transition={{ duration: 0.6, ease: EASE.out }}
                >
                  <div>
                    <strong>{p.name}</strong>
                    <span>{money(p.price)}</span>
                  </div>
                  <AddButton id={p.id} className="add--wide" label={t('Añadir', 'Add')} />
                  <button className="link-arrow" onClick={() => openSheet(p.id)}>
                    {t('Detalles', 'Details')} <Icon.Arrow />
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="spot__progress container">
          <motion.i style={{ scaleX: progress }} />
        </div>
      </div>
    </motion.section>
  );
}
