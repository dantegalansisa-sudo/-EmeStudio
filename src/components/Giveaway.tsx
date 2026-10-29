import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ACTIVE_GIVEAWAY } from '../data/catalog';
import { SITE, money } from '../data/site';
import { useLang } from '../i18n';
import { navigate } from '../router';
import { EASE, useCountdown } from '../utils';
import { FadeUp, Icon, RevealText, Snow } from './ui';

/* Giveaway / sorteo: datos en promos.ts → GIVEAWAYS (administrable desde el panel) */
export default function Giveaway() {
  const g = ACTIVE_GIVEAWAY;
  const { t, l, lang } = useLang();
  const c = useCountdown(g?.endsAt ?? new Date().toISOString());
  const [form, setForm] = useState({ name: '', email: '', ig: '', rules: false, news: false });
  const [sent, setSent] = useState(false);
  if (!g) return null;

  const fmt = (iso: string) => new Date(iso).toLocaleDateString(lang === 'es' ? 'es-PR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.rules;

  return (
    <section className="give" id="giveaway">
      <Snow density={0.7} />
      <div className="container give__grid">
        <div className="give__copy">
          <div className="sec-label">
            <span className="mono">(🎁)</span>
            <span className="mono">Giveaway</span>
          </div>
          <RevealText key={lang} className="give__title">
            {l(g.title)}
          </RevealText>
          <FadeUp delay={0.1}>
            <p className="give__lead">
              {t('Premio', 'Prize')}: <strong>{l(g.prize)}</strong> · {g.winners} {t('ganadores', 'winners')} · {t('valor', 'value')} {money(g.prizeValue)}{' '}
              {t('c/u', 'each')}.
            </p>
          </FadeUp>

          <div className="give__timer" aria-label={t('Tiempo restante', 'Time left')}>
            {(
              [
                [t('días', 'days'), c.d],
                [t('horas', 'hrs'), c.h],
                ['min', c.m],
                ['seg', c.s],
              ] as const
            ).map(([u, v]) => (
              <span key={u}>
                <strong>{String(v).padStart(2, '0')}</strong>
                <small className="mono">{u}</small>
              </span>
            ))}
          </div>

          <ol className="give__steps">
            {g.steps.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: EASE.out }}
              >
                <span className="mono">0{i + 1}</span>
                {l(s)}
              </motion.li>
            ))}
          </ol>
          <a className="link-arrow link-arrow--light" href={SITE.instagram} target="_blank" rel="noreferrer">
            <Icon.Insta /> {SITE.instagramHandle} <Icon.Arrow />
          </a>
        </div>

        <motion.div
          className="give__card"
          initial={{ opacity: 0, y: 50, rotate: 1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1, ease: EASE.out }}
        >
          <div className="give__prize">
            <img src={g.image} alt={l(g.prize)} loading="lazy" />
            <span className="give__ribbon mono">{t('Entrada gratis', 'Free entry')}</span>
          </div>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" className="give__ok" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                <span className="give__okicon">
                  <Icon.Check />
                </span>
                <h4>{t('¡Estás participando!', "You're in!")}</h4>
                <p>
                  {t('Anunciamos a los ganadores el', 'Winners will be announced on')} {fmt(g.drawAt)} {t('en', 'on')} {SITE.instagramHandle}.{' '}
                  {t('¡Suerte!', 'Good luck!')}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="give__form"
                exit={{ opacity: 0, y: -10 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (valid) setSent(true);
                }}
              >
                <label>
                  <span>{t('Nombre completo', 'Full name')}</span>
                  <input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label>
                  <span>{t('Correo electrónico', 'Email')}</span>
                  <input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
                <label>
                  <span>{t('Usuario de Instagram (opcional)', 'Instagram handle (optional)')}</span>
                  <input placeholder="@" value={form.ig} onChange={(e) => setForm({ ...form, ig: e.target.value })} />
                </label>
                <label className="check">
                  <input type="checkbox" required checked={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.checked })} />
                  <span>
                    {t('Tengo 21 años o más, resido en Puerto Rico y acepto las ', "I'm 21 or older, a Puerto Rico resident, and I accept the ")}
                    <button type="button" className="inline-link" onClick={() => navigate('/legal/giveaway')}>
                      {t('reglas oficiales', 'official rules')}
                    </button>
                    .
                  </span>
                </label>
                <label className="check">
                  <input type="checkbox" checked={form.news} onChange={(e) => setForm({ ...form, news: e.target.checked })} />
                  <span>{t('Quiero recibir ofertas de EME STUDIO por correo (opcional).', 'Send me EME STUDIO offers by email (optional).')}</span>
                </label>
                <button className="btn btn--xmas btn--block" type="submit" disabled={!valid}>
                  {t('Participar', 'Enter giveaway')} <Icon.Arrow />
                </button>
                <p className="give__legal">
                  {t(
                    'No se requiere compra. Una compra no aumenta tus probabilidades de ganar. Nulo donde esté prohibido. Esta promoción no está patrocinada, avalada ni administrada por Instagram ni Meta.',
                    'No purchase necessary. A purchase will not increase your chances of winning. Void where prohibited. This promotion is not sponsored, endorsed or administered by Instagram or Meta.',
                  )}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
