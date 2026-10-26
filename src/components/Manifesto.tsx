import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { EASE } from '../utils';

const TEXT =
  'Diseñado para crear. Probado en la barbería. Hecho para destacar. EME nace del sillón — de barberos que necesitaban productos que rindieran de verdad, para que el corte se vea igual de bien cuando sales que cuando te levantas.';

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <span className="lit__word">
      <motion.span style={{ opacity, y }}>{children}</motion.span>
    </span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = TEXT.split(' ');

  const band = useRef<HTMLDivElement>(null);
  const { scrollYProgress: bp } = useScroll({ target: band, offset: ['start end', 'end start'] });
  const x1 = useTransform(bp, [0, 1], ['4%', '-38%']);
  const x2 = useTransform(bp, [0, 1], ['-40%', '2%']);

  return (
    <section className="manifesto" id="marca">
      <div className="container">
        <div className="sec-label">
          <span className="mono">(01)</span>
          <span className="mono">Manifiesto</span>
        </div>
        <div ref={ref} className="lit">
          {words.map((w, i) => {
            const start = i / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]}>
                {w}
              </Word>
            );
          })}
        </div>
      </div>

      <div className="manifesto__band" ref={band} aria-hidden>
        <motion.div className="manifesto__row" style={{ x: x1 }}>
          <span>Define</span>
          <i className="pill">
            <img src="/media/model-curls.webp" alt="" />
          </i>
          <span>Texturiza</span>
          <i className="pill">
            <img src="/media/powder-front.webp" alt="" />
          </i>
          <span>Transforma</span>
          <i className="pill">
            <img src="/media/bball-1.webp" alt="" />
          </i>
        </motion.div>
        <motion.div className="manifesto__row manifesto__row--outline" style={{ x: x2 }}>
          <span>Estilo</span>
          <b>•</b>
          <span>Precisión</span>
          <b>•</b>
          <span>Rendimiento</span>
          <b>•</b>
          <span>Estilo</span>
        </motion.div>
      </div>

      <div className="container manifesto__facts">
        {[
          ['Hecho en la barbería', 'Cada fórmula se prueba primero en el sillón, con clientes reales.'],
          ['Cero relleno', 'Cuatro esenciales. Cada uno con un trabajo claro.'],
          ['Para todo tipo de cabello', 'Lacio, ondulado o rizo: hay un EME para tu look.'],
        ].map(([t, d], i) => (
          <motion.div
            key={t}
            className="fact"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: EASE.out }}
          >
            <span className="mono">0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
