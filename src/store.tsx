import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { exists, totals } from './data/catalog';
import { navigate } from './router';

interface Line {
  id: string;
  qty: number;
}

interface Store {
  lines: Line[];
  count: number;
  subtotal: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  /** Abre la página del producto */
  openSheet: (id: string) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  lastAdded: number;
  code: string | null;
  setCode: (c: string | null) => void;
}

const Ctx = createContext<Store | null>(null);

const KEY = 'eme-cart';

function readCart(): Line[] {
  try {
    const raw = localStorage.getItem(KEY);
    // descarta productos de especiales que ya terminaron
    return raw ? (JSON.parse(raw) as Line[]).filter((l) => exists(l.id)) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [lines]);

  const add = useCallback((id: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id, qty }];
    });
    setLastAdded(Date.now());
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);

  const value = useMemo<Store>(
    () => ({
      lines,
      count: lines.reduce((a, l) => a + l.qty, 0),
      subtotal: totals(lines).subtotal,
      add,
      setQty,
      clear: () => setLines([]),
      cartOpen,
      setCartOpen,
      openSheet: (id: string) => {
        setCartOpen(false);
        setMenuOpen(false);
        navigate(`/p/${id}`);
      },
      menuOpen,
      setMenuOpen,
      lastAdded,
      code,
      setCode,
    }),
    [lines, add, setQty, cartOpen, menuOpen, lastAdded, code],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore fuera de StoreProvider');
  return ctx;
}
