import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SITE, whatsappLink } from '../data/site';
import { useLang } from '../i18n';
import { EASE } from '../utils';
import { AutoVideo, Counter, FadeUp, Icon, Magnetic, RevealText } from './ui';

/* ---------- Comunidad: video que se expande con el scroll ---------- */
export function Community() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  // Solo transforms (compositor): animar clip-path repintaba el video en cada frame
  const frame = useTransform(scrollYProgress, [0, 1], [0.84, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

  return (
    <section className="community" ref={ref}>
      <motion.div className="community__media" style={{ scale: frame }}>
        <motion.div style={{ scale }} className="community__video">
          <AutoVideo src="/media/v-5k.mp4" poster="/media/v-5k.webp" />
        </motion.div>
        <div className="community__shade" />
      </motion.div>
      <div className="community__content container">
        <span className="mono community__tag">{t('Comunidad EME · 5K de los Barberos', 'EME community · Barbers 5K')}</span>
        <RevealText key={lang} className="community__title">
          {t('Esto apenas\n*comienza.*', 'This is just\nthe *beginning.*')}
        </RevealText>
        <FadeUp delay={0.2}>
          <p>
            {t(
              'Barberos de toda la isla, una misma pasión. Llevamos EME a donde está la comunidad — y la comunidad nos lleva más lejos.',
              'Barbers from all over the island, one shared passion. We take EME where the community is — and the community takes us further.',
            )}
          </p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <a className="link-arrow link-arrow--light" href={SITE.instagram} target="_blank" rel="noreferrer">
            {t('Síguenos', 'Follow us')} {SITE.instagramHandle} <Icon.Arrow />
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- Programa para barberos ---------- */
export function Barbers() {
  const { t, lang } = useLang();
  const perks = [
    t('Precios de mayorista para tu barbería', 'Wholesale pricing for your barbershop'),
    t('Producto probado en el sillón', 'Chair-tested product'),
    t('Material para vitrina y redes', 'Display and social media assets'),
    t('Presencia en eventos EME', 'Presence at EME events'),
  ];
  return (
    <section className="barbers" id="barberos">
      <div className="container barbers__grid">
        <motion.div
          className="barbers__media"
          initial={{ clipPath: 'inset(0 0 100% 0 round 24px)' }}
          whileInView={{ clipPath: 'inset(0 0 0% 0 round 24px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.3, ease: EASE.premium }}
        >
          <img src="/media/bball-3.webp" alt={t('Barbero aplicando producto EME en la barbería', 'Barber applying EME product in the shop')} loading="lazy" />
          <div className="barbers__float">
            <img src="/media/v-mrfade.webp" alt="" />
            <span>
              <small className="mono">{t('Ya disponible en', 'Now available at')}</small>
              <strong>Mr. Fade Salón</strong>
            </span>
          </div>
        </motion.div>

        <div className="barbers__copy">
          <div className="sec-label">
            <span className="mono">(07)</span>
            <span className="mono">{t('Para barberos', 'For barbers')}</span>
          </div>
          <RevealText key={lang} className="h-xl">
            {t('Lleva EME\na tu *sillón.*', 'Bring EME\nto your *chair.*')}
          </RevealText>
          <FadeUp delay={0.15}>
            <p>
              {t(
                '¿Tienes una barbería? Vende y trabaja con productos hechos por y para barberos. Te damos todo para que tu vitrina venda sola.',
                'Own a barbershop? Sell and work with products made by and for barbers. We give you everything so your display sells itself.',
              )}
            </p>
          </FadeUp>
          <ul className="perks">
            {perks.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: EASE.out }}
              >
                <span className="mono">0{i + 1}</span> {p}
              </motion.li>
            ))}
          </ul>
          <div className="stats">
            <div>
              <strong>
                <Counter to={2025} duration={1.4} />
              </strong>
              <span className="mono">{t('Fundada', 'Founded')}</span>
            </div>
            <div>
              <strong>
                <Counter to={4} />
              </strong>
              <span className="mono">{t('Esenciales', 'Essentials')}</span>
            </div>
            <div>
              <strong>
                <Counter to={100} suffix="%" />
              </strong>
              <span className="mono">{t('Probado en barbería', 'Barber tested')}</span>
            </div>
          </div>
          <Magnetic
            className="btn btn--dark"
            href={whatsappLink(t('¡Hola EME STUDIO! Tengo una barbería y quiero vender sus productos.', 'Hi EME STUDIO! I own a barbershop and want to carry your products.'))}
            target="_blank"
          >
            <Icon.WhatsApp /> {t('Quiero ser distribuidor', 'Become a stockist')}
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
