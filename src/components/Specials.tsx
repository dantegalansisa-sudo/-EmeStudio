import { useRef, useState, type CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ACTIVE_PROMOS, FEATURED_PROMO, UPCOMING_PROMOS, byId, displayName, promoProduct, savings } from '../data/catalog';
import type { Promo } from '../data/promos';
import { money, whatsappLink } from '../data/site';
import { useLang } from '../i18n';
import { useStore } from '../store';
import { EASE, useCountdown } from '../utils';
import { FadeUp, Garland, Icon, RevealText, Snow } from './ui';
import { AddButton } from './Collection';

export const themeVars = (p: Promo) =>
  ({ '--p-bg': p.theme.bg, '--p-fg': p.theme.fg, '--p-accent': p.theme.accent, '--p-accent-fg': p.theme.accentFg }) as CSSProperties;

function useFmtDate() {
  const { lang } = useLang();
  return (iso: string) => new Date(iso).toLocaleDateString(lang === 'es' ? 'es-PR' : 'en-US', { day: 'numeric', month: 'long' });
}

function Stock({ promo }: { promo: Promo }) {
  const { t } = useLang();
  if (!promo.stock || !promo.stockTotal) return null;
  const pct = promo.stock / promo.stockTotal;
  return (
    <div className="stock">
      <div className="stock__row">
        <span>
          {t('Quedan', 'Only')} <strong>{promo.stock}</strong> {t('unidades', 'left')}
        </span>
        <span className="mono">
          {Math.round((1 - pct) * 100)}% {t('vendido', 'sold')}
        </span>
      </div>
      <div className="stock__bar">
        <motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 - pct }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE.out }} />
      </div>
    </div>
  );
}

function Featured({ promo }: { promo: Promo }) {
  const { openSheet } = useStore();
  const { t, l, lang } = useLang();
  const c = useCountdown(promo.endsAt);
  const p = promoProduct(promo);
  const items = promo.items ?? (p.id === 'kit-eme' ? ['curl-cream', 'volume-powder', 'clay-wax', 'peinilla'].map((id) => ({ id, qty: 1 })) : []);
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
        <img src={promo.image} alt={l(promo.name)} loading="lazy" />
        {p.compareAt && (
          <span className="feat__save">
            <b>-{savings(p)}%</b>
            <small className="mono">
              {t('Ahorra', 'Save')} {money(p.compareAt - p.price)}
            </small>
          </span>
        )}
      </motion.div>

      <div className="feat__body">
        <span className="mono feat__kicker">{l(promo.badge)}</span>
        <h3>{displayName(p, lang)}</h3>
        <p>{l(promo.description)}</p>

        {items.length > 0 && (
          <ul className="feat__items">
            {items.map((it, i) => (
              <motion.li
                key={it.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: EASE.out }}
              >
                <span className="feat__thumb">
                  <img src={byId(it.id).studio} alt="" />
                </span>
                <span>
                  {it.qty > 1 && `${it.qty}× `}
                  {byId(it.id).name}
                </span>
                {i < items.length - 1 && <b aria-hidden>+</b>}
              </motion.li>
            ))}
          </ul>
        )}

        <div className="feat__timer">
          <span className="mono">{t('Termina en', 'Ends in')}</span>
          {(
            [
              ['d', c.d],
              ['h', c.h],
              ['m', c.m],
              ['s', c.s],
            ] as const
          ).map(([u, v]) => (
            <span key={u} className="feat__unit">
              <strong>{String(v).padStart(2, '0')}</strong>
              <small>{u}</small>
            </span>
          ))}
        </div>

        <Stock promo={promo} />

        <div className="feat__buy">
          <div className="feat__price">
            <strong>{money(p.price)}</strong>
            {p.compareAt && <s>{money(p.compareAt)}</s>}
          </div>
          <AddButton id={p.id} className="add--wide add--promo" label={t('Añadir a la bolsa', 'Add to bag')} />
        </div>
        <div className="feat__links">
          <button className="feat__gift" onClick={() => openSheet(p.id)}>
            {t('Ver detalles', 'View details')} <Icon.Arrow />
          </button>
          <a
            className="feat__gift"
            href={whatsappLink(t(`¡Hola EME STUDIO! Quiero el ${displayName(p, 'es')} para regalo.`, `Hi EME STUDIO! I'd like the ${displayName(p, 'en')} as a gift.`))}
            target="_blank"
            rel="noreferrer"
          >
            <Icon.WhatsApp /> {t('Pedir como regalo', 'Order as a gift')}
          </a>
        </div>
      </div>
    </div>
  );
}

