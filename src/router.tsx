import { useEffect, useState } from 'react';

/* Router mínimo.
   Rutas reales (las usa Stripe al volver del pago; _redirects las sirve como SPA):
   /gracias?session_id=…  → confirmación de compra
   /carrito               → inicio con la bolsa abierta (pago cancelado)
   Rutas por hash (navegación interna, sin recargar):
   #/                 → inicio
   #/p/clay-wax       → página de producto
   #/legal/privacidad → páginas legales */
export type Route =
  | { page: 'home'; section?: string }
  | { page: 'product'; id: string }
  | { page: 'cart' }
  | { page: 'thanks'; sessionId: string | null }
  | { page: 'legal'; doc: string };

function parse(): Route {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/gracias') return { page: 'thanks', sessionId: new URLSearchParams(window.location.search).get('session_id') };
  if (path === '/carrito') return { page: 'cart' };
  const h = window.location.hash.replace(/^#\/?/, '');
  const [a, b] = h.split('/');
  if (a === 'p' && b) return { page: 'product', id: b };
  if (a === 'checkout') return { page: 'cart' };
  if (a === 'legal' && b) return { page: 'legal', doc: b };
  return { page: 'home', section: a || undefined };
}

let homeScroll = 0;

/** Navega por hash; si estamos en /gracias o /carrito, vuelve primero a la raíz */
function go(hashPath: string) {
  if (window.location.pathname !== '/') {
    window.location.href = `/#${hashPath}`;
    return;
  }
  window.location.hash = hashPath;
}

export function navigate(path: string) {
  if (parse().page === 'home') homeScroll = window.scrollY;
  go(path.startsWith('/') ? path : `/${path}`);
}

export function goHome(section?: string) {
  go(section ? `/${section}` : '/');
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
    window.addEventListener('popstate', on);
    return () => {
      window.removeEventListener('hashchange', on);
      window.removeEventListener('popstate', on);
    };
  }, []);
  return route;
}
