import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smile, Eye, Wind, Sparkles, Star } from 'lucide-react';

// Replace with her actual photo paths
const placeholderImg = "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1000&auto=format&fit=crop"; 

gsap.registerPlugin(ScrollTrigger);

const AboutHer = () => {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const panelsRef = useRef([]);

  const features = [
    {
      id: 'smile',
      title: "Her Smile",
      giantText: "SMILE",
      icon: Smile,
      badge: "Radiant",
      image: placeholderImg,
      color: "text-rose-500",
      bgColor: "#fff1f2", 
      description: "A curve that sets everything straight. When she smiles, the whole room catches the light. It's not just a physical trait; it's an absolute event that shifts the entire mood of the day.",
    },
    {
      id: 'eyes',
      title: "Her Eyes",
      giantText: "EYES",
      icon: Eye,
      badge: "Deep",
      image: placeholderImg, 
      color: "text-pink-500",
      bgColor: "#fdf2f8", 
      description: "Deep enough to get lost in. They hold an entire universe of unspoken words, quiet warmth, and a sparkle that outshines the stars. Looking into them feels like coming home.",
    },
    {
      id: 'hair',
      title: "Her Hair",
      giantText: "HAIR",
      icon: Wind,
      badge: "Silken",
      image: placeholderImg, 
      color: "text-fuchsia-500",
      bgColor: "#fdf4ff", 
      description: "Like midnight silk. Falling perfectly, framing a face that I could never get tired of looking at. Every time the wind catches it, it’s like poetry in motion.",
    },
    {
      id: 'presence',
      title: "Her Aura",
      giantText: "AURA",
      icon: Sparkles,
      badge: "Magical",
      image: placeholderImg, 
      color: "text-rose-400",
      bgColor: "#fff5f5", 
      description: "She doesn't just enter a room; she changes the atmosphere. A quiet kind of magic that makes everything feel a little bit better, a little bit brighter, just because she is there.",
    }
  ];

  useEffect(() => {
    // SAFETY CHECK: Ensure DOM is fully painted
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      
      // 1. Smooth Background Color Transitions
      panelsRef.current.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => gsap.to(sectionRef.current, { backgroundColor: features[i].bgColor, duration: 1.2, ease: 'power2.out' }),
          onEnterBack: () => gsap.to(sectionRef.current, { backgroundColor: features[i].bgColor, duration: 1.2, ease: 'power2.out' }),
        });
      });

      // 2. Cinematic Image Reveal & Parallax
      panelsRef.current.forEach((panel) => {
        if (!panel) return;

        const giantText = panel.querySelector('.giant-bg-text');
        const imgContainer = panel.querySelector('.img-mask');
        const imgInside = panel.querySelector('.parallax-img');
        const contentBox = panel.querySelector('.content-box');
        const badge = panel.querySelector('.floating-badge');

        gsap.to(giantText, {
          y: -200,
          scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          }
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 70%",
            toggleActions: "play none none reverse",
          }
        });

        tl.fromTo(imgContainer, 
          { clipPath: 'inset(100% 0% 0% 0%)' }, 
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut' }
        );

        tl.fromTo(contentBox, 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
          "-=1"
        );

        tl.fromTo(badge,
          { scale: 0, rotation: -15 },
          { scale: 1, rotation: 12, duration: 0.8, ease: 'back.out(2)' },
          "-=0.5"
        );

        gsap.fromTo(imgInside, 
          { yPercent: -15, scale: 1.1 }, 
          { 
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: imgContainer,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef}>
      <section 
        ref={sectionRef}
        id="about-her" 
        className="relative flex w-full flex-col items-center overflow-hidden transition-colors duration-1000 ease-in-out"
        style={{ backgroundColor: features[0].bgColor }}
      >
        
        <div className="relative z-20 w-full max-w-7xl px-4 pt-32 pb-24 text-center md:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/50 px-4 py-1.5 backdrop-blur-sm mb-4">
            <Star className="h-4 w-4 text-rose-400 fill-rose-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
              A Closer Look
            </span>
          </div>
          <h3 className="text-5xl font-black tracking-tighter text-slate-900 md:text-7xl lg:text-8xl">
            Everything About Her.
          </h3>
        </div>

        <div className="relative z-10 w-full max-w-7xl px-4 md:px-8 pb-32">
          {features.map((feature, index) => {
            const isEven = index % 2 !== 0;

            return (
              <div 
                key={feature.id}
                ref={el => panelsRef.current[index] = el}
                className={`relative flex min-h-[80vh] w-full flex-col items-center py-16 md:py-24 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}
              >
                
                <div className="giant-bg-text absolute left-0 right-0 top-1/4 z-0 flex justify-center text-center select-none pointer-events-none">
                  <span className="text-[28vw] md:text-[22vw] font-black leading-none text-slate-900 opacity-[0.02] mix-blend-multiply drop-shadow-sm">
                    {feature.giantText}
                  </span>
                </div>

                <div className="relative z-10 w-full md:w-1/2 flex justify-center">
                  <div className="img-mask relative h-[60vh] md:h-[70vh] w-full max-w-[400px] md:max-w-[500px] overflow-hidden rounded-[2rem] shadow-2xl shadow-rose-200/50">
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="parallax-img absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <div className={`floating-badge absolute -right-4 top-10 md:-right-8 md:top-20 z-30 rotate-12 rounded-2xl bg-white px-6 py-3 shadow-xl ${isEven ? 'md:left-auto md:-right-8' : 'md:right-auto md:-left-8'}`}>
                    <span className={`text-lg font-black tracking-wider uppercase ${feature.color}`}>
                      {feature.badge}
                    </span>
                  </div>
                </div>

                <div className={`relative z-20 mt-[-10%] w-full max-w-xl md:mt-0 md:w-1/2 ${isEven ? 'md:-mr-16 lg:-mr-24' : 'md:-ml-16 lg:-ml-24'}`}>
                  <div className="content-box flex flex-col items-center text-center md:items-start md:text-left bg-white/70 backdrop-blur-2xl border border-white p-8 md:p-12 lg:p-16 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(244,63,94,0.15)]">
                    
                    <div className={`mb-6 inline-flex rounded-2xl bg-white p-4 shadow-sm border border-rose-50 ${feature.color}`}>
                      <feature.icon className="h-8 w-8 md:h-10 md:w-10" />
                    </div>

                    <div className="overflow-hidden pb-2 w-full">
                      <h4 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                        {feature.title}
                      </h4>
                    </div>

                    <p className="mt-6 text-lg font-medium leading-relaxed text-slate-600 md:text-xl">
                      {feature.description}
                    </p>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>
    </div>
  );
};

export default AboutHer;