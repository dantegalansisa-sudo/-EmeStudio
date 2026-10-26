import { useRef, useState, type CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ACTIVE_PROMOS, FEATURED_PROMO, UPCOMING_PROMOS, byId, promoProduct, savings } from '../data/catalog';
import type { Promo } from '../data/promos';
import { money, whatsappLink } from '../data/site';
import { useStore } from '../store';
import { EASE, useCountdown } from '../utils';
import { FadeUp, Icon, RevealText } from './ui';
import { AddButton } from './Collection';

const themeVars = (p: Promo) =>
  ({ '--p-bg': p.theme.bg, '--p-fg': p.theme.fg, '--p-accent': p.theme.accent }) as CSSProperties;

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('es-PR', { day: 'numeric', month: 'long' });

function Stock({ promo }: { promo: Promo }) {
  if (!promo.stock || !promo.stockTotal) return null;
  const pct = promo.stock / promo.stockTotal;
  return (
    <div className="stock">
      <div className="stock__row">
        <span>
          Quedan <strong>{promo.stock}</strong> unidades
        </span>
        <span className="mono">{Math.round((1 - pct) * 100)}% vendido</span>
      </div>
      <div className="stock__bar">
        <motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 - pct }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE.out }} />
      </div>
    </div>
  );
}

function Featured({ promo }: { promo: Promo }) {
  const { openSheet } = useStore();
  const c = useCountdown(promo.endsAt);
  const p = promoProduct(promo);
  return (
    <div className="feat">
      <motion.div
        className="feat__media"
        initial={{ clipPath: 'inset(10% 10% 10% 10% round 28px)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: EASE.premium }}
        onClick={() => openSheet(p.id)}
      >
        <img src={promo.image} alt={promo.name} loading="lazy" />
        <span className="feat__save">
          <b>-{savings(p)}%</b>
          <small className="mono">Ahorra {money(p.compareAt! - p.price)}</small>
        </span>
      </motion.div>

      <div className="feat__body">
        <span className="mono feat__kicker">{promo.badge}</span>
        <h3>{promo.name}</h3>
        <p>{promo.description}</p>

        {promo.items && (
          <ul className="feat__items">
            {promo.items.map((it, i) => (
              <motion.li
                key={it.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: EASE.out }}
              >
                <img src={byId(it.id).images[0]} alt="" />
                <span>
                  {it.qty > 1 && `${it.qty}× `}
                  {byId(it.id).name}
                </span>
                {i < promo.items!.length - 1 && <b aria-hidden>+</b>}
              </motion.li>
            ))}
          </ul>
        )}

        <div className="feat__timer">
          <span className="mono">Termina en</span>
          {(
            [
              ['d', c.d],
              ['h', c.h],
              ['m', c.m],
              ['s', c.s],
            ] as const
          ).map(([l, v]) => (
            <span key={l} className="feat__unit">
              <strong>{String(v).padStart(2, '0')}</strong>
              <small>{l}</small>
            </span>
          ))}
        </div>

        <Stock promo={promo} />

        <div className="feat__buy">
          <div className="feat__price">
            <strong>{money(p.price)}</strong>
            <s>{money(p.compareAt!)}</s>
          </div>
          <AddButton id={p.id} className="add--wide add--promo" label="Añadir especial" />
        </div>
        <a className="feat__gift" href={whatsappLink(`¡Hola EME STUDIO! Quiero el ${promo.name} para regalo.`)} target="_blank" rel="noreferrer">
          <Icon.WhatsApp /> Pedir como regalo
        </a>
      </div>
    </div>
  );
}

function OfferCard({ promo, i }: { promo: Promo; i: number }) {
  const { openSheet } = useStore();
  const p = promoProduct(promo);
  return (
    <motion.article
      className="offer"
      style={themeVars(promo)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: i * 0.08, duration: 0.8, ease: EASE.out }}
      onClick={() => openSheet(p.id)}
    >
      <div className="offer__media">
        <img src={promo.image} alt="" loading="lazy" />
        <span className="offer__pct">-{savings(p)}%</span>
      </div>
      <div className="offer__body">
        <span className="mono">
          {promo.badge} · hasta {fmtDate(promo.endsAt)}
        </span>
        <h4>{promo.name}</h4>
        <p>{p.size}</p>
        <Stock promo={promo} />
        <div className="offer__buy">
          <span>
            <strong>{money(p.price)}</strong>
            <s>{money(p.compareAt!)}</s>
          </span>
          <AddButton id={p.id} />
        </div>
      </div>
    </motion.article>
  );
}

function Upcoming({ promo }: { promo: Promo }) {
  const [on, setOn] = useState(false);
  return (
    <motion.article
      className="offer offer--soon"
      style={themeVars(promo)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE.out }}
    >
      <div className="offer__media">
        <img src={promo.image} alt="" loading="lazy" />
        <span className="offer__lock mono">
          <Icon.Calendar /> {fmtDate(promo.startsAt)}
        </span>
      </div>
      <div className="offer__body">
        <span className="mono">{promo.campaign} · Próximamente</span>
        <h4>{promo.name}</h4>
        <p>{promo.description}</p>
        <a
          className={`offer__notify ${on ? 'is-on' : ''}`}
          href={whatsappLink(`¡Hola EME STUDIO! Avísenme cuando salga el ${promo.name}.`)}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOn(true)}
        >
          {on ? <Icon.Check /> : <Icon.WhatsApp />} {on ? 'Te avisaremos' : 'Avísame'}
        </a>
      </div>
    </motion.article>
  );
}

export default function Specials() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-45%']);
  const featured = FEATURED_PROMO;
  if (!featured) return null;
  const others = ACTIVE_PROMOS.filter((p) => p.id !== featured.id);

  return (
    <section className="specials" id="especiales" ref={ref} style={themeVars(featured)}>
      <div className="specials__glow" aria-hidden />
      <motion.div className="specials__word" style={{ x }} aria-hidden>
        {featured.campaign} · {featured.campaign} ·
      </motion.div>

      <div className="container">
        <div className="specials__head">
          <div className="sec-label">
            <span className="mono">(★)</span>
            <span className="mono">Especiales</span>
          </div>
          <span className="specials__live mono">
            <i /> {featured.campaign} · hasta el {fmtDate(featured.endsAt)}
          </span>
          <RevealText className="specials__title">{featured.title}</RevealText>
        </div>

        <Featured promo={featured} />

        {(others.length > 0 || UPCOMING_PROMOS.length > 0) && (
          <>
            <FadeUp className="specials__sub">
              <h3>Más especiales</h3>
              <span className="mono">{others.length} activos · hasta agotar inventario</span>
            </FadeUp>
            <div className="offers">
              {others.map((p, i) => (
                <OfferCard key={p.id} promo={p} i={i} />
              ))}
              {UPCOMING_PROMOS.map((p) => (
                <Upcoming key={p.id} promo={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
