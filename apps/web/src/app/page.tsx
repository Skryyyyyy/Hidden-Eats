'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Search, Star, Clock, Filter, SlidersHorizontal, MapPin, Menu as MenuIcon } from 'lucide-react';

const CATEGORIES = [
  { name: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80' },
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80' },
  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80' },
  { name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80' },
  { name: 'Desserts', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80' },
  { name: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300&q=80' },
  { name: 'Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80' },
  { name: 'Coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80' },
];

const RESTAURANTS = [
  { id: 1, name: 'The Grand Secret Kitchen', rating: 4.8, time: '20-25 mins', cuisines: 'American, Fast Food', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', offer: '50% OFF up to $10', location: 'Venice Beach' },
  { id: 2, name: 'Alleyway Street Bakes', rating: 4.6, time: '15-20 mins', cuisines: 'Pizzas, Italian', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', offer: 'FREE DELIVERY', location: 'Santa Monica' },
  { id: 3, name: 'Umami Burger Joint', rating: 4.9, time: '30-35 mins', cuisines: 'Burgers, American', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', offer: '10% OFF', location: 'Downtown LA' },
  { id: 4, name: 'Tokyo Sushi Bar', rating: 4.7, time: '40-45 mins', cuisines: 'Japanese, Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', offer: '20% OFF above $40', location: 'Little Tokyo' },
  { id: 5, name: 'Bombay Spice', rating: 4.5, time: '25-30 mins', cuisines: 'North Indian, Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', offer: '60% OFF', location: 'Culver City' },
  { id: 6, name: 'Green Life Salads', rating: 4.4, time: '10-15 mins', cuisines: 'Healthy, Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', offer: 'Buy 1 Get 1', location: 'Beverly Hills' },
  { id: 7, name: 'Taco Haven', rating: 4.3, time: '15-25 mins', cuisines: 'Mexican, Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80', offer: '20% OFF', location: 'West Hollywood' },
  { id: 8, name: 'Sweet Tooth Bakery', rating: 4.8, time: '30-40 mins', cuisines: 'Desserts, Bakery', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80', offer: 'FREE DESSERT', location: 'Silver Lake' },
];

export default function ResponsiveLandingPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    // Start fading out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 2000);

    // Remove from DOM completely after 2.8 seconds
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const scrollToMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center font-sans overflow-x-hidden relative bg-[#111111]">
      
      {/* 
        =========================================================================
        WEB SPLASH SCREEN OVERLAY
        ========================================================================= 
      */}
      {showSplash && (
        <div 
          className={`fixed inset-0 z-[9999] bg-[#E93B3B] flex flex-col items-center justify-center transition-opacity duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${fadeSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <div className="text-white text-center flex flex-col items-center gap-6">
            <h1 className="font-display text-5xl md:text-7xl font-black tracking-[0.15em] uppercase drop-shadow-xl animate-pulse">
              Hidden Eats
            </h1>
            <p className="text-white/90 font-medium tracking-[0.2em] uppercase text-xs md:text-sm">
              Skip the chains. Eat like a local.
            </p>
          </div>
        </div>
      )}

      
      {/* 
        =========================================================================
        HERO SECTION (Full Desktop Resolution & Perfect Alignment)
        ========================================================================= 
      */}
      <div className="w-full min-h-screen bg-[#671212] flex flex-col relative overflow-hidden">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 md:px-12 md:py-8 relative z-40">
          <div className="flex items-center gap-8 xl:gap-16">
            <div className="text-2xl font-black tracking-tighter text-white">Hidden Eats</div>
            
            {/* Desktop Links */}
            <div className="hidden lg:flex gap-8 text-[11px] font-bold text-white uppercase tracking-widest">
              <a href="#menu" onClick={scrollToMenu} className="hover:opacity-80 transition-opacity">Menu</a>
              <a href="#" className="hover:opacity-80 transition-opacity">About</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Gift Card</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Discount</a>
            </div>
          </div>
          
          <div className="flex items-center gap-6 xl:gap-16">
            {/* Location (Hidden on mobile) */}
            <div className="hidden xl:flex gap-8 text-[10px] font-bold text-white uppercase tracking-widest text-left opacity-90">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <div>Chennai<br /><span className="opacity-60 lowercase font-normal tracking-normal">Tamil Nadu</span></div>
              </div>
              <div className="leading-relaxed">
                Anna Nagar<br />
                Chennai, TN 600040<br />
                India
              </div>
            </div>
            
            <button className="hidden md:flex bg-white text-black px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg">
              Book Appointment <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </button>
            
            {/* Mobile Menu Icon */}
            <button className="md:hidden text-white p-2">
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* Hero Content Container (Grid for desktop, Flex col for mobile) */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[1.2fr_1fr] relative z-10 px-6 md:px-12 pb-12 pt-4 xl:pt-8 gap-8 lg:gap-16">
          
          {/* Left Column (Text + Bottom Cards) */}
          <div className="flex flex-col justify-between h-full relative z-20">
            {/* Text Block - Fixed Line Heights */}
            <div className="space-y-4 md:space-y-6 pt-4">
              <h1 className="font-display text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[10rem] xl:text-[12.5rem] leading-[0.95] text-white tracking-tighter drop-shadow-md m-0 p-0">
                DESIGN<br />
                BEYOND<br />
                LIMITS.
              </h1>
              <h2 className="font-display text-4xl sm:text-5xl md:text-[4.5rem] xl:text-[5.5rem] text-white leading-[1.1] tracking-tight drop-shadow-sm max-w-2xl m-0 p-0">
                WHERE EVERY BITE<br className="hidden md:block" />
                HITS DIFFERENT
              </h2>
            </div>

            {/* Bottom 3 Cards */}
            <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-4 md:gap-6 mt-12 pb-4 lg:pb-0 scrollbar-hide snap-x w-full scroll-smooth">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-[#FAF6EB] rounded-[1.5rem] md:rounded-[2rem] w-40 md:w-auto shrink-0 snap-center aspect-[4/5] flex items-center justify-center p-4 relative group cursor-pointer hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/40 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] shadow-xl will-change-transform">
                   <img 
                     src="https://upload.wikimedia.org/wikipedia/commons/1/11/Cheeseburger.png" 
                     alt="Burger icon" 
                     className="w-[85%] h-auto object-contain group-hover:scale-110 transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] drop-shadow-xl will-change-transform" 
                     loading="lazy"
                   />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Stacked Cards) */}
          <div className="flex flex-col gap-6 relative z-10 h-full justify-between">
             {/* Tall Card */}
             <div className="flex-1 min-h-[350px] lg:min-h-0 bg-black rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-2xl hover:shadow-black/50 hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform">
                <img 
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" 
                  alt="Chicken Crunch" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] opacity-90 will-change-transform" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10"></div>
                
                {/* Top Badge */}
                <div className="absolute top-6 right-6 bg-[#f8b11c] text-black text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg">
                  Top Rated Gem
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-[#111]/90 backdrop-blur-md text-white p-5 rounded-3xl w-full shadow-2xl border border-white/10">
                     <div className="flex justify-between items-start">
                       <h3 className="font-display text-3xl md:text-4xl uppercase leading-[0.9] tracking-tight text-[#f8b11c]">Chicken<br/>Crunch</h3>
                       <span className="font-bold text-xl">$12</span>
                     </div>
                     <p className="text-gray-400 text-xs md:text-sm mt-3 leading-relaxed w-[85%]">
                       The legendary off-menu spicy buttermilk fried chicken sandwich. Exclusively available after 8 PM.
                     </p>
                     <div className="flex items-center gap-4 mt-4">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-green-400"><Star className="w-3 h-3 fill-green-400" /> 4.9 (2k+ Reviews)</span>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><MapPin className="w-3 h-3"/> 1.2 miles</span>
                     </div>
                  </div>
                </div>
             </div>
             
             {/* Yellow Card */}
             <div className="min-h-[300px] lg:min-h-[350px] shrink-0 bg-[#f8b11c] rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between shadow-2xl hover:shadow-[#f8b11c]/30 hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer group will-change-transform relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>

                <div>
                  <h3 className="font-display text-4xl lg:text-5xl text-black uppercase leading-[0.9] tracking-tight group-hover:scale-105 origin-left transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]">
                    Order<br />
                    For<br />
                    Today
                  </h3>
                  <p className="text-black/80 font-medium text-xs mt-3 max-w-[200px] leading-relaxed">
                    Skip the generic chains. Get handpicked local favorites delivered hot to your door in under 30 minutes.
                  </p>
                </div>

                <div className="flex justify-between items-end relative z-10">
                  <div className="flex gap-3">
                     <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/30 rounded-xl overflow-hidden backdrop-blur-md p-1 shadow-lg group-hover:-translate-y-1 transition-transform duration-[600ms] delay-75 ease-[cubic-bezier(0.23,1,0.32,1)] relative">
                       <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=150&q=80" className="w-full h-full rounded-lg object-cover" alt="Side" loading="lazy" />
                       <div className="absolute bottom-1 right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">4.8★</div>
                     </div>
                     <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/30 rounded-xl overflow-hidden backdrop-blur-md p-1 shadow-lg group-hover:-translate-y-1 transition-transform duration-[600ms] delay-150 ease-[cubic-bezier(0.23,1,0.32,1)] relative">
                       <img src="https://images.unsplash.com/photo-1564936281291-294551497d81?auto=format&fit=crop&w=150&q=80" className="w-full h-full rounded-lg object-cover" alt="Side 2" loading="lazy" />
                       <div className="absolute bottom-1 right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">4.9★</div>
                     </div>
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors shadow-xl">
                    <ArrowUpRight className="w-6 h-6 stroke-[3]" />
                  </div>
                </div>
             </div>
          </div>
          
        </div>
      </div>

      {/* 
        =========================================================================
        SWIGGY-STYLE FOOD ORDERING SECTION
        ========================================================================= 
      */}
      <div id="menu" className="w-full bg-[#111111] text-white px-6 py-12 md:px-12 md:py-24 flex flex-col gap-12 relative z-40">
        
        {/* Sticky Search & Filter Bar */}
        <div className="sticky top-0 z-50 bg-[#111111]/95 backdrop-blur-xl py-4 -mx-6 px-6 md:-mx-12 md:px-12 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-8 border-b border-white/10">
          <h2 className="font-display text-3xl md:text-4xl tracking-wide uppercase w-full lg:w-auto text-center lg:text-left">Cravings?</h2>
          
          <div className="flex-1 w-full max-w-3xl relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for restaurants, cuisines, or dishes..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-[#f8b11c] focus:bg-white/10 transition-colors placeholder:text-gray-500"
            />
          </div>

          <div className="w-full lg:w-auto flex justify-center lg:justify-end gap-3">
            <button className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold tracking-widest uppercase transition-colors">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold tracking-widest uppercase transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Sort
            </button>
          </div>
        </div>

        {/* Categories: What's on your mind? */}
        <section className="space-y-6">
          <h3 className="font-display text-2xl md:text-3xl tracking-wide uppercase text-white/90">What's on your mind?</h3>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 shrink-0 snap-center group cursor-pointer w-24 md:w-32">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#1A1A1A] border border-white/5 overflow-hidden group-hover:border-white/30 transition-colors duration-[400ms] relative shadow-lg">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform" loading="lazy" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-[400ms]"></div>
                </div>
                <span className="text-xs md:text-sm font-bold tracking-wider uppercase text-gray-400 group-hover:text-white transition-colors duration-[400ms] text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Top Chains Carousel */}
        <section className="space-y-6">
          <h3 className="font-display text-2xl md:text-3xl tracking-wide uppercase text-white/90">Top restaurant chains in LA</h3>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x scroll-smooth">
            {RESTAURANTS.slice(0, 5).map((rest) => (
              <div key={rest.id} className="w-[280px] md:w-[320px] shrink-0 snap-center group cursor-pointer space-y-4 hover:-translate-y-2 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform">
                <div className="w-full aspect-[4/3] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative shadow-lg group-hover:shadow-2xl group-hover:shadow-black/50 transition-shadow duration-[600ms]">
                  <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                     <span className="font-display text-xl md:text-2xl uppercase tracking-tighter text-[#f8b11c] drop-shadow-md">{rest.offer}</span>
                  </div>
                </div>
                <div className="px-1 md:px-2">
                  <h4 className="font-bold text-base md:text-lg truncate group-hover:text-white transition-colors duration-[400ms] text-white/90">{rest.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs md:text-sm font-medium">
                    <span className="flex items-center gap-1 bg-green-700/20 text-green-400 px-2 py-0.5 rounded"><Star className="w-3 h-3 fill-green-400" /> {rest.rating}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span className="flex items-center gap-1 text-gray-300"><Clock className="w-3.5 h-3.5" /> {rest.time}</span>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mt-1 truncate">{rest.cuisines}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Restaurants Grid */}
        <section className="space-y-6">
          <h3 className="font-display text-2xl md:text-3xl tracking-wide uppercase text-white/90 border-b border-white/10 pb-4">Restaurants to explore right now</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {RESTAURANTS.map((rest) => (
              <div key={rest.id} className="group cursor-pointer space-y-3 hover:-translate-y-2 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform">
                <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden relative shadow-md group-hover:shadow-2xl group-hover:shadow-black/50 transition-shadow duration-[600ms]">
                  <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-[400ms]"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                     <span className="font-display text-xl uppercase tracking-tight text-white drop-shadow-md">{rest.offer}</span>
                  </div>
                </div>
                <div className="px-1">
                  <h4 className="font-bold text-base md:text-lg truncate group-hover:text-[#f8b11c] transition-colors duration-[400ms]">{rest.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs md:text-sm font-medium">
                    <span className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded-md text-[10px]"><Star className="w-3 h-3 fill-white" /> {rest.rating}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                    <span className="text-gray-300">{rest.time}</span>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mt-1 truncate">{rest.cuisines}</p>
                  <p className="text-gray-500 text-xs md:text-sm truncate">{rest.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
