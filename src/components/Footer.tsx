import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE, whatsappLink } from '../data/site';
import { LangToggle, useLang } from '../i18n';
import { navigate } from '../router';
import { useStore } from '../store';
import { EASE, scrollToId } from '../utils';
import { Icon, RevealText } from './ui';

const GRID = ['/media/model-curls.webp', '/media/clay-held.webp', '/media/bball-2.webp', '/media/curl-held.webp', '/media/barber-profile.webp', '/media/kit-curl-powder.webp'];

export const NEXIX_URL = 'https://www.nexixtechstudio.com';

export const LEGAL_DOCS = [
  { id: 'terminos', es: 'Términos y condiciones', en: 'Terms & conditions' },
  { id: 'privacidad', es: 'Política de privacidad', en: 'Privacy policy' },
  { id: 'envios', es: 'Envíos y devoluciones', en: 'Shipping & returns' },
  { id: 'giveaway', es: 'Reglas de giveaways', en: 'Giveaway rules' },
  { id: 'accesibilidad', es: 'Accesibilidad', en: 'Accessibility' },
];

export default function Footer() {
  const { openSheet } = useStore();
  const { t, lang } = useLang();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <footer className="footer">
      <div className="container">
        <div className="ig">
          <div className="ig__head">
            <span className="mono">{SITE.instagramHandle}</span>
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="link-arrow link-arrow--light">
              {t('Ver Instagram', 'View Instagram')} <Icon.Arrow />
            </a>
          </div>
          <div className="ig__grid">
            {GRID.map((src, i) => (
              <motion.a
                key={src}
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label={`Instagram ${SITE.instagramHandle}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.7, ease: EASE.out }}
              >
                <img src={src} alt="" loading="lazy" />
                <span>
                  <Icon.Insta />
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        <div className="footer__cols">
          <div>
            <span className="mono">{t('Tienda', 'Shop')}</span>
            <button onClick={() => openSheet('volume-powder')}>Volume Powder</button>
            <button onClick={() => openSheet('clay-wax')}>Clay Wax</button>
            <button onClick={() => openSheet('curl-cream')}>Curl Cream</button>
            <button onClick={() => openSheet('peinilla')}>Peinilla EME</button>
            <button onClick={() => openSheet('kit-eme')}>Kit EME STUDIO</button>
            <button onClick={() => scrollToId('especiales')}>{t('Especiales', 'Specials')}</button>
          </div>
          <div>
            <span className="mono">{t('Marca', 'Brand')}</span>
            <button onClick={() => scrollToId('marca')}>{t('Manifiesto', 'Manifesto')}</button>
            <button onClick={() => scrollToId('resultados')}>{t('Resultados', 'Results')}</button>
            <button onClick={() => scrollToId('giveaway')}>Giveaway</button>
            <button onClick={() => scrollToId('barberos')}>{t('Para barberos', 'For barbers')}</button>
          </div>
          <div>
            <span className="mono">{t('Ayuda', 'Help')}</span>
            <a href={whatsappLink(t('¡Hola EME STUDIO! Tengo una pregunta.', 'Hi EME STUDIO! I have a question.'))} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <button onClick={() => navigate('/legal/envios')}>{t('Envíos y devoluciones', 'Shipping & returns')}</button>
            <button onClick={() => scrollToId('finder')}>{t('Encuentra tu producto', 'Find your product')}</button>
          </div>
        </div>

        <div className="club">
          <div>
            <RevealText key={lang} className="club__title">
              {t('Únete al\n*Club EME.*', 'Join the\n*EME Club.*')}
            </RevealText>
            <p>{t('Lanzamientos, especiales, giveaways y 10% en tu primera orden.', 'Drops, specials, giveaways and 10% off your first order.')}</p>
          </div>
          <form
            className="club__form"
            onSubmit={(e) => {
              e.preventDefault();
              if (/\S+@\S+\.\S+/.test(email)) setSent(true);
            }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.p key="ok" className="club__ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Icon.Check /> {t('¡Bienvenido! Tu código:', 'Welcome! Your code:')} <b className="mono">CLUBEME10</b>
                </motion.p>
              ) : (
                <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                  <div className="club__field">
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder={t('Tu correo electrónico', 'Your email')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-label={t('Correo electrónico', 'Email')}
                    />
                    <button type="submit" aria-label={t('Suscribirme', 'Subscribe')}>
                      <Icon.Arrow />
                    </button>
                  </div>
                  <p className="club__consent">
                    {t(
                      'Al suscribirte aceptas recibir correos de marketing de EME STUDIO. Puedes darte de baja en cualquier momento. Ver ',
                      'By subscribing you agree to receive marketing emails from EME STUDIO. Unsubscribe anytime. See our ',
                    )}
                    <button type="button" className="inline-link" onClick={() => navigate('/legal/privacidad')}>
                      {t('Política de privacidad', 'Privacy policy')}
                    </button>
                    .
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

      </div>

      <div className="container footer__legal">
        <span>
          © 2026 {SITE.legalName}® · {t('Todos los derechos reservados.', 'All rights reserved.')}
        </span>
        <nav className="footer__legalnav" aria-label="Legal">
          {LEGAL_DOCS.map((d) => (
            <button key={d.id} onClick={() => navigate(`/legal/${d.id}`)}>
              {t(d.es, d.en)}
            </button>
          ))}
        </nav>
        <div className="footer__bottom">
          <LangToggle />
          <span className="footer__tax">{t('Precios en USD · IVU de PR (11.5%) al pagar', 'Prices in USD · PR sales tax (11.5%) at checkout')}</span>
          <a className="footer__credit" href={NEXIX_URL} target="_blank" rel="noopener">
            {t('Diseño y desarrollo por', 'Designed & developed by')} <strong>NEXIX Tech Studio</strong>
          </a>
        </div>
      </div>
    </footer>
  );
}
