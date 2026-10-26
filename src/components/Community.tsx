import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EVENT, SITE, whatsappLink } from '../data/site';
import { EASE } from '../utils';
import { AutoVideo, Counter, FadeUp, Icon, Magnetic, RevealText } from './ui';

/* ---------- Comunidad: video que se expande con el scroll ---------- */
export function Community() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const inset = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const clip = useTransform([inset, radius], ([i, r]) => `inset(${i}% ${i}% ${i}% ${i}% round ${r}px)`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);

  return (
    <section className="community" ref={ref}>
      <motion.div className="community__media" style={{ clipPath: clip }}>
        <motion.div style={{ scale }} className="community__video">
          <AutoVideo src="/media/v-5k.mp4" poster="/media/v-5k.webp" />
        </motion.div>
        <div className="community__shade" />
      </motion.div>
      <div className="community__content container">
        <span className="mono community__tag">Comunidad EME · 5K de los Barberos</span>
        <RevealText className="community__title">{'Esto apenas\n*comienza.*'}</RevealText>
        <FadeUp delay={0.2}>
          <p>Barberos de toda la isla, una misma pasión. Llevamos EME a donde está la comunidad — y la comunidad nos lleva más lejos.</p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <a className="link-arrow link-arrow--light" href={SITE.instagram} target="_blank" rel="noreferrer">
            Síguenos {SITE.instagramHandle} <Icon.Arrow />
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- Evento: Barber Stage SJBS ---------- */
function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    d: Math.floor(diff / 864e5),
    h: Math.floor((diff / 36e5) % 24),
    m: Math.floor((diff / 6e4) % 60),
    s: Math.floor((diff / 1e3) % 60),
    done: diff === 0,
  };
}

function gcalLink() {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const start = new Date(EVENT.startsAt);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `EME STUDIO · ${EVENT.title} — ${EVENT.stage}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: `${EVENT.venue}, San Juan, PR`,
    details: `${EVENT.show} · ${EVENT.stage}. Gratis con tu boleto del show.`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function Event() {
  const c = useCountdown(EVENT.startsAt);
  const units = [
    ['Días', c.d],
    ['Horas', c.h],
    ['Min', c.m],
    ['Seg', c.s],
  ] as const;

  return (
    <section className="event" id="eventos">
      <div className="event__stripes" aria-hidden />
      <div className="container event__grid">
        <div className="event__copy">
          <div className="sec-label">
            <span className="mono">(06)</span>
            <span className="mono">Próximo evento</span>
          </div>
          <span className="event__live mono">
            <i /> En vivo · {EVENT.stage}
          </span>
          <RevealText className="event__title">{'Contornos\ny peinados\n*modernos.*'}</RevealText>
          <FadeUp delay={0.15}>
            <p className="event__lead">
              EME STUDIO sube al {EVENT.stage} del <strong>{EVENT.show}</strong>. Demostración en vivo de técnica, producto y estilo.
            </p>
          </FadeUp>
          <FadeUp delay={0.25} className="event__facts">
            <span>
              <Icon.Calendar /> {EVENT.dates}
            </span>
            <span>
              <Icon.Clock /> {EVENT.time}
            </span>
            <span>
              <Icon.Pin /> {EVENT.venue}
            </span>
          </FadeUp>
        </div>

        <motion.div
          className="event__card"
          initial={{ opacity: 0, y: 60, rotate: 2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: EASE.out }}
        >
          <span className="mono event__card-k">{c.done ? 'El evento ya comenzó' : 'Faltan'}</span>
          <div className="countdown">
            {units.map(([l, v]) => (
              <div key={l}>
                <motion.strong key={v} initial={{ y: -12, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }}>
                  {String(v).padStart(2, '0')}
                </motion.strong>
                <span className="mono">{l}</span>
              </div>
            ))}
          </div>
          <p className="event__free">Gratis con tu boleto del show</p>
          <div className="event__ctas">
            <Magnetic className="btn btn--light btn--block" href={EVENT.url} target="_blank">
              Conseguir boleto <Icon.Arrow />
            </Magnetic>
            <a className="btn btn--ghost btn--block" href={gcalLink()} target="_blank" rel="noreferrer">
              <Icon.Calendar /> Añadir al calendario
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Programa para barberos ---------- */
export function Barbers() {
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
          <img src="/media/bball-3.webp" alt="Barbero aplicando producto EME en la barbería" loading="lazy" />
          <div className="barbers__float">
            <img src="/media/v-mrfade.webp" alt="" />
            <span>
              <small className="mono">Ya disponible en</small>
              <strong>Mr. Fade Salón</strong>
            </span>
          </div>
        </motion.div>

        <div className="barbers__copy">
          <div className="sec-label">
            <span className="mono">(07)</span>
            <span className="mono">Para barberos</span>
          </div>
          <RevealText className="h-xl">{'Lleva EME\na tu *sillón.*'}</RevealText>
          <FadeUp delay={0.15}>
            <p>¿Tienes una barbería? Vende y trabaja con productos hechos por y para barberos. Te damos todo para que tu vitrina venda sola.</p>
          </FadeUp>
          <ul className="perks">
            {['Precios de mayorista para tu barbería', 'Producto probado en el sillón', 'Material para vitrina y redes', 'Presencia en eventos EME'].map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: EASE.out }}
              >
                <span className="mono">0{i + 1}</span> {t}
              </motion.li>
            ))}
          </ul>
          <div className="stats">
            <div>
              <strong>
                <Counter to={2025} duration={1.4} />
              </strong>
              <span className="mono">Fundada</span>
            </div>
            <div>
              <strong>
                <Counter to={4} />
              </strong>
              <span className="mono">Esenciales</span>
            </div>
            <div>
              <strong>
                <Counter to={100} suffix="%" />
              </strong>
              <span className="mono">Probado en barbería</span>
            </div>
          </div>
          <Magnetic className="btn btn--dark" href={whatsappLink('¡Hola EME STUDIO! Tengo una barbería y quiero vender sus productos.')} target="_blank">
            <Icon.WhatsApp /> Quiero ser distribuidor
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
