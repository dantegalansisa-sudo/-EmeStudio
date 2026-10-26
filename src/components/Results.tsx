import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { byId } from '../data/products';
import { useStore } from '../store';
import { useMedia } from '../utils';
import { AutoVideo, FadeUp, RevealText } from './ui';

const REELS = [
  { kind: 'video', src: '/media/v-peinado.mp4', poster: '/media/v-peinado.webp', caption: 'Un peinado natural que dura todo el día.', uses: ['volume-powder', 'clay-wax'] },
  { kind: 'img', src: '/media/model-curls.webp', caption: 'Rizos definidos, control y flow en un solo paso.', uses: ['curl-cream'] },
  { kind: 'img', src: '/media/barber-smile.webp', caption: 'Backstage ready. Peinado con la Clay Wax.', uses: ['clay-wax'] },
  { kind: 'video', src: '/media/v-powder-spin.mp4', poster: '/media/v-powder-spin.webp', caption: 'Un poco de volumen, y ya estás en otra liga.', uses: ['volume-powder'] },
  { kind: 'img', src: '/media/bball-1.webp', caption: 'Donde el baloncesto se cruza con el estilo.', uses: ['curl-cream'] },
  { kind: 'video', src: '/media/v-mrfade.mp4', poster: '/media/v-mrfade.webp', caption: 'Ayer era solo una idea. Hoy ya estamos en otra barbería.', uses: ['clay-wax', 'volume-powder'] },
  { kind: 'img', src: '/media/model-sit-1.webp', caption: 'Nada pesado, nada falso. Solo resultado real.', uses: ['curl-cream'] },
] as const;

function Reel({ r, i }: { r: (typeof REELS)[number]; i: number }) {
  const { openSheet } = useStore();
  return (
    <motion.article
      className="reel"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {r.kind === 'video' ? <AutoVideo src={r.src} poster={r.poster} /> : <img src={r.src} alt={r.caption} loading="lazy" />}
      <div className="reel__shade" />
      {r.kind === 'video' && <span className="reel__live mono">● Video</span>}
      <div className="reel__info">
        <p>{r.caption}</p>
        <div className="reel__uses">
          {r.uses.map((u) => (
            <button key={u} onClick={() => openSheet(u)}>
              <img src={byId(u).images[0]} alt="" />
              {byId(u).name}
            </button>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Results() {
  const desktop = useMedia('(min-width: 900px)');
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const calc = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 48));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [desktop]);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -dist]);

  return (
    <section
      ref={section}
      className="results"
      id="resultados"
      style={desktop ? { height: `calc(100vh + ${dist}px)` } : undefined}
    >
      <div className={desktop ? 'results__sticky' : ''}>
        <div className="container results__head">
          <div className="sec-label">
            <span className="mono">(05)</span>
            <span className="mono">Resultados reales</span>
          </div>
          <RevealText className="h-xl">{'Del sillón\na la *calle.*'}</RevealText>
          <FadeUp delay={0.15} className="results__aside">
            <p>Clientes reales, barberos reales. Toca un producto para ver cómo se logró cada look.</p>
          </FadeUp>
        </div>
        <motion.div ref={track} className="results__track" style={desktop ? { x } : undefined}>
          {REELS.map((r, i) => (
            <Reel key={r.src} r={r} i={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
