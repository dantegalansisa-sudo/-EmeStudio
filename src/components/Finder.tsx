import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { byId } from '../data/products';
import { money } from '../data/site';
import { useStore } from '../store';
import { EASE } from '../utils';
import { FadeUp, Icon, RevealText } from './ui';
import { AddButton } from './Collection';

type Hair = 'lacio' | 'ondulado' | 'rizado';
type Look = 'volumen' | 'control' | 'rizo';

const HAIR: { id: Hair; label: string; hint: string }[] = [
  { id: 'lacio', label: 'Lacio', hint: 'Cae plano, cuesta darle forma' },
  { id: 'ondulado', label: 'Ondulado', hint: 'Tiene movimiento, a veces frizz' },
  { id: 'rizado', label: 'Rizado', hint: 'Rizo definido o afro' },
];
const LOOK: { id: Look; label: string; hint: string }[] = [
  { id: 'volumen', label: 'Volumen y textura', hint: 'Más cuerpo, acabado mate' },
  { id: 'control', label: 'Control natural', hint: 'Forma que aguanta todo el día' },
  { id: 'rizo', label: 'Rizo definido', hint: 'Sin frizz, con flow' },
];

function recommend(h: Hair, l: Look) {
  if (l === 'volumen') return { main: 'volume-powder', pair: h === 'rizado' ? 'curl-cream' : 'clay-wax', why: 'Levanta desde la raíz y deja textura mate. Combínalo para fijar la forma.' };
  if (l === 'control') return { main: 'clay-wax', pair: h === 'lacio' ? 'volume-powder' : 'peinilla', why: 'Agarre firme y re-moldeable con un acabado natural de bajo brillo.' };
  if (h === 'lacio') return { main: 'clay-wax', pair: 'volume-powder', why: 'En cabello lacio, la Clay Wax te da movimiento y forma tipo textura.' };
  return { main: 'curl-cream', pair: 'peinilla', why: 'Define cada rizo y controla el frizz sin dejar el cabello duro.' };
}

export default function Finder() {
  const [hair, setHair] = useState<Hair | null>(null);
  const [look, setLook] = useState<Look | null>(null);
  const { openSheet } = useStore();
  const step = !hair ? 0 : !look ? 1 : 2;
  const rec = hair && look ? recommend(hair, look) : null;

  return (
    <section className="finder" id="finder">
      <div className="container finder__grid">
        <div className="finder__intro">
          <div className="sec-label">
            <span className="mono">(04)</span>
            <span className="mono">Encuentra tu producto</span>
          </div>
          <RevealText className="h-xl">{'Tu cabello.\nTu *fórmula.*'}</RevealText>
          <FadeUp delay={0.15}>
            <p>Dos preguntas y te decimos qué usar. Como si estuvieras en el sillón.</p>
          </FadeUp>
          <div className="finder__dots" aria-hidden>
            {[0, 1, 2].map((i) => (
              <i key={i} className={i <= step ? 'is-on' : ''} />
            ))}
          </div>
        </div>

        <div className="finder__panel">
          <AnimatePresence mode="wait">
            {step < 2 ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: EASE.out }}
              >
                <span className="mono finder__q">Paso {step + 1} de 2</span>
                <h3>{step === 0 ? '¿Cómo es tu cabello?' : '¿Qué look buscas?'}</h3>
                <div className="options">
                  {(step === 0 ? HAIR : LOOK).map((o, i) => (
                    <motion.button
                      key={o.id}
                      className="option"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: EASE.out }}
                      onClick={() => (step === 0 ? setHair(o.id as Hair) : setLook(o.id as Look))}
                    >
                      <span>
                        <strong>{o.label}</strong>
                        <small>{o.hint}</small>
                      </span>
                      <Icon.Arrow />
                    </motion.button>
                  ))}
                </div>
                {step === 1 && (
                  <button className="finder__back mono" onClick={() => setHair(null)}>
                    ← Volver
                  </button>
                )}
              </motion.div>
            ) : (
              rec && (
                <motion.div
                  key="result"
                  className="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE.out }}
                >
                  <span className="mono finder__q">Tu match</span>
                  <div className="result__main" onClick={() => openSheet(rec.main)}>
                    <motion.img
                      src={byId(rec.main).images[0]}
                      alt=""
                      initial={{ clipPath: 'inset(0 100% 0 0)' }}
                      animate={{ clipPath: 'inset(0 0% 0 0)' }}
                      transition={{ duration: 1, ease: EASE.premium }}
                    />
                    <div>
                      <h3>{byId(rec.main).name}</h3>
                      <p>{rec.why}</p>
                      <div className="result__buy">
                        <strong>{money(byId(rec.main).price)}</strong>
                        <AddButton id={rec.main} className="add--wide" label="Añadir" />
                      </div>
                    </div>
                  </div>
                  <div className="result__pair">
                    <img src={byId(rec.pair).images[0]} alt="" />
                    <span>
                      <small className="mono">Combínalo con</small>
                      <strong>
                        {byId(rec.pair).name} · {money(byId(rec.pair).price)}
                      </strong>
                    </span>
                    <AddButton id={rec.pair} />
                  </div>
                  <button
                    className="finder__back mono"
                    onClick={() => {
                      setHair(null);
                      setLook(null);
                    }}
                  >
                    ↺ Empezar de nuevo
                  </button>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
