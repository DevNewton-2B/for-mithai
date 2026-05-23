import React, { useState, useEffect, useRef } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import gsap from 'gsap';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const linksRef = useRef([]);
  const heartRef = useRef(null);

  const navItems = ['About Her', 'Gallery', 'Memories', 'For Mithai'];

  useEffect(() => {
    // 1. Initial Navbar Drop-in Animation
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.7)', delay: 0.5 }
    );

    // 2. Beating Heart Animation
    gsap.to(heartRef.current, {
      scale: 1.2,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }, []);

  useEffect(() => {
    // 3. Mobile Menu Overlay Animation
    if (isOpen) {
      gsap.to(menuRef.current, { 
        clipPath: 'circle(150% at 90% 10%)', 
        duration: 0.8, 
        ease: 'power3.inOut' 
      });
      
      gsap.fromTo(linksRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
      );
    } else {
      gsap.to(menuRef.current, { 
        clipPath: 'circle(0% at 90% 10%)', 
        duration: 0.6, 
        ease: 'power3.inOut' 
      });
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Pill Navbar */}
      <nav 
        ref={navRef} 
        className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-4 lg:px-0"
      >
        <div className="flex items-center justify-between rounded-full bg-white/60 px-6 py-3 shadow-lg shadow-pink-100/50 backdrop-blur-md border border-white/40">
          
          {/* Logo / Name */}
          <div className="flex items-center gap-2">
            <Heart ref={heartRef} className="h-5 w-5 text-rose-500 fill-rose-500" />
            <span className="text-xl font-bold tracking-wider text-slate-800">
              Mithai
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-rose-500"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="block md:hidden text-slate-800 focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Full Screen Mobile Menu (Glassmorphism Overlay) */}
      <div 
        ref={menuRef}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-rose-50/95 backdrop-blur-xl"
        style={{ clipPath: 'circle(0% at 90% 10%)' }}
      >
        <ul className="flex flex-col items-center gap-8">
          {navItems.map((item, index) => (
            <li 
              key={index}
              ref={el => linksRef.current[index] = el}
            >
              <a 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                onClick={toggleMenu}
                className="text-3xl font-bold text-slate-800 transition-colors hover:text-rose-500"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;