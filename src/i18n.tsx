import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'es' | 'en';
/** Texto bilingüe. En el panel de administración serán dos campos por texto. */
export type L = { es: string; en: string };

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** t('Hola', 'Hello') */
  t: (es: string, en: string) => string;
  /** l({ es, en }) */
  l: (x: L) => string;
}

const Ctx = createContext<LangCtx | null>(null);
const KEY = 'eme-lang';

function initial(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    /* sin almacenamiento */
  }
  // Puerto Rico: español por defecto; el cliente cambia a inglés con el botón ES/EN
  return 'es';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* sin almacenamiento */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const value = useMemo<LangCtx>(
    () => ({
      lang,
      setLang,
      t: (es, en) => (lang === 'es' ? es : en),
      l: (x) => x[lang],
    }),
    [lang, setLang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang fuera de LangProvider');
  return ctx;
}

export function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang ${className}`} role="group" aria-label="Idioma / Language">
      {(['es', 'en'] as const).map((l) => (
        <button key={l} className={lang === l ? 'is-active' : ''} onClick={() => setLang(l)} aria-pressed={lang === l}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
