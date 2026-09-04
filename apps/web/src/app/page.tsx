'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Search, Star, Clock, Filter, SlidersHorizontal, MapPin, Menu as MenuIcon, ChevronDown, Home, Briefcase, X, Compass, Radio, Clapperboard, Bookmark, Settings, User, CreditCard, History, Heart, Moon, Bell, MessageSquare, LogOut, Award, Smartphone, Zap, ShieldCheck, ChevronRight, Download, HelpCircle, Truck, Package, ChevronUp, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import GlobalThemeToggle from '@/components/GlobalThemeToggle';
import {
  Dialog,
  DialogClose,
  DialogContainer,
  DialogContent,
  DialogDescription,
  DialogImage,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/linear-modal';
import dynamic from 'next/dynamic';

const ParallaxComponent = dynamic(
  () => import('@/components/ui/parallax-scrolling').then((mod) => mod.ParallaxComponent),
  { ssr: false }
);

import InteractiveFeatures from '@/components/ui/InteractiveFeatures';
import ParticleText from '@/components/ParticleText';
import DepthCarousel from '@/components/DepthCarousel';
import SplitFlapText from '@/components/SplitFlapText';

export default function ResponsiveLandingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  
  // Location State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Chennai');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Live Activity State
  const [liveActivity, setLiveActivity] = useState<{message: string, time: string} | null>(null);

  useEffect(() => {
    const activities = [
      "Just ordered: Spicy Chicken Burger in Anna Nagar",
      "New Partner joined: The Sushi Bar",
      "Just ordered: Truffle Fries in T. Nagar",
      "New Review: 5 stars for Chicken Crunch",
      "Just ordered: Classic Margherita in Adyar",
      "Driver assigned for order #4291",
      "Just ordered: 2x Cold Brew in Nungambakkam",
    ];
    
    const interval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setLiveActivity({ message: randomActivity, time: 'Just now' });
      
      setTimeout(() => {
        setLiveActivity(null);
      }, 5000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleProtectedNav = async (targetUrl: string, isLocationAction: boolean = false) => {
    if (isLocationAction) {
      setIsLocationModalOpen(true);
    } else {
      window.location.href = targetUrl;
    }
  };

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

  // GSAP Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenis.on('scroll', ScrollTrigger.update);
      const updateRaf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(updateRaf);
      gsap.ticker.lagSmoothing(0);
    } catch (e) {
      console.warn("Lenis init deferred", e);
    }

    // Hero Section
    const heroTl = gsap.timeline();
    heroTl.fromTo('.hero-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
          .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
          .fromTo('.hero-card', { opacity: 0, scale: 0.8, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.4');

    gsap.to('.hero-title', {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // How It Works
    gsap.fromTo('.how-it-works-card', 
      { opacity: 0, y: 100, rotation: 5 }, 
      { opacity: 1, y: 0, rotation: 0, duration: 1, stagger: 0.2, ease: 'power3.out', scrollTrigger: {
        trigger: '.how-it-works-section',
        start: 'top 75%',
      }}
    );

    // Partner Section
    gsap.to('.partner-bg', {
      scale: 1.2,
      ease: 'none',
      scrollTrigger: {
        trigger: '.partner-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
    
    gsap.to('.ride-bg', {
      scale: 1.2,
      ease: 'none',
      scrollTrigger: {
        trigger: '.partner-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // FAQ GSAP logic replaced with Framer Motion

    return () => {
      const updateRaf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.remove(updateRaf);
      ScrollTrigger.getAll().forEach(st => st.kill());
      lenis?.destroy();
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
      <div className="hero-section w-full min-h-screen bg-[#671212] flex flex-col relative overflow-hidden">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 md:px-12 md:py-8 relative z-40">
          <div className="flex items-center gap-8 xl:gap-16">
            <div className="text-2xl font-black tracking-tighter text-white">Hidden Eats</div>
            
            {/* Desktop Links (Moved to protected routes) */}
          </div>
          
          <div className="flex items-center gap-6 xl:gap-16">
            {/* Location (Hidden on mobile) */}
            <div 
              className="hidden xl:flex items-start gap-6 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
              onClick={() => handleProtectedNav('/explorer', true)}
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
                        <Link href="/explorer/settings" onClick={() => setIsSettingsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <User className="w-4 h-4 text-[#f8b11c]" /> Personal Info
                        </Link>
                        <Link href="/explorer/settings" onClick={() => setIsSettingsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <MapPin className="w-4 h-4 text-[#f8b11c]" /> Saved Addresses
                        </Link>
                        <Link href="/explorer/settings" onClick={() => setIsSettingsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <CreditCard className="w-4 h-4 text-[#f8b11c]" /> Payment Methods
                        </Link>
                      </div>

                      {/* Section 2: Orders */}
                      <div className="p-2 border-b border-white/10">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders & Activity</div>
                        <Link href="/explorer/collections" onClick={() => setIsSettingsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <History className="w-4 h-4 text-emerald-400" /> Order History
                        </Link>
                        <Link href="/explorer/collections" onClick={() => setIsSettingsOpen(false)} className="w-full flex items-center justify-between px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <div className="flex items-center gap-3"><Heart className="w-4 h-4 text-rose-400" /> Favorites</div>
                          <span className="bg-[#f8b11c]/20 text-[#f8b11c] px-2 py-0.5 rounded text-[10px] font-bold">12</span>
                        </Link>
                      </div>

                      {/* Section 3: Preferences */}
                      <div className="p-2 border-b border-white/10">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">App Preferences</div>
                        <Link href="/explorer/settings" onClick={() => setIsSettingsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <Bell className="w-4 h-4 text-purple-400" /> Notifications
                        </Link>
                      </div>

                      {/* Section 4: Hidden Eats Exclusives */}
                      <div className="p-2 border-b border-white/10">
                        <div className="px-3 py-2 text-[10px] font-bold text-[#f8b11c] uppercase tracking-widest">Hidden Eats VIP</div>
                        <Link href="/explorer" onClick={() => setIsSettingsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-[#f8b11c]/80 hover:text-[#f8b11c] hover:bg-[#f8b11c]/10 rounded-xl transition-colors text-xs font-medium text-left">
                          <Award className="w-4 h-4" /> My Unlocked Spots
                        </Link>
                      </div>

                      {/* Section 5: Support & Logout */}
                      <div className="p-2 bg-black/40">
                        <Link href="/license" onClick={() => setIsSettingsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs font-medium text-left">
                          <MessageSquare className="w-4 h-4" /> Help & Support
                        </Link>
                        <Link href="/login" onClick={() => setIsSettingsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors text-xs font-medium text-left">
                          <LogOut className="w-4 h-4" /> Log Out
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Mobile Menu Icon */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-[#0c0d14]/95 border-b border-white/10 backdrop-blur-xl px-6 py-6 relative z-30 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/explorer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-[#f8b11c]/15 text-white hover:text-[#f8b11c] text-xs font-bold uppercase tracking-wider transition-colors border border-white/5"
                >
                  <Compass className="w-4 h-4 text-[#f8b11c]" /> Explore
                </Link>
                <Link
                  href="/explorer/map"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 text-white hover:text-emerald-400 text-xs font-bold uppercase tracking-wider transition-colors border border-white/5"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" /> Live Map
                </Link>
                <Link
                  href="/explorer/reels"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-rose-500/15 text-white hover:text-rose-400 text-xs font-bold uppercase tracking-wider transition-colors border border-white/5"
                >
                  <Clapperboard className="w-4 h-4 text-rose-400" /> Reels
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-blue-500/15 text-white hover:text-blue-400 text-xs font-bold uppercase tracking-wider transition-colors border border-white/5"
                >
                  <Briefcase className="w-4 h-4 text-blue-400" /> Partner
                </Link>
                <Link
                  href="/driver"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-amber-500/15 text-white hover:text-amber-400 text-xs font-bold uppercase tracking-wider transition-colors border border-white/5"
                >
                  <Truck className="w-4 h-4 text-amber-400" /> Rider
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f8b11c] text-black text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <User className="w-4 h-4" /> Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content Container (Grid for desktop, Flex col for mobile) */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[1.2fr_1fr] relative z-10 px-6 md:px-12 pb-12 pt-4 xl:pt-8 gap-8 lg:gap-16">
          
          {/* Left Column (Text + Bottom Cards) */}
          <div className="flex flex-col justify-between h-full relative z-20">
            {/* Text Block - Fixed Line Heights */}
            <div className="space-y-4 md:space-y-6 pt-4">
              <h1 className="hero-title font-display text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[10rem] xl:text-[12.5rem] leading-[0.95] text-white tracking-tighter drop-shadow-md m-0 p-0">
                DESIGN<br />
                BEYOND<br />
                LIMITS.
              </h1>
              <h2 className="hero-subtitle font-display text-4xl sm:text-5xl md:text-[4.5rem] xl:text-[5.5rem] text-white leading-[1.1] tracking-tight drop-shadow-sm max-w-2xl m-0 p-0">
                WHERE EVERY BITE<br className="hidden md:block" />
                HITS DIFFERENT
              </h2>
            </div>

            {/* Address Lookup Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (deliveryAddress.trim()) {
                  router.push(`/explorer?search=${encodeURIComponent(deliveryAddress.trim())}`);
                } else {
                  router.push('/explorer');
                }
              }}
              className="hero-subtitle mt-8 mb-4 flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 max-w-xl w-full relative z-30 shadow-2xl"
            >
              <div className="pl-4 pr-2 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#f8b11c]" />
              </div>
              <input 
                type="text" 
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address" 
                className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full text-sm font-medium focus:ring-0"
              />
              <button 
                type="submit"
                className="bg-[#f8b11c] text-black px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#e0a019] transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
              >
                Find Food <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom 3 Cards */}
            <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-4 md:gap-6 mt-12 pb-4 lg:pb-0 scrollbar-hide snap-x w-full scroll-smooth">
              {[
                { name: 'Burger', img: '/img/burger.png', query: 'Burger' },
                { name: 'Pizza', img: '/img/pizza.png', query: 'Pizza' },
                { name: 'Sushi', img: '/img/sushi.png', query: 'Chinese' }
              ].map((item, idx) => (
                <Link 
                  key={idx} 
                  href={`/explorer?category=${item.query}`}
                  className="hero-card bg-[#FAF6EB] rounded-[1.5rem] md:rounded-[2rem] w-40 md:w-auto shrink-0 snap-center aspect-[4/5] flex items-center justify-center p-2 relative group cursor-pointer hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/40 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] shadow-xl overflow-hidden will-change-transform"
                >
                   <img 
                     src={item.img} 
                     alt={item.name} 
                     className="w-full h-full object-cover rounded-[1rem] group-hover:scale-110 transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] drop-shadow-xl will-change-transform" 
                     loading="lazy"
                   />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column (Stacked Cards) */}
          <div className="flex flex-col gap-6 relative z-10 h-full justify-between">
             {/* Tall Card */}
             <Link 
               href="/explorer"
               className="hero-card flex-1 min-h-[350px] lg:min-h-0 bg-black rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-2xl hover:shadow-black/50 hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform block"
             >
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
             </Link>
             
             {/* Yellow Card */}
             <Link 
               href="/explorer"
               className="hero-card min-h-[300px] lg:min-h-[350px] shrink-0 bg-[#f8b11c] rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between shadow-2xl hover:shadow-[#f8b11c]/30 hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer group will-change-transform relative overflow-hidden block"
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
                       <div className="absolute bottom-1 right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">4.8★</div>
                     </div>
                     <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/30 rounded-xl overflow-hidden backdrop-blur-md p-1 shadow-lg group-hover:-translate-y-1 transition-transform duration-[600ms] delay-150 ease-[cubic-bezier(0.23,1,0.32,1)] relative">
                       <img src="/img/food_general.png" className="w-full h-full rounded-lg object-cover" alt="Side 2" loading="lazy" />
                       <div className="absolute bottom-1 right-1 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">4.9★</div>
                     </div>
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors shadow-xl">
                    <ArrowUpRight className="w-6 h-6 stroke-[3]" />
                  </div>
                </div>
             </Link>
          </div>
          
        </div>
      </div>

      {/* 
        =========================================================================
        LIVE PLATFORM METRICS
        ========================================================================= 
      */}
      <div className="w-full bg-[#f8b11c] py-6 px-4 flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-24 relative z-20 overflow-hidden border-y border-black/10 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-3 h-3">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-ping absolute"></div>
            <div className="w-2 h-2 bg-red-600 rounded-full relative z-10"></div>
          </div>
          <span className="font-display font-black text-2xl md:text-3xl uppercase tracking-tighter text-black mt-1">Live Data</span>
        </div>
        
        <div className="flex gap-12 md:gap-24">
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-3xl md:text-4xl font-display font-black text-black">12,402</span>
            <span className="text-[10px] font-bold text-black/70 uppercase tracking-widest">Active Foodies</span>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-3xl md:text-4xl font-display font-black text-black">843</span>
            <span className="text-[10px] font-bold text-black/70 uppercase tracking-widest">Live Orders</span>
          </div>
          <div className="flex flex-col items-center sm:items-start hidden md:flex">
            <span className="text-3xl md:text-4xl font-display font-black text-black">&lt;24m</span>
            <span className="text-[10px] font-bold text-black/70 uppercase tracking-widest">Avg Delivery</span>
          </div>
        </div>
      </div>

      {/* 
        =========================================================================
        HOW IT WORKS (Linear Modal Expandable Cards)
        ========================================================================= 
      */}
      <div className="how-it-works-section w-full bg-[#FAFAFA] text-black py-24 md:py-32 px-6 md:px-12 flex flex-col items-center z-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f8b11c]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="text-center mb-16 md:mb-24 relative z-10">
          <span className="text-[#f8b11c] font-bold tracking-widest uppercase text-sm mb-4 block">Simple Process</span>
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight font-black">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full max-w-7xl relative z-10">
          {[
            {
              id: 1,
              step: '01',
              title: 'Discover',
              shortDesc: 'Find hidden gems and top-rated local spots around Tamil Nadu.',
              description: 'Immerse yourself in our cutting-edge food discovery engine designed to showcase authentic local spots and secret off-menu items with unparalleled clarity and style. Filter through high-resolution dishes, explore chef recommendations, and uncover exclusive culinary spots not listed on standard food delivery apps across Tamil Nadu.',
              tags: ['Hidden Gems', 'Secret Menus', 'Tamil Nadu'],
              icon: <Search className="w-10 h-10 text-white" />,
              img: '/img/food_general.png',
              color: 'bg-black'
            },
            {
              id: 2,
              step: '02',
              title: 'Order',
              shortDesc: 'Seamless in-app ordering with secure payments.',
              description: 'Embark on a seamless culinary journey with state-of-the-art in-app ordering. Spin through dynamic restaurant menus, reserve dining tables, or get express home delivery with zero hidden fees.',
              tags: ['In-App Ordering', 'Table Booking'],
              icon: <Smartphone className="w-10 h-10 text-black" />,
              img: '/img/burger.png',
              color: 'bg-[#f8b11c]'
            },
            {
              id: 3,
              step: '03',
              title: 'Track',
              shortDesc: 'Real-time GPS tracking from kitchen to door.',
              description: 'Our platform integrates real-time GPS tracking feeds, showcasing everything from kitchen preparation states to courier arrival. You will never be left guessing when your food will arrive.',
              tags: ['Real-time Tracking', 'Live Updates'],
              icon: <MapPin className="w-10 h-10 text-white" />,
              img: '/img/sushi.png',
              color: 'bg-[#2A2A2A]'
            },
            {
              id: 4,
              step: '04',
              title: 'Enjoy',
              shortDesc: 'Fast, reliable delivery straight to your door. Hot and fresh.',
              description: 'Transform your dining experience with hot, fresh delivery delivered straight to your door in under 30 minutes. Enjoy exclusive foodie perks, accumulate loyalty rewards, and unlock secret food badges with every single order you place on Hidden Eats.',
              tags: ['Express Delivery', 'Hot & Fresh', 'VIP Rewards'],
              icon: <Package className="w-10 h-10 text-white" />,
              img: '/img/pizza.png',
              color: 'bg-red-900'
            }
          ].map((item) => (
            <Dialog
              key={item.id}
              transition={{
                type: 'spring',
                bounce: 0.05,
                duration: 0.5,
              }}
            >
              <DialogTrigger
                style={{
                  borderRadius: '24px',
                }}
                className="how-it-works-card relative flex w-full flex-col overflow-hidden border border-black/10 bg-white hover:bg-gray-50 transition-all duration-300 shadow-xl group text-left"
              >
                <div className="relative w-full h-56 overflow-hidden bg-black/5 flex items-center justify-center">
                  <div className="absolute top-4 left-4 z-20 text-4xl font-display font-black text-black/20 group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <DialogImage
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute bottom-3 right-3 w-12 h-12 rounded-full ${item.color} flex items-center justify-center shadow-lg z-20 group-hover:rotate-12 transition-transform`}>
                    {item.icon}
                  </div>
                </div>

                <div className="flex grow flex-col justify-between p-6 relative">
                  <div>
                    <DialogTitle className="text-foreground font-display text-3xl font-bold uppercase tracking-tight text-black mb-2">
                      {item.title}
                    </DialogTitle>
                    <p className="text-black/60 text-sm font-medium leading-relaxed">
                      {item.shortDesc}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-black/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#f8b11c]">Click to Expand</span>
                    <div className="p-2 bg-black/5 hover:bg-black/10 rounded-lg transition-colors">
                      <Plus className="w-4 h-4 text-black" />
                    </div>
                  </div>
                </div>
              </DialogTrigger>

              <DialogContainer
                className="pt-12 md:pt-20"
                overlayClassName="dark:bg-[radial-gradient(125%_125%_at_50%_10%,#050505_40%,#1b1b1b_100%)] bg-[radial-gradient(125%_125%_at_50%_10%,#ffffff_40%,#b1b1b1_100%)]"
              >
                <DialogContent
                  style={{
                    borderRadius: '24px',
                  }}
                  className="relative flex h-auto max-h-[90vh] mx-auto flex-col overflow-y-auto border border-white/10 bg-[#111111] text-white lg:w-[800px] w-[90%] shadow-2xl p-6 md:p-8"
                >
                  <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 bg-black/40">
                    <DialogImage
                      src={item.img}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className={`absolute top-4 right-4 w-14 h-14 rounded-full ${item.color} flex items-center justify-center shadow-2xl`}>
                      {item.icon}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-4xl md:text-5xl font-display uppercase tracking-tight text-[#f8b11c]">
                        {item.title}
                      </DialogTitle>
                      <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full text-white/80">
                        Step {item.step}
                      </span>
                    </div>

                    <DialogDescription
                      disableLayoutAnimation
                      variants={{
                        initial: { opacity: 0, scale: 0.95, y: -20 },
                        animate: { opacity: 1, scale: 1, y: 0 },
                        exit: { opacity: 0, scale: 0.95, y: -20 },
                      }}
                    >
                      <p className="text-base text-gray-300 leading-relaxed font-sans">
                        {item.description}
                      </p>
                      
                      <div className="mt-6 flex flex-wrap gap-2">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-3 py-1 bg-[#f8b11c]/10 text-[#f8b11c] border border-[#f8b11c]/20 text-xs font-bold uppercase tracking-wider rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </DialogDescription>
                  </div>

                  <DialogClose className="text-white bg-white/10 p-3 hover:bg-white/20 rounded-full transition-colors" />
                </DialogContent>
              </DialogContainer>
            </Dialog>
          ))}
        </div>
      </div>

      {/* 
        =========================================================================
        PARALLAX SCROLLING SECTION
        ========================================================================= 
      */}
      <ParallaxComponent />

      {/* 
        =========================================================================
        APP FEATURES SECTION
        ========================================================================= 
      */}
      <InteractiveFeatures />

      {/* 
        =========================================================================
        🌌 INTERACTIVE PARTICLE PHYSICS SHOWCASE
        ========================================================================= 
      */}
      <div className="w-full py-20 px-6 bg-[#07080b] border-y border-white/10 flex flex-col items-center justify-center relative overflow-hidden z-20">
        <div className="text-center mb-6 z-10">
          <span className="text-[#f8b11c] font-black tracking-widest uppercase text-xs block mb-2">
            Interactive AI Discovery Engine
          </span>
          <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white/90">
            Uncover Hidden Flavors
          </h3>
        </div>
        <div style={{ width: '100%', height: 340 }} className="relative z-10 flex items-center justify-center">
          <ParticleText
            text="HIDDEN EATS"
            particleSize={2.4}
            density={4}
            color="#f8fafc"
            highlightColor="#f8b11c"
            scatter={190}
            gatherDuration={1600}
            stagger={420}
            pointerRepel={45}
            repelRadius={130}
            idleDrift={0.8}
            trigger="mount"
            fontSize="clamp(3.5rem, 12vw, 8.5rem)"
            fontWeight={900}
            fontFamily="inherit"
            glow
          />
        </div>
        <p className="text-gray-400 text-xs mt-3 z-10 font-mono text-center tracking-wide">
          Hover or tap anywhere to repel and reform the interactive particle grid
        </p>
      </div>

      {/* 
        =========================================================================
        🛩️ MECHANICAL SPLIT-FLAP REALTIME DISPATCH BOARD
        ========================================================================= 
      */}
      <div className="w-full py-16 px-6 bg-[#08090e] border-b border-white/10 flex flex-col items-center justify-center relative overflow-hidden z-20">
        <div className="text-center mb-6 z-10">
          <span className="text-[#f8b11c] font-black tracking-widest uppercase text-xs block mb-2">
            Live Secret Dispatch Terminal
          </span>
          <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white font-black">
            Realtime Culinary Signals
          </h3>
        </div>

        <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-[#0c0d14] border border-white/15 shadow-2xl overflow-x-auto max-w-full flex items-center justify-center">
          <SplitFlapText
            words={["LAUNCH READY", "SYNC ONLINE", "SIGNAL LIVE", "SECRET GEMS", "TAMIL NADU", "CHEF VAULT"]}
            flipDuration={0.12}
            stagger={0.06}
            cycleDelay={2400}
            charset="alphanumeric"
            flipsPerChar={8}
            tileColor="#111827"
            textColor="#f8fafc"
            tileRadius={8}
            gap={6}
            fontSize={42}
            loop
            padTo={12}
          />
        </div>
      </div>

      {/* 
        =========================================================================
        🍣 3D DEPTH CAROUSEL SECRET VAULT
        ========================================================================= 
      */}
      <div className="w-full py-24 px-6 bg-[#090a10] border-b border-white/10 flex flex-col items-center justify-center relative overflow-hidden z-20">
        <div className="text-center mb-12 relative z-10">
          <span className="text-[#f8b11c] font-black tracking-widest uppercase text-xs mb-3 block">
            Curated Off-Menu Vault
          </span>
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight font-black text-white">
            Explore Dishes in 3D
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Spin through signature off-menu creations and hidden gems available exclusively on Hidden Eats.
          </p>
        </div>

        <div style={{ height: '500px', width: '100%', position: 'relative', maxWidth: '1200px' }}>
          <DepthCarousel
            items={[
              { image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80', alt: 'Smoked Mutton Biryani', title: 'Smoked Mutton Dum Biryani', subtitle: 'Hole-in-the-Wall • Chennai' },
              { image: 'https://images.unsplash.com/photo-1626776876729-ab5220c5d577?w=800&auto=format&fit=crop&q=80', alt: 'Black Garlic Wings', title: 'Black Garlic Smoked Wings', subtitle: 'Secret Night Kitchen' },
              { image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=800&auto=format&fit=crop&q=80', alt: 'Truffle Butter Dosa', title: 'Truffle Butter Ghee Dosa', subtitle: 'Heritage Secret Spot' },
              { image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80', alt: 'Chettinad Brain Fry', title: 'Chettinad Claypot Fry', subtitle: 'Chef Exclusive • 86 Available' },
              { image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', alt: 'Filter Coffee Panna Cotta', title: 'Filter Coffee Panna Cotta', subtitle: 'Artisan Dessert Lab' },
            ]}
            depth={220}
            spread={90}
            tilt={22}
            tiltDirection="right"
            perspective={1400}
            visibleCards={4}
            falloff={0.2}
            blur={6}
            autoplay
            loop
          />
        </div>
      </div>

      {/* 
        =========================================================================
        TESTIMONIALS & SOCIAL PROOF
        ========================================================================= 
      */}
      <div className="testimonials-section w-full bg-[#FAFAFA] text-black py-24 md:py-32 px-6 md:px-12 flex flex-col items-center z-20 relative border-t border-black/10">
        <div className="text-center mb-16 relative z-10">
          <span className="text-[#f8b11c] font-bold tracking-widest uppercase text-sm mb-4 block">Loved by Foodies</span>
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-tight font-black">Don't Just Take Our Word</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl relative z-10">
          {[
            {
              name: "Sarah Jenkins",
              role: "Local Food Blogger",
              review: "Hidden Eats is a game changer. I've discovered so many hole-in-the-wall spots that aren't on any other delivery app. The live tracking is flawless.",
              rating: 5,
            },
            {
              name: "Michael Chen",
              role: "Regular Customer",
              review: "Finally, an app that focuses on quality local food instead of just fast-food chains. The delivery is lightning fast and the interface is incredibly smooth.",
              rating: 5,
            },
            {
              name: "Priya Ramesh",
              role: "Restaurant Partner",
              review: "Since joining Hidden Eats, our orders have doubled. Their focus on showcasing our food with high-quality images really makes a difference.",
              rating: 5,
            }
          ].map((testimonial, idx) => (
             <div key={idx} className="bg-white border border-black/10 p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-transform duration-300">
               <div className="flex gap-1 mb-6">
                 {[...Array(testimonial.rating)].map((_, i) => (
                   <Star key={i} className="w-5 h-5 fill-[#f8b11c] text-[#f8b11c]" />
                 ))}
               </div>
               <p className="text-black/80 font-medium text-lg leading-relaxed mb-8">"{testimonial.review}"</p>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-[#f8b11c] font-bold font-display text-xl">
                   {testimonial.name.charAt(0)}
                 </div>
                 <div>
                   <h4 className="font-bold text-black uppercase tracking-wider">{testimonial.name}</h4>
                   <p className="text-black/50 text-sm font-medium">{testimonial.role}</p>
                 </div>
               </div>
             </div>
          ))}
        </div>
        
        {/* Media Mentions / Featured In */}
        <div className="mt-24 pt-12 border-t border-black/10 w-full max-w-5xl flex flex-col items-center">
          <p className="text-black/40 font-bold uppercase tracking-widest text-sm mb-8">Featured In</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="font-display text-2xl md:text-3xl font-black">THE HINDU</div>
             <div className="font-display text-2xl md:text-3xl font-black">TIMES OF INDIA</div>
             <div className="font-display text-2xl md:text-3xl font-black">VOGUE INDIA</div>
             <div className="font-display text-2xl md:text-3xl font-black">LBB</div>
          </div>
        </div>
      </div>

      {/* 
        =========================================================================
        PARTNER / RIDE SECTION (Enhanced)
        ========================================================================= 
      */}
      <div className="partner-section w-full grid grid-cols-1 lg:grid-cols-2 z-20 relative">
        <div className="relative p-12 md:p-24 min-h-[400px] lg:min-h-[500px] flex flex-col justify-center items-start group overflow-hidden">
          <img src="/img/burger.png" alt="Restaurant Partner" className="partner-bg absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 group-hover:from-black group-hover:to-black/50 transition-colors duration-500"></div>
          
          <h2 className="font-display text-4xl md:text-6xl text-white uppercase font-black mb-6 relative z-10 leading-[1.1]">Grow your<br />Business</h2>
          <p className="text-white/80 mb-8 max-w-md relative z-10 leading-relaxed text-sm md:text-base">Partner with Hidden Eats to reach more hungry customers in Tamil Nadu. We handle the logistics, you focus on the food.</p>
          <Link 
            href="/dashboard"
            className="bg-[#f8b11c] text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white hover:scale-105 transition-all duration-300 relative z-10 flex items-center gap-2 shadow-xl shadow-[#f8b11c]/20"
          >
            Partner With Us <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="relative p-12 md:p-24 min-h-[400px] lg:min-h-[500px] flex flex-col justify-center items-start group overflow-hidden">
          <img src="/img/sushi.png" alt="Delivery Rider" className="ride-bg absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8b11c]/95 via-[#f8b11c]/90 to-[#f8b11c]/40 group-hover:from-[#f8b11c] group-hover:to-[#f8b11c]/60 transition-colors duration-500"></div>
          
          <h2 className="font-display text-4xl md:text-6xl text-black uppercase font-black mb-6 relative z-10 leading-[1.1]">Your Ride,<br />Your Rules</h2>
          <p className="text-black/80 mb-8 max-w-md font-medium relative z-10 leading-relaxed text-sm md:text-base">Be your own boss. Deliver smiles across the city on your own schedule and earn competitive payouts.</p>
          <Link 
            href="/driver"
            className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-900 hover:scale-105 transition-all duration-300 relative z-10 flex items-center gap-2 shadow-xl shadow-black/20"
          >
            Apply to Ride <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 
        =========================================================================
        GET THE APP & FAQ SECTION
        ========================================================================= 
      */}
      <div className="faq-section w-full bg-[#111111] py-24 md:py-32 px-6 md:px-12 flex flex-col items-center z-20 relative border-t border-white/5">
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
                <motion.div 
                  key={idx} 
                  className="faq-item bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
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
                </motion.div>
              ))}
            </div>
          </div>

          {/* Get App */}
          <motion.div 
            className="app-download-card bg-gradient-to-br from-[#1a1a1a] to-black rounded-[3rem] border border-white/10 p-12 flex flex-col items-center text-center relative overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
          >
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
          </motion.div>

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
            <Link 
              key={idx} 
              href={`/explorer?search=${city}`}
              className="text-white/60 hover:text-[#f8b11c] font-display text-xl md:text-2xl uppercase tracking-wider transition-colors cursor-pointer hover:-translate-y-1 block transform duration-300"
            >
              {city}
            </Link>
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
            <h4 className="font-display text-xl uppercase tracking-widest text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/legal/terms" className="text-gray-400 hover:text-[#f8b11c] transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="text-gray-400 hover:text-[#f8b11c] transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/legal/cookies" className="text-gray-400 hover:text-[#f8b11c] transition-colors text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm">© 2026 Hidden Eats. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://twitter.com/hiddeneats" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">Twitter</a>
            <a href="https://instagram.com/hiddeneats" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">Instagram</a>
            <a href="https://linkedin.com/company/hiddeneats" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">LinkedIn</a>
          </div> 
        </div>
      </footer>


      {/* Live Activity Toast */}
      <AnimatePresence>
        {liveActivity && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm"
          >
            <div className="w-10 h-10 rounded-full bg-[#f8b11c]/20 flex items-center justify-center shrink-0">
              <div className="w-3 h-3 bg-[#f8b11c] rounded-full animate-pulse" />
            </div>
            <div>
              <p className="text-white text-sm font-medium leading-tight">{liveActivity.message}</p>
              <p className="text-[#f8b11c] text-xs font-bold mt-1 uppercase tracking-widest">{liveActivity.time}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
