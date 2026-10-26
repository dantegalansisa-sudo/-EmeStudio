import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { byId, type Product } from './data/products';

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
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  sheet: Product | null;
  openSheet: (id: string) => void;
  closeSheet: () => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  lastAdded: number;
}

const Ctx = createContext<Store | null>(null);

const KEY = 'eme-cart';

function readCart(): Line[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Line[]) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [sheet, setSheet] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);

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

  const value = useMemo<Store>(() => {
    const count = lines.reduce((a, l) => a + l.qty, 0);
    const subtotal = lines.reduce((a, l) => a + byId(l.id).price * l.qty, 0);
    return {
      lines,
      count,
      subtotal,
      add,
      setQty,
      cartOpen,
      setCartOpen,
      sheet,
      openSheet: (id: string) => setSheet(byId(id)),
      closeSheet: () => setSheet(null),
      menuOpen,
      setMenuOpen,
      lastAdded,
    };
  }, [lines, add, setQty, cartOpen, sheet, menuOpen, lastAdded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore fuera de StoreProvider');
  return ctx;
}
