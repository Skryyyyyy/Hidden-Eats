'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Search, Star, Clock, Filter, SlidersHorizontal, MapPin, Menu as MenuIcon, ChevronDown, Home, Briefcase, X, Compass, Radio, Clapperboard, Bookmark, Settings, User, CreditCard, History, Heart, Moon, Bell, MessageSquare, LogOut, Award, Smartphone, Zap, ShieldCheck, ChevronRight, Download, HelpCircle, Truck, Package, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import GlobalThemeToggle from '@/components/GlobalThemeToggle';


export default function ResponsiveLandingPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  
  // Location State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Chennai');
  const [isLocating, setIsLocating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);


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

    // Location Permission Request
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('userLat', position.coords.latitude.toString());
          localStorage.setItem('userLng', position.coords.longitude.toString());
          setCurrentLocation('Location Found');
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);



  return (
    <div className="min-h-screen flex flex-col items-center font-sans overflow-x-hidden relative bg-[#111111]">
      
      {/* Splash screen is now handled by FlashcardSplash in layout.tsx */}

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
            
            {/* Desktop Links - Updated to match new features */}
            <div className="hidden xl:flex items-center bg-black/20 backdrop-blur-md p-1.5 rounded-full border border-white/10 ml-4 lg:ml-8">
              <Link href="/explorer" className="flex items-center gap-2 bg-[#f8b11c] text-black px-5 py-2.5 rounded-full text-[10px] xl:text-[11px] font-bold uppercase tracking-widest shadow-lg">
                <Compass className="w-3.5 h-3.5" /> Explore Spots
              </Link>
              <Link href="/driver" className="flex items-center gap-2 text-white/80 hover:text-white px-4 py-2.5 rounded-full text-[10px] xl:text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-white/5">
                <Briefcase className="w-3.5 h-3.5" /> Driver Portal
              </Link>
              <a href="#" className="flex items-center gap-2 text-white/80 hover:text-white px-4 py-2.5 rounded-full text-[10px] xl:text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-white/5">
                <MapPin className="w-3.5 h-3.5" /> In-App Map
              </a>
              <a href="#" className="flex items-center gap-2 text-white/80 hover:text-white px-4 py-2.5 rounded-full text-[10px] xl:text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-white/5">
                <Radio className="w-3.5 h-3.5" /> Live Radar
              </a>
              <a href="#" className="flex items-center gap-2 text-white/80 hover:text-white px-4 py-2.5 rounded-full text-[10px] xl:text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-white/5">
                <Clapperboard className="w-3.5 h-3.5" /> Foodie Reels
              </a>
              <a href="#" className="flex items-center gap-2 text-white/80 hover:text-white px-4 py-2.5 rounded-full text-[10px] xl:text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-white/5">
                <Bookmark className="w-3.5 h-3.5" /> Collections
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-6 xl:gap-16">
            {/* Location (Hidden on mobile) */}
            <div 
              className="hidden xl:flex items-start gap-6 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
              onClick={() => setIsLocationModalOpen(true)}
            >
              {/* Icon and City/State */}
              <div className="flex items-start gap-2.5 mt-0.5">
                <MapPin className="w-4 h-4 text-[#f8b11c] shrink-0" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-white uppercase tracking-widest">
                    {currentLocation} <ChevronDown className="w-3 h-3 text-white/50" strokeWidth={3} />
                  </div>
                  <div className="text-[10px] text-white/50 tracking-wide font-medium mt-0.5">
                    Tamil Nadu
                  </div>
                </div>
              </div>
              
              {/* Detailed Address */}
              <div className="hidden xl:flex flex-col text-[10px] font-bold text-white/90 uppercase tracking-widest leading-[1.4]">
                <span>ANNA NAGAR</span>
                <span>CHENNAI, TN 600040</span>
                <span>INDIA</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-white text-[11px] font-bold uppercase tracking-widest hover:text-[#f8b11c] transition-colors">
                Log In
              </Link>
              <Link href="/login" className="bg-[#f8b11c] text-black px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#e0a019] transition-colors shadow-lg">
                Sign Up
              </Link>
              <div className="relative">
                <button 
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`transition-colors p-2.5 rounded-full border border-white/10 ${
                    isSettingsOpen ? 'bg-[#f8b11c] text-black border-[#f8b11c]' : 'text-white/80 hover:text-[#f8b11c] bg-white/5 hover:bg-white/10'
                  }`}
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isSettingsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
                    >
                      {/* Section 1: Account */}
                      <div className="p-2 border-b border-white/10">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account & Profile</div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <User className="w-4 h-4" /> Personal Info
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <MapPin className="w-4 h-4" /> Saved Addresses
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <CreditCard className="w-4 h-4" /> Payment Methods
                        </button>
                      </div>

                      {/* Section 2: Orders */}
                      <div className="p-2 border-b border-white/10">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders & Activity</div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <History className="w-4 h-4" /> Order History
                        </button>
                        <button className="w-full flex items-center justify-between px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <div className="flex items-center gap-3"><Heart className="w-4 h-4" /> Favorites</div>
                          <span className="bg-[#f8b11c]/20 text-[#f8b11c] px-2 py-0.5 rounded text-[10px] font-bold">12</span>
                        </button>
                      </div>

                      {/* Section 3: Preferences */}
                      <div className="p-2 border-b border-white/10">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">App Preferences</div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <Bell className="w-4 h-4" /> Notifications
                        </button>
                      </div>

                      {/* Section 4: Hidden Eats Exclusives */}
                      <div className="p-2 border-b border-white/10">
                        <div className="px-3 py-2 text-[10px] font-bold text-[#f8b11c] uppercase tracking-widest">Hidden Eats VIP</div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[#f8b11c]/80 hover:text-[#f8b11c] hover:bg-[#f8b11c]/10 rounded-xl transition-colors text-xs font-medium text-left">
                          <Award className="w-4 h-4" /> My Unlocked Spots
                        </button>
                      </div>

                      {/* Section 5: Support & Logout */}
                      <div className="p-2 bg-black/40">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <MessageSquare className="w-4 h-4" /> Help & Support
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors text-xs font-medium text-left">
                          <LogOut className="w-4 h-4" /> Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
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
                { name: 'Burger', img: '/img/burger.png' },
                { name: 'Pizza', img: '/img/pizza.png' },
                { name: 'Sushi', img: '/img/sushi.png' }
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
                  src="/img/chicken_crunch.png" 
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
             <div 
               onClick={() => window.location.href = '/explorer'}
               className="min-h-[300px] lg:min-h-[350px] shrink-0 bg-[#f8b11c] rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between shadow-2xl hover:shadow-[#f8b11c]/30 hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer group will-change-transform relative overflow-hidden"
             >
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
                       <img src="/img/food_general.png" className="w-full h-full rounded-lg object-cover" alt="Side" loading="lazy" />
                       <div className="absolute bottom-1 right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">4.8Γÿà</div>
                     </div>
                     <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/30 rounded-xl overflow-hidden backdrop-blur-md p-1 shadow-lg group-hover:-translate-y-1 transition-transform duration-[600ms] delay-150 ease-[cubic-bezier(0.23,1,0.32,1)] relative">
                       <img src="/img/food_general.png" className="w-full h-full rounded-lg object-cover" alt="Side 2" loading="lazy" />
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
        HOW IT WORKS (Enhanced)
        ========================================================================= 
      */}
      <div className="w-full bg-[#FAFAFA] text-black py-24 md:py-32 px-6 md:px-12 flex flex-col items-center z-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f8b11c]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="text-center mb-16 md:mb-24 relative z-10">
          <span className="text-[#f8b11c] font-bold tracking-widest uppercase text-sm mb-4 block">Simple Process</span>
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight font-black">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 w-full max-w-6xl relative z-10">
          {[
            { step: '01', title: 'Discover', desc: 'Find hidden gems and top-rated local spots around Tamil Nadu.', icon: <Search className="w-10 h-10 text-white" />, img: '/img/food_general.png', color: 'bg-black' },
            { step: '02', title: 'Order', desc: 'Seamless in-app ordering with secure payments and real-time tracking.', icon: <Smartphone className="w-10 h-10 text-black" />, img: '/img/burger.png', color: 'bg-[#f8b11c]' },
            { step: '03', title: 'Enjoy', desc: 'Fast, reliable delivery straight to your door. Hot and fresh.', icon: <Package className="w-10 h-10 text-white" />, img: '/img/pizza.png', color: 'bg-red-900' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="relative mb-12">
                {/* Large Number Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] font-display text-black/5 font-black leading-none group-hover:scale-110 transition-transform duration-700">{item.step}</div>
                
                {/* Image Circle */}
                <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl relative z-10 border-4 border-white group-hover:-translate-y-4 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                {/* Icon Badge */}
                <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full ${item.color} flex items-center justify-center shadow-xl z-20 group-hover:rotate-12 transition-transform duration-500`}>
                  {item.icon}
                </div>
              </div>
              
              <h3 className="font-display text-3xl uppercase font-bold mb-4">{item.title}</h3>
              <p className="text-black/60 font-medium leading-relaxed max-w-[280px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 
        =========================================================================
        APP FEATURES SECTION
        ========================================================================= 
      */}
      <div className="w-full bg-[#111111] py-24 md:py-32 px-6 md:px-12 flex flex-col items-center z-20 relative border-t border-white/5">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="space-y-12">
            <div>
              <span className="text-[#f8b11c] font-bold tracking-widest uppercase text-sm mb-4 block">Why Choose Us</span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight font-black leading-[1.1]">
                More Than Just<br />Delivery.
              </h2>
            </div>
            
            <div className="space-y-8">
              {[
                { icon: <Zap className="w-6 h-6 text-[#f8b11c]" />, title: 'Lightning Fast', desc: 'Average delivery time of 25 minutes. We take hot food seriously.' },
                { icon: <MapPin className="w-6 h-6 text-[#f8b11c]" />, title: 'Live Tracking', desc: 'Watch your order travel from the kitchen straight to your door in real-time.' },
                { icon: <ShieldCheck className="w-6 h-6 text-[#f8b11c]" />, title: 'No Minimum Order', desc: 'Craving just a coffee? We\'ve got you covered. No hidden fees.' }
              ].map((feat, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#f8b11c]/20 group-hover:border-[#f8b11c]/50 transition-colors duration-300">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xl mb-2">{feat.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden md:block">
             <div className="w-full aspect-square bg-[#f8b11c] rounded-full blur-[120px] opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
             <div className="relative z-10 w-full h-[600px] rounded-[3rem] overflow-hidden border-8 border-[#1a1a1a] shadow-2xl">
               <img src="/img/pizza.png" alt="App interface" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
               <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                     <Truck className="w-6 h-6 text-white" />
                   </div>
                   <div>
                     <h5 className="text-white font-bold text-lg">Out for Delivery</h5>
                     <p className="text-green-400 text-sm font-medium">Arriving in 12 mins</p>
                   </div>
                 </div>
                 <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                   <div className="w-2/3 h-full bg-green-500 rounded-full"></div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* 
        =========================================================================
        PARTNER / RIDE SECTION (Enhanced)
        ========================================================================= 
      */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 z-20 relative">
        <div className="relative p-12 md:p-24 min-h-[400px] lg:min-h-[500px] flex flex-col justify-center items-start group overflow-hidden">
          <img src="/img/burger.png" alt="Restaurant Partner" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 group-hover:from-black group-hover:to-black/50 transition-colors duration-500"></div>
          
          <h2 className="font-display text-4xl md:text-6xl text-white uppercase font-black mb-6 relative z-10 leading-[1.1]">Grow your<br />Business</h2>
          <p className="text-white/80 mb-8 max-w-md relative z-10 leading-relaxed text-sm md:text-base">Partner with Hidden Eats to reach more hungry customers in Tamil Nadu. We handle the logistics, you focus on the food.</p>
          <button className="bg-[#f8b11c] text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white hover:scale-105 transition-all duration-300 relative z-10 flex items-center gap-2 shadow-xl shadow-[#f8b11c]/20">
            Partner With Us <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative p-12 md:p-24 min-h-[400px] lg:min-h-[500px] flex flex-col justify-center items-start group overflow-hidden">
          <img src="/img/sushi.png" alt="Delivery Rider" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8b11c]/95 via-[#f8b11c]/90 to-[#f8b11c]/40 group-hover:from-[#f8b11c] group-hover:to-[#f8b11c]/60 transition-colors duration-500"></div>
          
          <h2 className="font-display text-4xl md:text-6xl text-black uppercase font-black mb-6 relative z-10 leading-[1.1]">Your Ride,<br />Your Rules</h2>
          <p className="text-black/80 mb-8 max-w-md font-medium relative z-10 leading-relaxed text-sm md:text-base">Be your own boss. Deliver smiles across the city on your own schedule and earn competitive payouts.</p>
          <button className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-900 hover:scale-105 transition-all duration-300 relative z-10 flex items-center gap-2 shadow-xl shadow-black/20">
            Apply to Ride <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 
        =========================================================================
        GET THE APP & FAQ SECTION
        ========================================================================= 
      */}
      <div className="w-full bg-[#111111] py-24 md:py-32 px-6 md:px-12 flex flex-col items-center z-20 relative border-t border-white/5">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* FAQ */}
          <div>
            <span className="text-[#f8b11c] font-bold tracking-widest uppercase text-sm mb-4 block">Got Questions?</span>
            <h2 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tight font-black mb-12">Frequently Asked</h2>
            
            <div className="space-y-4">
              {[
                { q: "What are your delivery hours?", a: "We deliver from 7:00 AM to 2:00 AM, seven days a week across most major cities in Tamil Nadu." },
                { q: "Is there a minimum order amount?", a: "No! Whether you want a single coffee or a feast for ten, we'll deliver it with no hidden small-order fees." },
                { q: "How do I partner my restaurant?", a: "Click 'Partner With Us' above to fill out a quick form. Our onboarding team will contact you within 24 hours." },
                { q: "Can I track my order?", a: "Yes, our app features real-time live GPS tracking so you can follow your food from the kitchen to your doorstep." }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-bold text-lg">{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-[#f8b11c]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-6 pt-0 text-gray-400 leading-relaxed text-sm">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Get App */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-black rounded-[3rem] border border-white/10 p-12 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f8b11c]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <Smartphone className="w-16 h-16 text-[#f8b11c] mb-8 relative z-10" />
            <h2 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tight font-black mb-4 relative z-10">Get the App</h2>
            <p className="text-gray-400 max-w-sm mb-12 relative z-10">Download the Hidden Eats app for exclusive offers, faster checkout, and live tracking.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10">
              <button className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-200 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                <Download className="w-5 h-5" /> App Store
              </button>
              <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                <Download className="w-5 h-5" /> Google Play
              </button>
            </div>
            
            <div className="mt-12 inline-block bg-[#f8b11c]/20 border border-[#f8b11c]/30 text-[#f8b11c] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase relative z-10">
              Get 50% Off First Order
            </div>
          </div>

        </div>
      </div>

      {/* 
        =========================================================================
        CITIES WE DELIVER TO
        ========================================================================= 
      */}
      <div className="w-full bg-black py-16 px-6 md:px-12 flex flex-col items-center z-20 relative border-t border-white/10">
        <h2 className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-8">Serving across Tamil Nadu</h2>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-5xl">
          {['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Erode', 'Vellore'].map((city, idx) => (
            <span key={idx} className="text-white/60 hover:text-white font-display text-xl md:text-2xl uppercase tracking-wider transition-colors cursor-pointer hover:-translate-y-1 block transform duration-300">{city}</span>
          ))}
        </div>
      </div>

      {/* 
        =========================================================================
        FOOTER
        ========================================================================= 
      */}
      <footer className="w-full bg-[#111111] py-16 px-6 md:px-12 z-20 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 sm:col-span-2">
            <h2 className="text-3xl font-black tracking-tighter text-white mb-4">Hidden Eats</h2>
            <p className="text-white/50 max-w-sm text-sm leading-relaxed">Discovering and delivering the best local culinary secrets across Tamil Nadu. Fast, reliable, and always hot.</p>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-400 hover:text-[#f8b11c] transition-colors text-sm">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-[#f8b11c] transition-colors text-sm">Careers</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-[#f8b11c] transition-colors text-sm">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-[#f8b11c] transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-[#f8b11c] transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#f8b11c] transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#f8b11c] transition-colors text-sm">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-gray-500 text-xs tracking-wide">© 2026 Hidden Eats. All rights reserved.</p>
          <div className="flex gap-6 mt-6 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">Twitter</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">Instagram</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">LinkedIn</a>
          </div>
        </div>
      </footer>


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
