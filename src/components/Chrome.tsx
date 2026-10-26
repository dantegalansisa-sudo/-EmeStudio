import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useStore } from '../store';
import { EASE, lockScroll, scrollToId } from '../utils';
import { Icon, Logo } from './ui';
import { PRODUCTS } from '../data/products';
import { SITE, whatsappLink } from '../data/site';

/* ---------- Preloader ---------- */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    lockScroll(true);
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1500);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Temporizador independiente de rAF (pestañas en segundo plano no ejecutan rAF)
    const done = setTimeout(onDone, 1750);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <motion.div
      className="preloader"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 1, ease: EASE.premium }}
    >
      <div className="preloader__mark">
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE.premium }}>
          <Logo />
        </motion.div>
      </div>
      <div className="preloader__foot">
        <span>Eleva tu imagen</span>
        <span className="mono">{String(n).padStart(3, '0')}</span>
      </div>
      <motion.div className="preloader__bar" style={{ scaleX: n / 100 }} />
    </motion.div>
  );
}

/* ---------- Barra de anuncios ---------- */
export function Announcement() {
  const items = [
    `Envío gratis en órdenes de $${SITE.freeShippingThreshold}+`,
    'Probado en la barbería',
    'Nuevo · Curl Cream',
    'Barber Stage · SJ Beauty Show · 8 & 9 Nov',
  ];
  const row = [...items, ...items, ...items];
  return (
    <div className="announce" role="note">
      <div className="announce__track">
        {row.map((t, i) => (
          <span key={i}>
            {t}
            <i aria-hidden>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Header ---------- */
const NAV = [
  { id: 'coleccion', label: 'Tienda' },
  { id: 'rutina', label: 'Rutina' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'barberos', label: 'Barberos' },
];

export function Header() {
  const { count, setCartOpen, menuOpen, setMenuOpen, lastAdded } = useStore();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [bump, setBump] = useState(0);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > 500 && y > prev && !menuOpen);
  });

  useEffect(() => {
    if (lastAdded) setBump((b) => b + 1);
  }, [lastAdded]);

  return (
    <>
      <motion.header
        className={`header ${solid ? 'header--solid' : ''}`}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE.smooth }}
      >
        <button className={`burger ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
          <span />
          <span />
        </button>
        <nav className="header__nav" aria-label="Principal">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => scrollToId(n.id)} className="header__link">
              <span data-text={n.label}>{n.label}</span>
            </button>
          ))}
        </nav>
        <button className="header__logo" onClick={() => (window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }))} aria-label="Inicio">
          <Logo />
        </button>
        <div className="header__right">
          <a className="header__ig" href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <Icon.Insta />
          </a>
          <button className="header__cart" onClick={() => setCartOpen(true)} aria-label={`Carrito, ${count} productos`}>
            <Icon.Bag />
            <AnimatePresence mode="popLayout">
              {count > 0 && (
                <motion.span
                  key={bump}
                  className="header__count"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [1.5, 1], opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE.out }}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>
      <MobileMenu />
    </>
  );
}

function MobileMenu() {
  const { menuOpen, setMenuOpen, openSheet } = useStore();
  useEffect(() => lockScroll(menuOpen), [menuOpen]);
  const go = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => scrollToId(id), 450);
  };
  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          className="menu"
          initial={{ clipPath: 'circle(0% at 32px 32px)' }}
          animate={{ clipPath: 'circle(150% at 32px 32px)' }}
          exit={{ clipPath: 'circle(0% at 32px 32px)' }}
          transition={{ duration: 0.8, ease: EASE.premium }}
        >
          <div className="menu__glow" />
          <ul className="menu__list">
            {NAV.map((n, i) => (
              <li key={n.id}>
                <motion.button
                  onClick={() => go(n.id)}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: EASE.premium }}
                >
                  <span className="mono">0{i + 1}</span>
                  {n.label}
                </motion.button>
              </li>
            ))}
          </ul>
          <motion.div className="menu__products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
            {PRODUCTS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setMenuOpen(false);
                  openSheet(p.id);
                }}
              >
                <img src={p.images[0]} alt="" />
                <span>{p.short}</span>
              </button>
            ))}
          </motion.div>
          <motion.div className="menu__foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
            <a href={SITE.instagram} target="_blank" rel="noreferrer">
              <Icon.Insta /> {SITE.instagramHandle}
            </a>
            <a href={whatsappLink('¡Hola EME STUDIO! Tengo una pregunta.')} target="_blank" rel="noreferrer">
              <Icon.WhatsApp /> WhatsApp
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
