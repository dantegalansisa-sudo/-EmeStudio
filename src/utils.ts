import { useEffect, useState } from 'react';
import type Lenis from 'lenis';

export const EASE = {
  premium: [0.76, 0, 0.24, 1],
  smooth: [0.25, 0.8, 0.25, 1],
  out: [0.16, 1, 0.3, 1],
  cinematic: [0.86, 0, 0.07, 1],
} as const;

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -60, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export function lockScroll(lock: boolean) {
  if (window.__lenis) {
    if (lock) window.__lenis.stop();
    else window.__lenis.start();
  }
  document.documentElement.classList.toggle('is-locked', lock);
}

export function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}
