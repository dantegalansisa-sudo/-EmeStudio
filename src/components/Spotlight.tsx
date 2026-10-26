import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { byId } from '../data/products';
import { money } from '../data/site';
import { useStore } from '../store';
import { EASE } from '../utils';
import { AutoVideo, Icon, Meter } from './ui';
import { AddButton } from './Collection';

const CHAPTERS = [
  {
    id: 'volume-powder',
    kicker: 'Volumen',
    title: 'Sube.',
    line: 'Un toque en la raíz y el cabello gana cuerpo al instante. Acabado mate, cero peso.',
    media: { type: 'video' as const, src: '/media/v-powder-spin.mp4', poster: '/media/v-powder-spin.webp' },
    bg: '#1B46C9',
    fg: '#F4F6FF',
    theme: 'dark',
  },
  {
    id: 'clay-wax',
    kicker: 'Control',
    title: 'Esculpe.',
    line: 'Agarre firme y re-moldeable para texturas separadas que aguantan todo el día.',
    media: { type: 'img' as const, src: '/media/clay-blueglove.webp' },
    bg: '#14171D',
    fg: '#F2F1EE',
    theme: 'dark',
  },
  {
    id: 'curl-cream',
    kicker: 'Rizo',
    title: 'Define.',
    line: 'Hidrata, define y controla el frizz. Rizos con flow, sin quedar duros.',
    media: { type: 'img' as const, src: '/media/model-curls.webp' },
    bg: '#E6E8EB',
    fg: '#0B0D12',
    theme: 'light',
  },
];

export default function Spotlight() {
  const ref = useRef<HTMLElement>(null);
  const { openSheet } = useStore();
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
            <span className="mono">La rutina EME</span>
          </div>
          <div className="spot__steps">
            {CHAPTERS.map((c, i) => (
              <span key={c.id} className={i === active ? 'is-active' : ''}>
                <b className="mono">0{i + 1}</b> {c.kicker}
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
                    {ch.title}
                  </motion.h2>
                </div>
                <motion.p
                  className="spot__line"
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }}
                  transition={{ duration: 0.6, ease: EASE.out }}
                >
                  {ch.line}
                </motion.p>
                <motion.div
                  className="spot__specs"
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, exit: { opacity: 0 } }}
                  transition={{ duration: 0.6, ease: EASE.out }}
                >
                  <Meter label="Fijación" value={p.hold} dark={ch.theme === 'dark'} />
                  <Meter label="Brillo" value={p.shine} dark={ch.theme === 'dark'} />
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
                  <AddButton id={p.id} className="add--wide" label="Añadir" />
                  <button className="link-arrow" onClick={() => openSheet(p.id)}>
                    Detalles <Icon.Arrow />
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
