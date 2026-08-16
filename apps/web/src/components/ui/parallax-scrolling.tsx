'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      const layers = [
        { layer: "1", yPercent: 40 },
        { layer: "2", yPercent: 25 },
        { layer: "3", yPercent: 10 },
        { layer: "4", yPercent: -15 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    let lenis: Lenis | null = null;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenis.on('scroll', ScrollTrigger.update);
      
      const updateRaf = (time: number) => {
        lenis?.raf(time * 1000);
      };
      
      gsap.ticker.add(updateRaf);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(updateRaf);
        ScrollTrigger.getAll().forEach(st => st.kill());
        if (triggerElement) gsap.killTweensOf(triggerElement);
        lenis?.destroy();
      };
    } catch (e) {
      console.warn("Lenis init deferred", e);
    }
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[#0d0d0d] text-white py-20 border-t border-white/10" ref={parallaxRef}>
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#671212]/30 via-black to-[#111111] pointer-events-none" />

      {/* Main Parallax Showcase Header */}
      <section className="relative w-full max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-12 relative z-20">
          <span className="text-[#f8b11c] font-bold tracking-widest uppercase text-xs md:text-sm block mb-2">
            Immersive Experience
          </span>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight font-black text-white">
            UNCOVER THE UNSEEN
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-xs md:text-sm font-medium mt-3 leading-relaxed">
            Scroll down to explore multi-layered taste dimensions of Hidden Eats. From secret kitchens to gourmet street gems.
          </p>
        </div>

        {/* Visuals Container with Parallax Layers */}
        <div className="relative w-full h-[450px] sm:h-[550px] md:h-[650px] rounded-[2.5rem] overflow-hidden border border-white/15 shadow-2xl bg-black">
          
          <div data-parallax-layers className="relative w-full h-full flex items-center justify-center">
            
            {/* Layer 1: Background Food Landscape */}
            <div data-parallax-layer="1" className="absolute inset-0 w-full h-[120%] -top-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80" 
                loading="eager" 
                alt="Ambiance" 
                className="w-full h-full object-cover opacity-50 filter brightness-75 scale-105" 
              />
            </div>

            {/* Layer 2: Middle Floating Gourmet Plate */}
            <div data-parallax-layer="2" className="absolute inset-0 w-full h-[120%] -top-[10%] flex items-center justify-center pointer-events-none">
              <img 
                src="/img/food_general.png" 
                loading="eager" 
                alt="Gourmet Dish" 
                className="w-[280px] sm:w-[380px] md:w-[480px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.8)] filter contrast-125" 
              />
            </div>

            {/* Layer 3: Central Title */}
            <div data-parallax-layer="3" className="relative z-30 text-center px-4 pointer-events-none">
              <h3 className="font-display text-5xl sm:text-7xl md:text-9xl uppercase tracking-tighter text-[#f8b11c] drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] stroke-black">
                HIDDEN EATS
              </h3>
              <div className="inline-block mt-4 px-6 py-2 rounded-full bg-black/60 backdrop-blur-md border border-[#f8b11c]/30 text-white font-bold text-xs uppercase tracking-widest">
                Scroll to Reveal Secrets
              </div>
            </div>

            {/* Layer 4: Foreground Overlay Assets */}
            <div data-parallax-layer="4" className="absolute inset-0 w-full h-[120%] -top-[10%] flex justify-between items-end p-6 md:p-12 pointer-events-none z-40">
              <div className="w-24 h-24 sm:w-36 sm:h-36 bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-3 shadow-2xl transform -rotate-6">
                <img src="/img/burger.png" alt="Burger" className="w-full h-full object-contain" />
              </div>
              <div className="w-24 h-24 sm:w-36 sm:h-36 bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-3 shadow-2xl transform rotate-6">
                <img src="/img/pizza.png" alt="Pizza" className="w-full h-full object-contain" />
              </div>
            </div>

          </div>

          {/* Fade Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none z-40" />
        </div>
      </section>

      {/* Decorative Bottom Emblem */}
      <section className="relative w-full flex flex-col items-center justify-center pt-16 z-20">
        <div className="w-16 h-16 rounded-full bg-[#f8b11c]/10 border border-[#f8b11c]/30 flex items-center justify-center text-[#f8b11c] animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 160 160" fill="none">
            <path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>
    </div>
  );
}
