'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Search, Star, Clock, Filter, SlidersHorizontal, MapPin, Menu as MenuIcon, ChevronDown, Home, Briefcase, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
  { id: 1, name: 'Sangeetha Veg Restaurant', rating: 4.8, time: '20-25 mins', cuisines: 'South Indian, Pure Veg', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2000&q=100', offer: '20% OFF', location: 'T. Nagar, Chennai' },
  { id: 2, name: 'A2B - Adyar Ananda Bhavan', rating: 4.6, time: '15-20 mins', cuisines: 'Sweets, South Indian', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=2000&q=100', offer: 'FREE DELIVERY', location: 'Adyar, Chennai' },
  { id: 3, name: 'Murugan Idli Shop', rating: 4.9, time: '30-35 mins', cuisines: 'South Indian, Breakfast', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=2000&q=100', offer: '10% OFF', location: 'Besant Nagar, Chennai' },
  { id: 4, name: 'Dindigul Thalappakatti', rating: 4.7, time: '40-45 mins', cuisines: 'Biryani, South Indian', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=2000&q=100', offer: '20% OFF above ₹400', location: 'Nungambakkam' },
  { id: 5, name: 'Buhari Hotel', rating: 4.5, time: '25-30 mins', cuisines: 'Mughlai, Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=2000&q=100', offer: '60% OFF', location: 'Mount Road, Chennai' },
  { id: 6, name: 'Junior Kuppanna', rating: 4.4, time: '10-15 mins', cuisines: 'Kongunadu, South Indian', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=2000&q=100', offer: 'Buy 1 Get 1', location: 'Velachery' },
  { id: 7, name: 'Ambur Star Briyani', rating: 4.3, time: '15-25 mins', cuisines: 'Biryani, Fast Food', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=2000&q=100', offer: '20% OFF', location: 'Anna Nagar' },
  { id: 8, name: 'Saravana Bhavan', rating: 4.8, time: '30-40 mins', cuisines: 'South Indian, Pure Veg', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=2000&q=100', offer: 'FREE DESSERT', location: 'Mylapore, Chennai' },
];

export default function ResponsiveLandingPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  
  // Location State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Chennai');
  const [isLocating, setIsLocating] = useState(false);

  const handleUseGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      setCurrentLocation('123 Current St, SF');
      setIsLocating(false);
      setIsLocationModalOpen(false);
    }, 1500);
  };

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
            <div 
              className="hidden xl:flex gap-8 text-[10px] font-bold text-white uppercase tracking-widest text-left opacity-90 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
              onClick={() => setIsLocationModalOpen(true)}
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[#f8b11c]" />
                <div>
                  <span className="flex items-center gap-1">{currentLocation} <ChevronDown className="w-3 h-3 text-gray-400" /></span>
                  <br />
                  <span className="opacity-60 lowercase font-normal tracking-normal">Tamil Nadu</span>
                </div>
              </div>
              <div className="leading-relaxed hidden xl:block">
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
              {[
                { name: 'Burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=2000&q=100' },
                { name: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2000&q=100' },
                { name: 'Sushi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=2000&q=100' }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#FAF6EB] rounded-[1.5rem] md:rounded-[2rem] w-40 md:w-auto shrink-0 snap-center aspect-[4/5] flex items-center justify-center p-2 relative group cursor-pointer hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/40 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] shadow-xl overflow-hidden will-change-transform">
                   <img 
                     src={item.img} 
                     alt={item.name} 
                     className="w-full h-full object-cover rounded-[1rem] group-hover:scale-110 transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] drop-shadow-xl will-change-transform" 
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
                       <div className="absolute bottom-1 right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">4.8Γÿà</div>
                     </div>
                     <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/30 rounded-xl overflow-hidden backdrop-blur-md p-1 shadow-lg group-hover:-translate-y-1 transition-transform duration-[600ms] delay-150 ease-[cubic-bezier(0.23,1,0.32,1)] relative">
                       <img src="https://images.unsplash.com/photo-1564936281291-294551497d81?auto=format&fit=crop&w=150&q=80" className="w-full h-full rounded-lg object-cover" alt="Side 2" loading="lazy" />
                       <div className="absolute bottom-1 right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">4.9Γÿà</div>
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
              <Link href={`/restaurant/${rest.id}`} key={rest.id} className="w-[280px] md:w-[320px] shrink-0 snap-center group cursor-pointer space-y-4 hover:-translate-y-2 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform block">
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
              </Link>
            ))}
          </div>
        </section>

        {/* All Restaurants Grid */}
        <section className="space-y-6">
          <h3 className="font-display text-2xl md:text-3xl tracking-wide uppercase text-white/90 border-b border-white/10 pb-4">Restaurants to explore right now</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {RESTAURANTS.map((rest) => (
              <Link href={`/restaurant/${rest.id}`} key={rest.id} className="group cursor-pointer space-y-3 hover:-translate-y-2 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform block">
                <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden relative shadow-md group-hover:shadow-2xl group-hover:shadow-black/50 transition-shadow duration-[600ms]">
                  <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-[400ms]"></div>
                  
                  {/* Overlay content */}
                  <div className="absolute top-4 left-4">
                     <span className="bg-black/50 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/10">{rest.time}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                     <span className="font-display text-xl md:text-2xl uppercase tracking-tighter text-[#f8b11c] drop-shadow-md">{rest.offer}</span>
                  </div>
                </div>
                
                <div className="px-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-base md:text-lg truncate group-hover:text-white transition-colors duration-[400ms] text-white/90">{rest.name}</h4>
                    <span className="flex items-center gap-1 bg-green-700/20 text-green-400 px-1.5 py-0.5 rounded text-xs shrink-0 mt-0.5">
                      <Star className="w-3 h-3 fill-green-400" /> {rest.rating}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mt-1 truncate">{rest.cuisines} • {rest.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* 
        =========================================================================
        LOCATION PICKER MODAL (WEB)
        ========================================================================= 
      */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#111] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative p-6 md:p-8"
            >
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                className="absolute top-6 right-6 z-50 hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <h2 className="font-display text-2xl uppercase tracking-wider font-bold mb-6">Select Location</h2>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for area, street name..." 
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#f8b11c] transition-colors"
                />
              </div>

              <button 
                onClick={handleUseGPS}
                disabled={isLocating}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-[#f8b11c]/10 hover:bg-[#f8b11c]/20 transition-colors mb-6 text-left group"
              >
                <div className="p-3 bg-[#f8b11c]/20 rounded-full group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5 text-[#f8b11c]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#f8b11c]">{isLocating ? 'Locating...' : 'Use Current Location'}</h4>
                  <p className="text-xs text-[#f8b11c]/70 mt-1">Using GPS</p>
                </div>
              </button>

              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Saved Addresses</p>
                
                {[
                  { icon: <Home className="w-5 h-5" />, title: 'Home', desc: 'Block D, Anna Nagar East, Chennai' },
                  { icon: <Briefcase className="w-5 h-5" />, title: 'Work', desc: 'Tidel Park, Taramani, Chennai' }
                ].map((addr, idx) => (
                  <div 
                    key={idx}
                    onClick={() => { setCurrentLocation(addr.title); setIsLocationModalOpen(false); }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="text-gray-400">{addr.icon}</div>
                    <div>
                      <h4 className="font-bold">{addr.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{addr.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
