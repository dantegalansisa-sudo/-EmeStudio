import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StoreProvider } from './store';
import { lockScroll, useMedia } from './utils';
import { Header, Preloader } from './components/Chrome';
import Hero from './components/Hero';
import MobileHero from './components/MobileHero';
import Manifesto from './components/Manifesto';
import Specials from './components/Specials';
import Collection from './components/Collection';
import Spotlight from './components/Spotlight';
import Finder from './components/Finder';
import Results from './components/Results';
import { Barbers, Community, Event } from './components/Community';
import Footer from './components/Footer';
import { CartDrawer, FloatingCart, ProductSheet } from './components/Overlays';

export default function App() {
  const [loading, setLoading] = useState(true);
  const mobile = useMedia('(max-width: 899px)');
  const done = useCallback(() => {
    setLoading(false);
    lockScroll(false);
  }, []);

  return (
    <StoreProvider>
      <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>
      <Header />
      <main>
        {mobile ? <MobileHero ready={!loading} /> : <Hero ready={!loading} />}
        <Specials />
        <Manifesto />
        <Collection />
        <Spotlight />
        <Finder />
        <Results />
        <Community />
        <Event />
        <Barbers />
      </main>
      <Footer />
      <ProductSheet />
      <CartDrawer />
      <FloatingCart />
    </StoreProvider>
  );
}
