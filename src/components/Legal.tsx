import { motion } from 'framer-motion';
import { legalDoc } from '../data/legal';
import { useLang } from '../i18n';
import { goHome, navigate } from '../router';
import { EASE } from '../utils';
import { LEGAL_DOCS } from './Footer';
import { Icon } from './ui';

export default function Legal({ doc }: { doc: string }) {
  const { t, lang } = useLang();
  const d = legalDoc(doc, lang);

  return (
    <main className="legal" id="main" tabIndex={-1}>
      <div className="container legal__grid">
        <aside className="legal__nav">
          <button className="co__back mono" onClick={() => goHome()}>
            <Icon.Back /> {t('Volver a la tienda', 'Back to shop')}
          </button>
          <nav aria-label="Legal">
            {LEGAL_DOCS.map((x) => (
              <button key={x.id} className={x.id === doc ? 'is-active' : ''} onClick={() => navigate(`/legal/${x.id}`)}>
                {t(x.es, x.en)}
              </button>
            ))}
          </nav>
        </aside>

        <motion.article key={`${doc}-${lang}`} className="legal__doc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE.out }}>
          {d ? (
            <>
              <span className="mono legal__kicker">EME STUDIO · Legal</span>
              <h1>{d.title}</h1>
              <p className="legal__intro">{d.intro}</p>
              {d.sections.map((s) => (
                <section key={s.h}>
                  <h2>{s.h}</h2>
                  {s.p.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </section>
              ))}
            </>
          ) : (
            <h1>{t('Documento no encontrado', 'Document not found')}</h1>
          )}
        </motion.article>
      </div>
    </main>
  );
}
