import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { SEASON } from '../data/site';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { EASE } from '../utils';

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
  Home: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  Grid: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  Gift: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="8.5" width="17" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 12.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7.5M12 8.5V21M12 8.5S10.5 4 8 4.5 6.5 8.5 12 8.5ZM12 8.5S13.5 4 16 4.5s1.5 4-4 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  Truck: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 6.5h11v10H3zM14 10h4l3 3.5v3h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9 12 2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Back: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Chevron: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
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
            animate={{ scaleY: 1, opacity: i < Math.floor(value) ? 1 : i < value ? 0.5 : 0.18 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: EASE.out }}
          />
        ))}
      </span>
    </div>
  );
}

/* ---------- Nieve navideña (canvas ligero, se pausa fuera de pantalla) ---------- */
export function Snow({ density = 1, className = '' }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!SEASON?.snow) return;
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mobile = window.innerWidth < 768;
    let w = 0,
      h = 0,
      raf = 0,
      visible = true;
    const n = Math.round((mobile ? 45 : 90) * density);
    const flakes = Array.from({ length: n }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.2 + 0.6,
      v: Math.random() * 0.0011 + 0.0005,
      d: Math.random() * Math.PI * 2,
      a: Math.random() * 0.5 + 0.35,
    }));
    const size = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.v * (1 + f.r * 0.3);
        f.d += 0.01;
        f.x += Math.sin(f.d) * 0.0006;
        if (f.y > 1.02) {
          f.y = -0.02;
          f.x = Math.random();
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${f.a})`;
        ctx.arc(f.x * w, f.y * h, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [density]);
  if (!SEASON?.snow) return null;
  return <canvas ref={ref} className={`snow ${className}`} aria-hidden />;
}

/* ---------- Guirnalda de luces navideñas ---------- */
export function Garland({ count = 18 }: { count?: number }) {
  if (!SEASON) return null;
  return (
    <div className="garland" aria-hidden>
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none">
        <path d="M0 8 Q 50 34 100 8 T 200 8 T 300 8 T 400 8 T 500 8 T 600 8 T 700 8 T 800 8 T 900 8 T 1000 8" />
      </svg>
      {Array.from({ length: count }, (_, i) => (
        <i key={i} style={{ left: `${(i + 0.5) * (100 / count)}%`, animationDelay: `${(i % 4) * 0.35}s` }} className={`bulb bulb--${i % 3}`} />
      ))}
    </div>
  );
}

/* ---------- Estrellas (escala del cliente, admite medias) ---------- */
export function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} / 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} className={value >= i + 1 ? 'is-full' : value > i ? 'is-half' : ''} />
      ))}
    </span>
  );
}
