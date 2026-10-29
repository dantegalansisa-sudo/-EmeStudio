import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Category, type Product } from '../data/products';
import { BUNDLES, SHOP as PRODUCTS, byId, displayName } from '../data/catalog';
import { money } from '../data/site';
import { useLang } from '../i18n';
import { useStore } from '../store';
import { EASE } from '../utils';
import { FadeUp, Icon, Magnetic, RevealText } from './ui';

type Filter = 'all' | 'ofertas' | Category;
const FILTERS: { id: Filter; es: string; en: string }[] = [
  { id: 'all', es: 'Todo', en: 'All' },
  { id: 'ofertas', es: 'Ofertas', en: 'Deals' },
  { id: 'styling', es: 'Styling', en: 'Styling' },
  { id: 'rizos', es: 'Rizos', en: 'Curls' },
  { id: 'herramientas', es: 'Herramientas', en: 'Tools' },
];

export function AddButton({ id, className = '', label }: { id: string; className?: string; label?: string }) {
  const { add } = useStore();
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const click = (e: React.MouseEvent) => {
    e.stopPropagation();
    add(id);
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  };
  return (
    <button className={`add ${done ? 'is-done' : ''} ${className}`} onClick={click} aria-label={t(`Añadir ${byId(id).name} a la bolsa`, `Add ${byId(id).name} to bag`)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={done ? 'ok' : 'add'}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="add__inner"
        >
          {done ? <Icon.Check /> : <Icon.Plus />}
          {label && <span>{done ? t('Añadido', 'Added') : label}</span>}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/** Foto de estudio (fondo blanco) sobre un "escenario" claro: el blanco se disuelve con multiply */
export function Stage({ p, className = '', alt }: { p: Product; className?: string; alt?: string }) {
  return (
    <div className={`stage ${className}`}>
      <img src={p.studio} alt={alt ?? p.name} loading="lazy" className={p.studio.includes('/p-') ? 'is-cutout' : ''} />
    </div>
  );
}

function Card({ p, i }: { p: Product; i: number }) {
  const { openSheet } = useStore();
  const { t, l, lang } = useLang();
  return (
    <motion.article
      layout
      className="card"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: (i % 4) * 0.08, ease: EASE.out } },
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
      onClick={() => openSheet(p.id)}
    >
      <div className="card__media">
        <Stage p={p} alt={displayName(p, lang)} />
        {p.gallery[0] && <img className="card__alt" src={p.gallery[0]} alt="" loading="lazy" />}
        {p.tag && <span className={`card__tag mono ${p.compareAt ? 'card__tag--promo' : ''}`}>{l(p.tag)}</span>}
        <span className="card__index mono">0{i + 1}</span>
      </div>
      <div className="card__body">
        <div>
          <span className="card__type mono">{l(p.type)}</span>
          <h3>{displayName(p, lang)}</h3>
          <p>{l(p.tagline)}</p>
          <span className="card__meta mono">
            {p.size}
            {p.hold > 0 && ` · ${t('Fijación', 'Hold')} ${p.hold}/5`}
          </span>
        </div>
        <div className="card__buy">
          <span className="card__price">
            <strong>{money(p.price)}</strong>
            {p.compareAt && <s>{money(p.compareAt)}</s>}
          </span>
          <AddButton id={p.id} />
        </div>
      </div>
    </motion.article>
  );
}

export default function Collection() {
  const [filter, setFilter] = useState<Filter>('all');
  const { openSheet } = useStore();
  const { t, l } = useLang();
  const items =
    filter === 'ofertas'
      ? [...PRODUCTS.filter((p) => p.compareAt), ...BUNDLES]
      : PRODUCTS.filter((p) => p.category !== 'kits' && (filter === 'all' || p.category === filter));
  const kit = byId('kit-eme');

  return (
    <section className="collection" id="coleccion">
      <div className="container">
        <div className="sec-head">
          <div className="sec-label">
            <span className="mono">(02)</span>
            <span className="mono">{t('La colección', 'The collection')}</span>
          </div>
          <RevealText key={t('a', 'b')} className="h-xl">
            {t('Cuatro\nesenciales.\n*Cero relleno.*', 'Four\nessentials.\n*Zero filler.*')}
          </RevealText>
          <FadeUp delay={0.2} className="sec-head__aside">
            <p>
              {t(
                'Todo lo que necesitas para llevarte el resultado del sillón a tu rutina diaria. Elige por look, no por adivinanza.',
                'Everything you need to take the barber-chair result into your daily routine. Choose by look, not by guesswork.',
              )}
            </p>
          </FadeUp>
        </div>

        <div className="chips" role="tablist" aria-label={t('Filtrar productos', 'Filter products')}>
          {FILTERS.map((f) => (
            <button key={f.id} role="tab" aria-selected={filter === f.id} className={`chip ${filter === f.id ? 'is-active' : ''} ${f.id === 'ofertas' ? 'chip--deal' : ''}`} onClick={() => setFilter(f.id)}>
              {filter === f.id && <motion.span layoutId="chip-bg" className="chip__bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="chip__label">{t(f.es, f.en)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid-wrap">
        <motion.div layout className="grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <Card key={p.id} p={p} i={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="container">
        <motion.div
          className="bundle"
          initial={{ clipPath: 'inset(8% 6% 8% 6% round 32px)', opacity: 0.4 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 28px)', opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1.2, ease: EASE.premium }}
        >
          <div className="bundle__media" onClick={() => openSheet(kit.id)}>
            <Stage p={kit} className="stage--tall" alt="Kit EME STUDIO" />
          </div>
          <div className="bundle__body">
            <span className="badge mono">
              {t('Kit completo', 'Complete kit')} · {kit.tag && l(kit.tag)}
            </span>
            <h3>
              {t('El kit', 'The')} <em className="serif">{t('completo.', 'full kit.')}</em>
            </h3>
            <p>{l(kit.description)}</p>
            <ul>
              {kit.benefits.map((b) => (
                <li key={b.es}>
                  <Icon.Check /> {l(b)}
                </li>
              ))}
            </ul>
            <div className="bundle__buy">
              <div className="price">
                <strong>{money(kit.price)}</strong>
                {kit.compareAt && <s>{money(kit.compareAt)}</s>}
              </div>
              <AddButton id={kit.id} className="add--wide" label={t('Añadir kit', 'Add kit')} />
              <Magnetic className="link-arrow" onClick={() => openSheet(kit.id)}>
                {t('Detalles', 'Details')} <Icon.Arrow />
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
