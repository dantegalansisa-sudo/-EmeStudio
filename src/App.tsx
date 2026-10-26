import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StoreProvider } from './store';
import { lockScroll } from './utils';
import { CustomCursor, SmoothScroll } from './components/ui';
import { Header, Preloader } from './components/Chrome';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Collection from './components/Collection';
import Spotlight from './components/Spotlight';
import Finder from './components/Finder';
import Results from './components/Results';
import { Barbers, Community, Event } from './components/Community';
import Footer from './components/Footer';
import { CartDrawer, FloatingCart, ProductSheet } from './components/Overlays';

export default function App() {
  const [loading, setLoading] = useState(true);
  const done = useCallback(() => {
    setLoading(false);
    lockScroll(false);
  }, []);

  return (
    <StoreProvider>
      <SmoothScroll />
      <CustomCursor />
      <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>
      <div className="grain" aria-hidden />
      <Header />
      <main>
        <Hero ready={!loading} />
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
