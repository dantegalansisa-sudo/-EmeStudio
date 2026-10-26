import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PRODUCTS, byId, type Category, type Product } from '../data/products';
import { money } from '../data/site';
import { useStore } from '../store';
import { EASE } from '../utils';
import { FadeUp, Icon, Magnetic, RevealText } from './ui';

const FILTERS: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'styling', label: 'Styling' },
  { id: 'rizos', label: 'Rizos' },
  { id: 'herramientas', label: 'Herramientas' },
];

export function AddButton({ id, className = '', label }: { id: string; className?: string; label?: string }) {
  const { add } = useStore();
  const [done, setDone] = useState(false);
  const click = (e: React.MouseEvent) => {
    e.stopPropagation();
    add(id);
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  };
  return (
    <button className={`add ${done ? 'is-done' : ''} ${className}`} onClick={click} aria-label={`Añadir ${byId(id).name} al carrito`}>
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
          {label && <span>{done ? 'Añadido' : label}</span>}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function Card({ p, i }: { p: Product; i: number }) {
  const { openSheet } = useStore();
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
      data-cursor="Ver"
    >
      <div className="card__media">
        <img src={p.images[0]} alt={p.name} loading="lazy" />
        {p.images[1] && <img className="card__alt" src={p.images[1]} alt="" loading="lazy" />}
        {p.tag && <span className="card__tag mono">{p.tag}</span>}
        <span className="card__index mono">0{i + 1}</span>
      </div>
      <div className="card__body">
        <div>
          <h3>{p.name}</h3>
          <p>{p.tagline}</p>
          <span className="card__meta mono">
            {p.size}
            {p.hold > 0 && ` · Fijación ${p.hold}/5`}
          </span>
        </div>
        <div className="card__buy">
          <strong>{money(p.price)}</strong>
          <AddButton id={p.id} />
        </div>
      </div>
    </motion.article>
  );
}

export default function Collection() {
  const [filter, setFilter] = useState<'all' | Category>('all');
  const { openSheet } = useStore();
  const items = PRODUCTS.filter((p) => p.category !== 'kits' && (filter === 'all' || p.category === filter));
  const kit = byId('kit-eme');

  return (
    <section className="collection" id="coleccion">
      <div className="container">
        <div className="sec-head">
          <div className="sec-label">
            <span className="mono">(02)</span>
            <span className="mono">La colección</span>
          </div>
          <RevealText className="h-xl">{'Cuatro\nesenciales.\n*Cero relleno.*'}</RevealText>
          <FadeUp delay={0.2} className="sec-head__aside">
            <p>Todo lo que necesitas para llevarte el resultado del sillón a tu rutina diaria. Elige por look, no por adivinanza.</p>
          </FadeUp>
        </div>

        <div className="chips" role="tablist" aria-label="Filtrar productos">
          {FILTERS.map((f) => (
            <button key={f.id} role="tab" aria-selected={filter === f.id} className={`chip ${filter === f.id ? 'is-active' : ''}`} onClick={() => setFilter(f.id)}>
              {filter === f.id && <motion.span layoutId="chip-bg" className="chip__bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="chip__label">{f.label}</span>
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
          <div className="bundle__media" onClick={() => openSheet(kit.id)} data-cursor="Ver kit">
            <img src={kit.images[0]} alt="Kit EME Completo con bolsa oficial" loading="lazy" />
          </div>
          <div className="bundle__body">
            <span className="badge mono">Bundle & Save · {kit.tag}</span>
            <h3>
              El kit <em className="serif">completo.</em>
            </h3>
            <p>{kit.description}</p>
            <ul>
              {kit.benefits.map((b) => (
                <li key={b}>
                  <Icon.Check /> {b}
                </li>
              ))}
            </ul>
            <div className="bundle__buy">
              <div className="price">
                <strong>{money(kit.price)}</strong>
                <s>{money(kit.compareAt!)}</s>
              </div>
              <AddButton id={kit.id} className="add--wide" label="Añadir kit" />
              <Magnetic className="link-arrow" onClick={() => openSheet(kit.id)}>
                Detalles <Icon.Arrow />
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
