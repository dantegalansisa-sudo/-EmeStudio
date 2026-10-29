import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { byId } from '../data/catalog';
import { money } from '../data/site';
import { useLang, type L } from '../i18n';
import { useStore } from '../store';
import { EASE } from '../utils';
import { FadeUp, Icon, RevealText } from './ui';
import { AddButton, Stage } from './Collection';

type Hair = 'lacio' | 'ondulado' | 'rizado';
type Look = 'volumen' | 'control' | 'rizo';

const HAIR: { id: Hair; label: L; hint: L }[] = [
  { id: 'lacio', label: { es: 'Lacio', en: 'Straight' }, hint: { es: 'Cae plano, cuesta darle forma', en: 'Falls flat, hard to shape' } },
  { id: 'ondulado', label: { es: 'Ondulado', en: 'Wavy' }, hint: { es: 'Tiene movimiento, a veces frizz', en: 'Has movement, some frizz' } },
  { id: 'rizado', label: { es: 'Rizado', en: 'Curly' }, hint: { es: 'Rizo definido o afro', en: 'Defined curls or coils' } },
];
const LOOK: { id: Look; label: L; hint: L }[] = [
  { id: 'volumen', label: { es: 'Volumen y textura', en: 'Volume & texture' }, hint: { es: 'Más cuerpo, acabado mate', en: 'More body, matte finish' } },
  { id: 'control', label: { es: 'Control extra fuerte', en: 'Extra-strong control' }, hint: { es: 'Forma que aguanta todo el día', en: 'Shape that lasts all day' } },
  { id: 'rizo', label: { es: 'Rizo definido', en: 'Defined curls' }, hint: { es: 'Sin frizz, con brillo', en: 'No frizz, with shine' } },
];

function recommend(h: Hair, look: Look): { main: string; pair: string; why: L } {
  if (look === 'volumen')
    return {
      main: 'volume-powder',
      pair: h === 'rizado' ? 'curl-cream' : 'clay-wax',
      why: { es: 'Máximo volumen desde la raíz con acabado mate. Combínalo para fijar la forma.', en: 'Maximum volume from the roots with a matte finish. Pair it to lock in the shape.' },
    };
  if (look === 'control')
    return {
      main: 'clay-wax',
      pair: h === 'lacio' ? 'volume-powder' : 'peinilla',
      why: { es: 'Fijación extra fuerte que aumenta el grosor y da textura, con acabado mate natural.', en: 'Extra-strong hold that builds thickness and texture with a natural matte finish.' },
    };
  if (h === 'lacio')
    return {
      main: 'clay-wax',
      pair: 'volume-powder',
      why: { es: 'En cabello lacio, la Clay Wax te da movimiento y textura definida.', en: 'On straight hair, Clay Wax gives you movement and defined texture.' },
    };
  return {
    main: 'curl-cream',
    pair: 'peinilla',
    why: { es: 'Realza cada rizo, combate el frizz y deja tacto sedoso con brillo.', en: 'Enhances every curl, fights frizz and leaves a silky, shiny feel.' },
  };
}

export default function Finder() {
  const [hair, setHair] = useState<Hair | null>(null);
  const [look, setLook] = useState<Look | null>(null);
  const { openSheet } = useStore();
  const { t, l, lang } = useLang();
  const step = !hair ? 0 : !look ? 1 : 2;
  const rec = hair && look ? recommend(hair, look) : null;

  return (
    <section className="finder" id="finder">
      <div className="container finder__grid">
        <div className="finder__intro">
          <div className="sec-label">
            <span className="mono">(04)</span>
            <span className="mono">{t('Encuentra tu producto', 'Find your product')}</span>
          </div>
          <RevealText key={lang} className="h-xl">
            {t('Tu cabello.\nTu *fórmula.*', 'Your hair.\nYour *formula.*')}
          </RevealText>
          <FadeUp delay={0.15}>
            <p>{t('Dos preguntas y te decimos qué usar. Como si estuvieras en el sillón.', 'Two questions and we’ll tell you what to use. Just like in the chair.')}</p>
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
              <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5, ease: EASE.out }}>
                <span className="mono finder__q">
                  {t('Paso', 'Step')} {step + 1} {t('de', 'of')} 2
                </span>
                <h3>{step === 0 ? t('¿Cómo es tu cabello?', 'What’s your hair like?') : t('¿Qué look buscas?', 'What look are you after?')}</h3>
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
                        <strong>{l(o.label)}</strong>
                        <small>{l(o.hint)}</small>
                      </span>
                      <Icon.Arrow />
                    </motion.button>
                  ))}
                </div>
                {step === 1 && (
                  <button className="finder__back mono" onClick={() => setHair(null)}>
                    ← {t('Volver', 'Back')}
                  </button>
                )}
              </motion.div>
            ) : (
              rec && (
                <motion.div key="result" className="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE.out }}>
                  <span className="mono finder__q">{t('Tu match', 'Your match')}</span>
                  <div className="result__main" onClick={() => openSheet(rec.main)}>
                    <motion.div initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 1, ease: EASE.premium }}>
                      <Stage p={byId(rec.main)} className="result__stage" />
                    </motion.div>
                    <div>
                      <h3>{byId(rec.main).name}</h3>
                      <p>{l(rec.why)}</p>
                      <div className="result__buy">
                        <strong>{money(byId(rec.main).price)}</strong>
                        <AddButton id={rec.main} className="add--wide" label={t('Añadir', 'Add')} />
                      </div>
                    </div>
                  </div>
                  <div className="result__pair">
                    <Stage p={byId(rec.pair)} className="result__mini" />
                    <span>
                      <small className="mono">{t('Combínalo con', 'Pair it with')}</small>
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
                    ↺ {t('Empezar de nuevo', 'Start over')}
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
