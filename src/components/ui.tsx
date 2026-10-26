import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import { EASE } from '../utils';

/* ---------- Smooth scroll ---------- */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
  return null;
}

/* ---------- Cursor ---------- */
export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 26, stiffness: 260, mass: 0.6 });
  const sy = useSpring(y, { damping: 26, stiffness: 260, mass: 0.6 });
  const [state, setState] = useState<'idle' | 'hover' | 'view'>('idle');
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, input, label');
      if (t?.dataset.cursor) {
        setState('view');
        setLabel(t.dataset.cursor);
      } else if (t) {
        setState('hover');
        setLabel('');
      } else {
        setState('idle');
        setLabel('');
      }
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [x, y]);

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div className={`cursor-ring cursor-ring--${state}`} style={{ x: sx, y: sy }}>
        <span>{label}</span>
      </motion.div>
    </>
  );
}

/* ---------- Reveal text: palabras salen de una máscara ---------- */
interface RevealProps {
  children: string;
  className?: string;
  delay?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  stagger?: number;
  start?: boolean;
}

export function RevealText({ children, className = '', delay = 0, tag: Tag = 'h2', stagger = 0.06, start }: RevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  // Se observa el bloque completo: las palabras están recortadas por su máscara y nunca "intersectan"
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const show = start !== undefined ? start : inView;
  const lines = children.split('\n');
  let idx = 0;
  // *texto* marca palabras en serif itálica; el estado se arrastra entre palabras
  let italic = false;
  return (
    <Tag ref={ref} className={`reveal ${className}`} aria-label={children.replace(/\n/g, ' ').replace(/\*/g, '')}>
      {lines.map((line, li) => (
        <span className="reveal__line" key={li} aria-hidden>
          {line.split(' ').map((raw, wi) => {
            const i = idx++;
            const opens = raw.startsWith('*');
            const closes = raw.endsWith('*');
            if (opens) italic = true;
            const word = raw.replace(/\*/g, '');
            const html = italic ? `<em>${word}</em>` : word;
            if (closes) italic = false;
            return (
              <span className="reveal__mask" key={wi}>
                <motion.span
                  className="reveal__word"
                  initial={{ y: '115%', rotate: 3 }}
                  animate={show ? { y: '0%', rotate: 0 } : { y: '115%', rotate: 3 }}
                  transition={{ duration: 1, delay: delay + i * stagger, ease: EASE.premium }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/* ---------- Fade up genérico ---------- */
export function FadeUp({ children, delay = 0, className = '', style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: EASE.out }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Botón magnético ---------- */
interface MagneticProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  target?: string;
  ariaLabel?: string;
}

export function Magnetic({ children, href, onClick, className = '', strength = 0.3, target, ariaLabel }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });

  const move = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = href ? (
    <a href={href} className={className} target={target} rel={target ? 'noreferrer' : undefined} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </a>
  ) : (
    <button type="button" className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );

  return (
    <div ref={ref} className="magnetic" onMouseMove={move} onMouseLeave={leave}>
      <motion.div style={{ x: sx, y: sy }}>{inner}</motion.div>
    </div>
  );
}

/* ---------- Contador animado ---------- */
export function Counter({ to, suffix = '', prefix = '', duration = 1.6 }: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 4);
      setV(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {v}
      {suffix}
    </span>
  );
}

/* ---------- Video que solo reproduce en pantalla ---------- */
export function AutoVideo({ src, poster, className = '' }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="metadata" />;
}

/* ---------- Logo ---------- */
export function Logo({ className = '', light = true }: { className?: string; light?: boolean }) {
  return <img src="/media/logo.png" alt="EME STUDIO" className={`logo ${light ? 'logo--light' : ''} ${className}`} draggable={false} />;
}

/* ---------- Íconos ---------- */
export const Icon = {
  Arrow: ({ className = '' }: { className?: string }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Bag: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 8h14l-1 12H6L5 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Minus: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  Play: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M3 1.8v8.4c0 .5.5.8.9.5l6.6-4.2a.6.6 0 0 0 0-1L3.9 1.3c-.4-.3-.9 0-.9.5Z" />
    </svg>
  ),
  Insta: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  WhatsApp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Pin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

/* ---------- Medidor de fijación / brillo ---------- */
export function Meter({ label, value, dark = false }: { label: string; value: number; dark?: boolean }) {
  return (
    <div className={`meter ${dark ? 'meter--dark' : ''}`}>
      <span className="meter__label">{label}</span>
      <span className="meter__bars">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.i
            key={i}
            initial={{ scaleY: 0.25, opacity: 0.25 }}
            animate={{ scaleY: 1, opacity: i < value ? 1 : 0.18 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: EASE.out }}
          />
        ))}
      </span>
    </div>
  );
}
