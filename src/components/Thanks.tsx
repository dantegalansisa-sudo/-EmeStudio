import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SITE } from '../data/site';
import { useLang } from '../i18n';
import { goHome } from '../router';
import { useStore } from '../store';
import { EASE } from '../utils';
import { Icon } from './ui';

/* /gracias — Stripe redirige aquí tras un pago exitoso */
export default function Thanks({ sessionId }: { sessionId: string | null }) {
  const { clear } = useStore();
  const { t } = useLang();

  // Vacía la bolsa una sola vez al llegar (clear cambia de identidad en cada render)
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ref = sessionId ? sessionId.slice(-8).toUpperCase() : null;

  return (
    <main className="co co--done container" id="main" tabIndex={-1}>
      <motion.div className="co__done" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE.out }}>
        <span className="give__okicon">
          <Icon.Check />
        </span>
        {ref && (
          <span className="mono">
            {t('Orden', 'Order')} #{ref}
          </span>
        )}
        <h1>{t('¡Gracias por tu compra!', 'Thanks for your order!')}</h1>
        <p>
          {t(
            'Tu pago se procesó correctamente. Recibirás el recibo en tu correo electrónico y te avisaremos cuando tu orden salga.',
            'Your payment went through. You’ll receive your receipt by email and we’ll let you know when your order ships.',
          )}
        </p>
        <p>
          {t('¿Preguntas? Escríbenos a ', 'Questions? Email us at ')}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
        <button className="btn btn--dark" onClick={() => goHome()}>
          {t('Seguir comprando', 'Continue shopping')} <Icon.Arrow />
        </button>
      </motion.div>
    </main>
  );
}
