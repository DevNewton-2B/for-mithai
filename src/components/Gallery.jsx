import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Images, Sparkles } from 'lucide-react';

// IMPORTANT: Replace with actual paths to her images
const placeholder1 = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop";
const placeholder2 = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop";

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const triggerRef = useRef(null);
  const horizontalRef = useRef(null);
  const cardRefs = useRef([]);

  // Purely image-focused array. You can mix portrait and landscape aspects.
  const galleryItems = [
    { id: 1, image: placeholder1, caption: "Radiance" },
    { id: 2, image: placeholder2, caption: "Elegance" },
    { id: 3, image: placeholder1, caption: "Perfection" },
    { id: 4, image: placeholder2, caption: "That Smile" },
    { id: 5, image: placeholder1, caption: "My Mithai" },
  ];

  useEffect(() => {
    if (!triggerRef.current || !horizontalRef.current) return;

    const ctx = gsap.context(() => {
      const totalCards = galleryItems.length;
      // Calculate how far left the container needs to move to show the last slide
      const xTranslatePercent = -((100 / totalCards) * (totalCards - 1)); 

      // 1. PIN & HORIZONTAL SCROLL
      const scrollTween = gsap.to(horizontalRef.current, {
        xPercent: xTranslatePercent,
        ease: 'none', 
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true, 
          scrub: 1.5, 
          start: "top top", 
          end: () => `+=${horizontalRef.current?.offsetWidth || window.innerWidth}`, 
          invalidateOnRefresh: true, 
        }
      });

      // 2. PARALLAX FOR EACH PHOTO
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const imgWrapper = card.querySelector('.img-wrapper');
        const img = card.querySelector('.gal-image');
        const bgNumber = card.querySelector('.bg-number');
        const caption = card.querySelector('.photo-caption');

        // Frame scales and fades in as it centers
        gsap.fromTo(imgWrapper,
          { scale: 0.8, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card, 
              containerAnimation: scrollTween, 
              start: "left 80%", 
              end: "left 40%", 
              scrub: true,
            }
          }
        );

        // Internal Image Parallax (The photo slides inside its frame)
        gsap.to(img, {
          xPercent: 20, // Moves right as you scroll left
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween, 
            start: "left right",
            end: "right left",
            scrub: true,
          }
        });

        // Background Number Parallax (Moves slightly faster)
        gsap.to(bgNumber, {
          x: 100, 
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween, 
            start: "left right",
            end: "right left",
            scrub: true,
          }
        });

        // Caption pops up when image is centered
        gsap.fromTo(caption,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left 55%",
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
      className="relative w-full h-[100vh] overflow-hidden bg-white"
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/4 h-[50vh] w-[50vw] rounded-full bg-rose-50/50 blur-[100px] pointer-events-none"></div>

      {/* Header (Stays pinned while photos scroll) */}
      <div className="absolute top-12 md:top-24 left-0 right-0 z-20 flex flex-col items-center text-center px-4 pointer-events-none">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-5 py-2 border border-rose-100 shadow-sm mb-3">
          <Images className="h-4 w-4 text-rose-400" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-rose-500">
            Her Canvas
          </span>
        </div>
      </div>

      {/* HORIZONTAL SCROLL CONTAINER */}
      <div 
        ref={horizontalRef}
        className="relative flex h-full will-change-transform z-10 items-center"
        style={{ width: `${galleryItems.length * 100}vw` }}
      >
        {galleryItems.map((item, index) => {
          // Alternate positioning: even indexes slightly higher, odd slightly lower
          const isEven = index % 2 === 0;

          return (
            <div 
              key={item.id}
              ref={el => cardRefs.current[index] = el}
              className="relative flex h-full w-[100vw] items-center justify-center flex-shrink-0 px-4 md:px-0"
            >
              
              {/* Massive Background Number */}
              <div className="bg-number absolute z-0 text-[35vw] md:text-[25vw] font-black leading-none text-slate-50 select-none pointer-events-none tracking-tighter">
                0{item.id}
              </div>

              {/* Photo Frame Wrapper */}
              <div className={`img-wrapper relative z-10 w-full max-w-[85vw] md:max-w-[450px] lg:max-w-[550px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-rose-200/50 bg-white p-2 md:p-4 transform-gpu ${isEven ? 'mb-12 md:mb-24' : 'mt-12 md:mt-24'}`}>
                
                {/* The actual image container (crops the scaled image) */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  {/* The Image (Scaled up to allow for parallax movement) */}
                  <img 
                    src={item.image} 
                    alt={`Mithai ${item.id}`} 
                    className="gal-image absolute inset-0 h-full w-full object-cover scale-[1.3] origin-left will-change-transform"
                    draggable="false"
                  />
                  
                  {/* Dark gradient at bottom just for the caption visibility */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Minimal Elegant Caption */}
                <div className="photo-caption absolute bottom-8 left-0 right-0 flex justify-center z-20">
                  <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40 px-6 py-2 shadow-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                    <span className="text-sm font-bold tracking-widest uppercase text-white">
                      {item.caption}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};

export default Gallery;