function OfferCard({ promo, i }: { promo: Promo; i: number }) {
  const { openSheet } = useStore();
  const { t, l } = useLang();
  const fmt = useFmtDate();
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
        {promo.studio ? (
          <div className="stage">
            <img src={promo.studio} alt={l(promo.name)} loading="lazy" />
          </div>
        ) : (
          <img src={promo.image} alt={l(promo.name)} loading="lazy" />
        )}
        {p.compareAt && <span className="offer__pct">-{savings(p)}%</span>}
      </div>
      <div className="offer__body">
        <span className="mono">
          {l(promo.badge)} · {t('hasta el', 'until')} {fmt(promo.endsAt)}
        </span>
        <h4>
          {l(promo.title)
            .replace(/\*/g, '')
            .split('\n')
            .map((line) => (
              <span key={line}>{line}</span>
            ))}
        </h4>
        <p>{l(promo.description)}</p>
        <Stock promo={promo} />
        <div className="offer__buy">
          <span>
            <strong>{money(p.price)}</strong>
            {p.compareAt && <s>{money(p.compareAt)}</s>}
          </span>
          <AddButton id={p.id} />
        </div>
      </div>
    </motion.article>
  );
}

function Upcoming({ promo }: { promo: Promo }) {
  const [on, setOn] = useState(false);
  const { t, l } = useLang();
  const fmt = useFmtDate();
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
          <Icon.Calendar /> {fmt(promo.startsAt)}
        </span>
      </div>
      <div className="offer__body">
        <span className="mono">
          {l(promo.campaign)} · {t('Próximamente', 'Coming soon')}
        </span>
        <h4>{l(promo.name)}</h4>
        <p>{l(promo.description)}</p>
        <a
          className={`offer__notify ${on ? 'is-on' : ''}`}
          href={whatsappLink(t(`¡Hola EME STUDIO! Avísenme cuando salga el ${l(promo.name)}.`, `Hi EME STUDIO! Let me know when the ${l(promo.name)} drops.`))}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOn(true)}
        >
          {on ? <Icon.Check /> : <Icon.WhatsApp />} {on ? t('Solicitud enviada', 'Request sent') : t('Avísame', 'Notify me')}
        </a>
      </div>
    </motion.article>
  );
}

export default function Specials() {
  const ref = useRef<HTMLElement>(null);
  const { t, l } = useLang();
  const fmt = useFmtDate();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-45%']);
  const featured = FEATURED_PROMO;
  if (!featured) return null;
  const others = ACTIVE_PROMOS.filter((p) => p.id !== featured.id);

  return (
    <section className="specials" id="especiales" ref={ref} style={themeVars(featured)}>
      <Garland count={22} />
      <Snow density={0.9} />
      <div className="specials__glow" aria-hidden />
      <motion.div className="specials__word" style={{ x }} aria-hidden>
        {l(featured.campaign)} · {l(featured.campaign)} ·
      </motion.div>

      <div className="container">
        <div className="specials__head">
          <div className="sec-label">
            <span className="mono">(★)</span>
            <span className="mono">{t('Especiales', 'Specials')}</span>
          </div>
          <span className="specials__live mono">
            <i /> {l(featured.campaign)} · {t('hasta el', 'until')} {fmt(featured.endsAt)}
          </span>
          <RevealText key={l(featured.title)} className="specials__title">
            {l(featured.title)}
          </RevealText>
        </div>

        <Featured promo={featured} />

        {(others.length > 0 || UPCOMING_PROMOS.length > 0) && (
          <>
            <FadeUp className="specials__sub">
              <h3>{t('Más ofertas', 'More deals')}</h3>
              <span className="mono">
                {others.length} {t('activas · hasta agotar inventario', 'live · while supplies last')}
              </span>
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
