import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Heart, Sparkles, Star } from 'lucide-react';

// Import the toon images
import img1 from '../assets/heroimg/img1.png';
import img2 from '../assets/heroimg/img2.png';
import img3 from '../assets/heroimg/img3.png';
import img4 from '../assets/heroimg/img4.png';

const Hero = () => {
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);
  const decorRef = useRef([]);

  // STRATEGY: 
  // - Top images are pushed down (top-28 / top-[15%]) to clear the navbar completely.
  // - Sizes are massively increased for mobile (up to w-40 or w-[45vw]) so they frame the screen.
  // - We use negative margins on some to make them playfully peek into the screen.
  const corners = [
    { 
      src: img1, 
      alt: "Moyuri 1", 
      pos: "top-28 -left-4 md:top-[15%] md:left-[5%]", 
      size: "w-[45vw] md:w-[22vw] max-w-[280px]" 
    },
    { 
      src: img2, 
      alt: "Mithai 2", 
      pos: "top-32 -right-4 md:top-[12%] md:right-[5%]", 
      size: "w-[40vw] md:w-[20vw] max-w-[250px]" 
    },
    { 
      src: img3, 
      alt: "Priyanshi 3", 
      pos: "bottom-16 left-2 md:bottom-[10%] md:left-[5%]", 
      size: "w-[38vw] md:w-[22vw] max-w-[260px]" 
    },
    { 
      src: img4, 
      alt: "Cutie 4", 
      pos: "bottom-10 -right-2 md:bottom-[12%] md:right-[5%]", 
      size: "w-[45vw] md:w-[24vw] max-w-[300px]" 
    },
  ];

  // Floating decorative icons to add magic to the empty spaces
  const decorations = [
    { Icon: Star, pos: "top-1/4 left-1/4", color: "text-pink-300" },
    { Icon: Heart, pos: "top-1/3 right-1/4", color: "text-rose-300" },
    { Icon: Sparkles, pos: "bottom-1/3 left-1/3", color: "text-pink-400" },
    { Icon: Star, pos: "bottom-1/4 right-1/3", color: "text-rose-200" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Ensure images start hidden and scaled down
      gsap.set(imagesRef.current, { scale: 0, opacity: 0 });
      gsap.set('.char-wrap', { y: '110%', opacity: 0 });

      // 1. Cinematic Text Reveal
      tl.to('.char-wrap', { 
        y: '0%', 
        opacity: 1, 
        duration: 1, 
        stagger: 0.05, 
        ease: 'power4.out', 
        delay: 0.2 
      });

      // 2. Subtitle pops in
      tl.fromTo('.subtitle-pill',
        { y: 30, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
        "-=0.5"
      );

      // 3. Images bounce in dramatically
      imagesRef.current.forEach((img, i) => {
        tl.to(img, {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'elastic.out(1, 0.6)',
        }, i === 0 ? "-=0.2" : "-=1.3"); 
      });

      // 4. Decorations pop in
      decorRef.current.forEach((dec, i) => {
        gsap.fromTo(dec,
          { scale: 0, opacity: 0, rotation: -90 },
          { scale: 1, opacity: 0.6, rotation: 0, duration: 1, ease: 'back.out(2)' }
        );
      });

      // --- INFINITE AMBIENT ANIMATIONS ---

      // Background glowing blobs moving slowly
      gsap.to('.bg-blob-1', { x: 100, y: 50, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.bg-blob-2', { x: -80, y: -60, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });

      // Images breathing (floating gently)
      imagesRef.current.forEach((img, i) => {
        gsap.to(img, {
          y: i % 2 === 0 ? 15 : -15, // Alternating directions
          rotation: i % 2 === 0 ? 2 : -2, // Slight tilt while floating
          duration: 3 + (i * 0.5), 
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      // Decorations floating and spinning slowly
      decorRef.current.forEach((dec) => {
        gsap.to(dec, {
          y: -20,
          rotation: 15,
          duration: "random(2, 4)",
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-rose-50 selection:bg-rose-200 selection:text-rose-900"
    >
      {/* RICH BACKGROUND
        These are large, blurred color circles that create a soft, magical depth 
        behind everything without interfering with readability.
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="bg-blob-1 absolute -top-[10%] -left-[10%] h-[50vw] w-[50vw] max-h-[500px] max-w-[500px] rounded-full bg-pink-200/50 blur-[80px] mix-blend-multiply"></div>
        <div className="bg-blob-2 absolute top-[20%] -right-[10%] h-[60vw] w-[60vw] max-h-[600px] max-w-[600px] rounded-full bg-rose-200/40 blur-[100px] mix-blend-multiply"></div>
        <div className="absolute -bottom-[20%] left-[20%] h-[40vw] w-[40vw] max-h-[400px] max-w-[400px] rounded-full bg-pink-100/60 blur-[60px]"></div>
      </div>

      {/* FLOATING DECORATIONS */}
      {decorations.map((decor, index) => (
        <div 
          key={`decor-${index}`}
          ref={el => decorRef.current[index] = el}
          className={`absolute z-0 ${decor.pos}`}
        >
          <decor.Icon className={`h-6 w-6 md:h-10 md:w-10 ${decor.color} fill-current`} />
        </div>
      ))}

      {/* THE 4 IMAGES
        Properly sized and distanced from the top navbar and center text.
      */}
      {corners.map((corner, index) => (
        <div 
          key={`img-${index}`}
          ref={el => imagesRef.current[index] = el}
          className={`absolute z-20 ${corner.pos} ${corner.size} will-change-transform`}
        >
          <img 
            src={corner.src} 
            alt={corner.alt} 
            className="h-auto w-full object-contain filter drop-shadow-[0_20px_30px_rgba(244,63,94,0.3)]"
            draggable="false"
          />
        </div>
      ))}

      {/* CENTRAL CONTENT */}
      <div className="relative z-30 flex flex-col items-center justify-center px-4 pointer-events-none">
        
        {/* Name */}
        <div className="flex overflow-hidden pb-2 md:pb-4">
          {"Priyanshi".split('').map((char, index) => (
            <span 
              key={index}
              className="char-wrap inline-block text-[16vw] md:text-[11vw] font-black leading-none tracking-tighter text-slate-900 drop-shadow-md"
            >
              {char}
            </span>
          ))}
        </div>

        {/* Subtitle Pill */}
        <div className="subtitle-pill mt-4 flex items-center gap-3 rounded-full bg-white/80 backdrop-blur-md border border-rose-200 px-6 py-3 shadow-lg shadow-rose-100/50">
          <Heart className="h-5 w-5 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-rose-600 md:text-base">
            Moyuri • Mithai
          </span>
          <Heart className="h-5 w-5 text-rose-500 fill-rose-500 animate-pulse" />
        </div>

      </div>
    </section>
  );
};

export default Hero;