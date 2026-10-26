import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { SITE, whatsappLink } from '../data/site';
import { useStore } from '../store';
import { EASE, scrollToId } from '../utils';
import { Icon, RevealText } from './ui';

const GRID = ['/media/model-curls.webp', '/media/clay-held.webp', '/media/bball-2.webp', '/media/curl-held.webp', '/media/barber-profile.webp', '/media/kit-curl-powder.webp'];

export default function Footer() {
  const { openSheet } = useStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const markY = useTransform(scrollYProgress, [0.4, 1], ['40%', '0%']);

  return (
    <footer className="footer" ref={ref}>
      <div className="container">
        <div className="ig">
          <div className="ig__head">
            <span className="mono">{SITE.instagramHandle}</span>
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="link-arrow link-arrow--light">
              Ver Instagram <Icon.Arrow />
            </a>
          </div>
          <div className="ig__grid">
            {GRID.map((src, i) => (
              <motion.a
                key={src}
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
               
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

        <div className="club">
          <div>
            <RevealText className="club__title">{'Únete al\n*Club EME.*'}</RevealText>
            <p>Lanzamientos, eventos y 10% en tu primera orden. Sin spam — solo estilo.</p>
          </div>
          <form
            className="club__form"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes('@')) setSent(true);
            }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.p key="ok" className="club__ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Icon.Check /> ¡Listo! Revisa tu correo.
                </motion.p>
              ) : (
                <motion.div key="form" className="club__field" exit={{ opacity: 0, y: -10 }}>
                  <input type="email" required placeholder="Tu correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Correo electrónico" />
                  <button type="submit" aria-label="Suscribirme">
                    <Icon.Arrow />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        <div className="footer__cols">
          <div>
            <span className="mono">Tienda</span>
            <button onClick={() => openSheet('volume-powder')}>Volume Powder</button>
            <button onClick={() => openSheet('clay-wax')}>Clay Wax</button>
            <button onClick={() => openSheet('curl-cream')}>Curl Cream</button>
            <button onClick={() => openSheet('peinilla')}>Peinilla EME</button>
            <button onClick={() => openSheet('kit-eme')}>Kit completo</button>
          </div>
          <div>
            <span className="mono">Marca</span>
            <button onClick={() => scrollToId('marca')}>Manifiesto</button>
            <button onClick={() => scrollToId('resultados')}>Resultados</button>
            <button onClick={() => scrollToId('eventos')}>Eventos</button>
            <button onClick={() => scrollToId('barberos')}>Para barberos</button>
          </div>
          <div>
            <span className="mono">Ayuda</span>
            <a href={whatsappLink('¡Hola EME STUDIO! Tengo una pregunta.')} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <button onClick={() => scrollToId('finder')}>Encuentra tu producto</button>
            <span className="footer__muted">Envíos en todo Puerto Rico</span>
          </div>
        </div>
      </div>

      <div className="footer__mark" aria-hidden>
        <motion.img src="/media/logo.png" alt="" style={{ y: markY }} />
      </div>

      <div className="container footer__legal">
        <span>© 2026 EME STUDIO®. Hair · Style · Lifestyle.</span>
        <span>Términos y políticas</span>
        <span>Diseño web por NEXIX</span>
      </div>
    </footer>
  );
}
