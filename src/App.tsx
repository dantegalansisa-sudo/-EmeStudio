import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StoreProvider, useStore } from './store';
import { LangProvider, useLang } from './i18n';
import { useRoute } from './router';
import { lockScroll, useMedia } from './utils';
import { SEASON } from './data/site';
import { Header, Preloader } from './components/Chrome';
import Hero from './components/Hero';
import MobileHero from './components/MobileHero';
import Specials from './components/Specials';
import Giveaway from './components/Giveaway';
import Manifesto from './components/Manifesto';
import Collection from './components/Collection';
import Spotlight from './components/Spotlight';
import Finder from './components/Finder';
import Results from './components/Results';
import { Barbers, Community } from './components/Community';
import Footer from './components/Footer';
import ProductPage from './components/ProductPage';
import Thanks from './components/Thanks';
import Legal from './components/Legal';
import { BottomBar, CartDrawer } from './components/Overlays';

function Home({ ready }: { ready: boolean }) {
  const mobile = useMedia('(max-width: 899px)');
  return (
    <main id="main" tabIndex={-1}>
      {mobile ? <MobileHero ready={ready} /> : <Hero ready={ready} />}
      <Specials />
      <Manifesto />
      <Collection />
      <Giveaway />
      <Spotlight />
      <Finder />
      <Results />
      <Community />
      <Barbers />
    </main>
  );
}

function SkipLink() {
  const { t } = useLang();
  return (
    <a className="skip" href="#main" onClick={(e) => (e.preventDefault(), document.getElementById('main')?.focus())}>
      {t('Saltar al contenido', 'Skip to content')}
    </a>
  );
}

function Shell() {
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const done = useCallback(() => {
    setLoading(false);
    lockScroll(false);
  }, []);

  const { setCartOpen } = useStore();

  useEffect(() => {
    if (SEASON) document.documentElement.dataset.season = SEASON.id;
  }, []);

  // /carrito (pago cancelado en Stripe): inicio con la bolsa abierta
  useEffect(() => {
    if (route.page === 'cart' && !loading) setCartOpen(true);
  }, [route.page, loading, setCartOpen]);

  return (
    <>
      <SkipLink />
      <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>
      <Header />
      {route.page === 'product' && <ProductPage id={route.id} />}
      {route.page === 'thanks' && <Thanks sessionId={route.sessionId} />}
      {route.page === 'legal' && <Legal doc={route.doc} />}
      {(route.page === 'home' || route.page === 'cart') && <Home ready={!loading} />}
      {route.page !== 'thanks' && <Footer />}
      <CartDrawer />
      <BottomBar />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </LangProvider>
  );
}
