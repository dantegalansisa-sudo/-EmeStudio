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
      const p = Math.min(1, (t - t0) / 1000);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Temporizador independiente de rAF (pestañas en segundo plano no ejecutan rAF)
    const done = setTimeout(onDone, 1150);
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

/* ---------- Header ---------- */
const NAV = [
  { id: 'coleccion', label: 'Tienda' },
  { id: 'rutina', label: 'Rutina' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'barberos', label: 'Barberos' },
];

const LEFT = NAV.slice(0, 3);
const RIGHT = NAV.slice(3);

/* Sección visible ahora mismo, para marcar el link activo */
function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
          else setActive((cur) => (cur === e.target.id ? '' : cur));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function NavLinks({ items, offset, active }: { items: typeof NAV; offset: number; active: string }) {
  return (
    <nav className="header__nav" aria-label="Principal">
      {items.map((n, i) => (
        <button key={n.id} onClick={() => scrollToId(n.id)} className={`header__link ${active === n.id ? 'is-active' : ''}`}>
          {active === n.id && <motion.span layoutId="nav-pill" className="header__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
          <sup className="mono">0{offset + i + 1}</sup>
          <span className="roll">
            <span data-text={n.label}>{n.label}</span>
          </span>
        </button>
      ))}
    </nav>
  );
}

export function Header() {
  const active = useActiveSection();
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
        <div className="header__left">
          <button className={`burger ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
            <span />
            <span />
          </button>
          <NavLinks items={LEFT} offset={0} active={active} />
        </div>
        <button className="header__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Inicio">
          <Logo />
        </button>
        <div className="header__right">
          <NavLinks items={RIGHT} offset={LEFT.length} active={active} />
          <span className="header__sep" aria-hidden />
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
