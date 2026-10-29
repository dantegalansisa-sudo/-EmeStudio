import { useEffect, useState } from 'react';

/* Router mínimo por hash: funciona en cualquier hosting estático sin configuración.
   #/                 → inicio
   #/p/clay-wax       → página de producto
   #/checkout         → pago
   #/legal/privacidad → páginas legales */
export type Route =
  | { page: 'home'; section?: string }
  | { page: 'product'; id: string }
  | { page: 'checkout' }
  | { page: 'legal'; doc: string };

function parse(): Route {
  const h = window.location.hash.replace(/^#\/?/, '');
  const [a, b] = h.split('/');
  if (a === 'p' && b) return { page: 'product', id: b };
  if (a === 'checkout') return { page: 'checkout' };
  if (a === 'legal' && b) return { page: 'legal', doc: b };
  return { page: 'home', section: a || undefined };
}

let homeScroll = 0;

export function navigate(path: string) {
  if (parse().page === 'home') homeScroll = window.scrollY;
  window.location.hash = path.startsWith('/') ? path : `/${path}`;
}

export function goHome(section?: string) {
  window.location.hash = section ? `/${section}` : '/';
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(parse);
  useEffect(() => {
    const on = () => {
      const r = parse();
      setRoute(r);
      requestAnimationFrame(() => {
        if (r.page === 'home') {
          if (r.section) document.getElementById(r.section)?.scrollIntoView();
          else window.scrollTo(0, homeScroll);
        } else window.scrollTo(0, 0);
      });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
