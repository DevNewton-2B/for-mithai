import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Images, Maximize2, Layers3 } from 'lucide-react';

const placeholder = "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000&auto=format&fit=crop";

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const triggerRef = useRef(null);
  const horizontalRef = useRef(null);
  const cardRefs = useRef([]);

  const galleryItems = [
    { id: 1, image: placeholder, caption: "Pure Radiance" },
    { id: 2, image: placeholder, caption: "Eternal Warmth" },
    { id: 3, image: placeholder, caption: "A Perfect Sparkle" },
    { id: 4, image: placeholder, caption: "Simply Breathtaking" },
    { id: 5, image: placeholder, caption: "My Mithai" },
  ];

  useEffect(() => {
    if (!triggerRef.current || !horizontalRef.current) return;

    const ctx = gsap.context(() => {
      const totalCards = galleryItems.length;
      
      // Calculate exactly how far left the container needs to translate.
      // E.g., for 5 cards, it shifts left by 80% of its total width.
      const xTranslatePercent = -((100 / totalCards) * (totalCards - 1)); 

      const scrollTween = gsap.to(horizontalRef.current, {
        xPercent: xTranslatePercent,
        ease: 'none', 
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true, 
          scrub: 1.5, 
          start: "top top", 
          // Match the scroll distance to the physical pixel width of the track
          end: () => `+=${horizontalRef.current?.offsetWidth || window.innerWidth}`, 
          invalidateOnRefresh: true, 
        }
      });

      cardRefs.current.forEach((card) => {
        if (!card) return;

        const mainFrame = card.querySelector('.main-frame');
        const imgInside = card.querySelector('.gal-image');
        const bgBlur = card.querySelector('.bg-blur-mirror');
        const countBox = card.querySelector('.photo-counter');
        const caption = card.querySelector('.photo-caption');

        gsap.fromTo(mainFrame,
          { filter: 'blur(3px)', scale: 0.85 },
          {
            filter: 'blur(0px)',
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card, 
              containerAnimation: scrollTween, 
              start: "left 70%", 
              end: "left 50%", 
              scrub: true,
            }
          }
        );

        gsap.to(mainFrame, {
          backgroundColor: '#000000',
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: "left 70%",
            end: "left 50%",
            scrub: true,
            toggleActions: "play none none reverse",
          }
        });

        gsap.fromTo(bgBlur,
          { xPercent: 10 },
          {
            xPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left right",
              end: "right left",
              scrub: true,
            }
          }
        );

        gsap.fromTo(imgInside,
          { y: '5%' },
          {
            y: '-5%',
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left right",
              end: "right left",
              scrub: true,
            }
          }
        );

        gsap.fromTo([countBox, caption],
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left 55%", // Pop in closer to center
              toggleActions: "play none none reverse",
            }
          }
        );
      });

    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={triggerRef}
      id="gallery" 
      // Changed to 100dvh to fix mobile URL bar cutoffs
      className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-black"
    >
      <div className="absolute inset-0 z-0 bg-[url('/grain.png')] opacity-[0.03] mix-blend-color-dodge"></div>
      <div className="absolute inset-0 z-10 [background:radial-gradient(100%_100%_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>

      {/* Header aligned correctly to the top */}
      <div className="absolute top-12 md:top-16 left-0 right-0 z-30 flex flex-col items-center text-center px-4 pointer-events-none">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-black/40 backdrop-blur-xl px-6 py-2.5 border border-white/10 shadow-2xl shadow-rose-950/40">
          <Layers3 className="h-4 w-4 text-rose-300" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-white">
            Her Canvas
          </span>
        </div>
      </div>

      <div 
        ref={horizontalRef}
        // Removed pl-[25vw] which was causing the severe alignment bug
        className="relative flex h-full will-change-transform z-20 items-center"
        style={{ width: `${galleryItems.length * 100}vw` }}
      >
        {galleryItems.map((item, index) => (
          <div 
            key={item.id}
            ref={el => cardRefs.current[index] = el}
            // 100vw ensures each slide naturally centers itself
            className="relative flex h-full w-[100vw] items-center justify-center flex-shrink-0 px-4 md:px-0"
          >
            
            {/* Mirror Reflection */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 blur-[60px] pointer-events-none scale-[1.2]">
              <img 
                src={item.image} 
                alt="Mirror reflection" 
                className="bg-blur-mirror h-[80%] w-full object-cover origin-center transform-gpu"
                draggable="false"
              />
            </div>

            {/* THE FIX: Changed from controlling width to controlling HEIGHT.
              h-[65dvh] prevents the frame from ever touching the top/bottom of the screen.
              aspect-[4/5] ensures it maintains the correct width proportionally.
            */}
            <div className="main-frame relative z-10 h-[65dvh] md:h-[75dvh] aspect-[4/5] md:aspect-[3/4] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_-10px_rgba(244,63,94,0.3)] bg-[#0A0A0A] p-2 border border-white/10 transform-gpu transition-colors duration-500">
              <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
                <img 
                  src={item.image} 
                  alt={`Mithai ${item.id}`} 
                  className="gal-image absolute inset-0 h-full w-full object-cover scale-[1.15] origin-center will-change-transform transform-gpu"
                  draggable="false"
                />
                <div className="absolute inset-0 z-10 [background:radial-gradient(110%_110%_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)]"></div>
              </div>
            </div>

            {/* Safely anchored number to the top-left area */}
            <div className="photo-counter absolute top-[15%] left-[5%] md:left-[20%] z-20 flex flex-col items-center pointer-events-none">
              <span className="text-[15vw] md:text-[12vw] font-black leading-none text-rose-300 drop-shadow-2xl select-none mix-blend-screen">
                0{item.id}
              </span>
            </div>

            {/* Safely anchored caption to the bottom area (prevents URL bar cutoff) */}
            <div className="photo-caption absolute bottom-12 md:bottom-24 z-30 flex items-center gap-2 pointer-events-none">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3.5 shadow-2xl">
                <Maximize2 className="h-4 w-4 text-white" />
                <span className="text-sm md:text-base font-bold tracking-widest uppercase text-white drop-shadow-sm">
                  {item.caption}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;