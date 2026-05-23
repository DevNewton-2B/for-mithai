import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutHer from './components/AboutHer';
import Gallery from './components/Gallery';

const App = () => {
  useEffect(() => {
    // Lenis setup for smooth scroll across the entire application
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-pink-50 font-sans text-slate-800 antialiased selection:bg-rose-200 selection:text-rose-900">
      
      <Navbar />
      
      <Hero />
      
      <AboutHer />

      <Gallery />

      {/* Final placeholder block for the final section (Footer/Message) */}
      <section 
        id="for-mithai" 
        className="flex min-h-[50vh] items-center justify-center bg-white"
      >
        <h2 className="text-2xl font-bold text-rose-300">A Final Message coming soon...</h2>
      </section>

    </main>
  );
};

export default App;