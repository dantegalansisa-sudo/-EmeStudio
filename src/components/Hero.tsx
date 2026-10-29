import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EASE, scrollToId } from '../utils';
import { Icon, Magnetic, RevealText, Snow } from './ui';
import { useLang } from '../i18n';
import { SEASON } from '../data/site';
import { useStore } from '../store';
import { FEATURED_PROMO, byId, promoProduct, savings } from '../data/catalog';
import type { CSSProperties } from 'react';
import { money } from '../data/site';

/* Partículas de "polvo" — evocan el Volume Powder en el aire */
function Dust() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0,
      h = 0,
      raf = 0,
      mx = 0,
      my = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const count = window.innerWidth < 768 ? 70 : 140;
    const parts = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.3,
      s: Math.random() * 0.00035 + 0.00008,
      d: Math.random() * Math.PI * 2,
      a: Math.random() * 0.55 + 0.15,
      z: Math.random() * 0.8 + 0.2,
    }));
    const size = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    size();
    window.addEventListener('resize', size);
    window.addEventListener('pointermove', onMove);
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        if (!reduce) {
          p.y -= p.s * p.z;
          p.x += Math.sin((p.d += 0.004)) * 0.00025 + p.s * 0.6;
          if (p.y < -0.02) p.y = 1.02;
          if (p.x > 1.02) p.x = -0.02;
        }
        const px = p.x * w + mx * 18 * p.z;
        const py = p.y * h + my * 12 * p.z;
        ctx.beginPath();
        ctx.fillStyle = `rgba(226,234,255,${p.a})`;
        ctx.arc(px, py, p.r * p.z, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', size);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);
  return <canvas ref={ref} className="hero__dust" aria-hidden />;
}

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { add, openSheet } = useStore();
  const { t, l } = useLang();
  const powder = byId('volume-powder');
  const promo = FEATURED_PROMO;
  const promoP = promo ? promoProduct(promo) : null;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.28]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section className="hero" ref={ref} id="inicio">
      <motion.div
        className="hero__media"
        initial={{ clipPath: 'inset(14% 10% 14% 10% round 28px)' }}
        animate={ready ? { clipPath: 'inset(0% 0% 0% 0% round 0px)' } : undefined}
        transition={{ duration: 1.5, ease: EASE.premium }}
      >
        <motion.img src="/media/powder-spray.webp" alt="Volume Powder de EME STUDIO en acción" style={{ scale, y: imgY }} />
        <div className="hero__shade" />
        {SEASON?.snow ? <Snow density={1.3} /> : <Dust />}
      </motion.div>

      <motion.div className="hero__content" style={{ y: contentY, opacity: fade }}>
        <motion.p
          className="hero__eyebrow mono"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <span className="dot" /> EME STUDIO® · Puerto Rico · Est. 2025
        </motion.p>

        <RevealText tag="h1" className="hero__title" start={ready} delay={0.45} stagger={0.08}>
          {t('Eleva\ntu imagen.', 'Elevate\nyour image.')}
        </RevealText>

        <div className="hero__bottom">
          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1.05, duration: 0.9, ease: EASE.out }}
          >
            {t('Productos de styling creados en el sillón. Volumen, textura y rizo definido —', 'Styling products born in the barber chair. Volume, texture and defined curls —')}{' '}
            <em className="serif">{t('sin complicarte.', 'no fuss.')}</em>
          </motion.p>
          <motion.div
            className="hero__ctas"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1.2, duration: 0.9, ease: EASE.out }}
          >
            <Magnetic className="btn btn--light" onClick={() => scrollToId('coleccion')}>
              {t('Comprar ahora', 'Shop now')} <Icon.Arrow />
            </Magnetic>
            <Magnetic className="btn btn--ghost" onClick={() => scrollToId('resultados')}>
              <span className="btn__play">
                <Icon.Play />
              </span>
              {t('Ver en acción', 'See it in action')}
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* Especial activo de la temporada (viene del panel); si no hay, el producto estrella */}
      {promo && promoP ? (
        <motion.button
          className="hero__promo"
          style={{ '--p-bg': promo.theme.bg, '--p-fg': promo.theme.fg, '--p-accent': promo.theme.accent, '--p-accent-fg': promo.theme.accentFg } as CSSProperties}
          onClick={() => scrollToId('especiales')}
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ delay: 1.4, duration: 0.9, ease: EASE.out }}
        >
          <img src={promo.image} alt="" />
          <span>
            <small className="mono">
              {l(promo.badge)} · -{savings(promoP)}%
            </small>
            <strong>{l(promo.name)}</strong>
            <em>
              {money(promoP.price)}
              <s>{money(promoP.compareAt!)}</s>
            </em>
          </span>
          <i className="hero__promo-go">
            <Icon.Arrow />
          </i>
        </motion.button>
      ) : (
        <motion.div
          className="hero__chip"
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ delay: 1.4, duration: 0.9, ease: EASE.out }}
        >
          <button className="hero__chip-main" onClick={() => openSheet(powder.id)}>
            <img src={powder.cutout ?? powder.studio} alt="" />
            <span>
              <small className="mono">Bestseller</small>
              <strong>{powder.name}</strong>
              <em>{money(powder.price)}</em>
            </span>
          </button>
          <button className="hero__chip-add" onClick={() => add(powder.id)} aria-label={t('Añadir Volume Powder a la bolsa', 'Add Volume Powder to bag')}>
            <Icon.Plus />
          </button>
        </motion.div>
      )}

      {/* Sello giratorio */}
      <motion.div
        className={`hero__seal ${promo ? 'hero__seal--promo' : ''}`}
        initial={{ opacity: 0, rotate: -40 }}
        animate={ready ? { opacity: 1, rotate: 0 } : undefined}
        transition={{ delay: 1.3, duration: 1.2, ease: EASE.out }}
        aria-hidden
      >
        <svg viewBox="0 0 120 120">
          <defs>
            <path id="seal" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <text>
            <textPath href="#seal">{t('PROBADO EN LA BARBERÍA • HECHO PARA DESTACAR • ', 'BARBER TESTED • MADE TO STAND OUT • ')}</textPath>
          </text>
        </svg>
        <span>E</span>
      </motion.div>

      <motion.div className="hero__scroll mono" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ delay: 1.8 }}>
        <span>Scroll</span>
        <i />
      </motion.div>
    </section>
  );
}
