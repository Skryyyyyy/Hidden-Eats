'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import ExplorerNav from '@/components/ExplorerNav';
import {
  Compass, Search, Star, Clock, MapPin, Sparkles, SlidersHorizontal, Flame, ChevronRight, Utensils, Radio, Clapperboard, Bookmark, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK_FOOD_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

const CATEGORIES = [
  { name: 'Idli', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80' },
  { name: 'Dosa', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80' },
  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80' },
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80' },
  { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' },
  { name: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80' },
  { name: 'Meals', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80' },
  { name: 'Sweets', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop&q=80' },
  { name: 'Ice Cream', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&auto=format&fit=crop&q=80' },
  { name: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80' },
  { name: 'Snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80' },
  { name: 'Chaat', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80' },
  { name: 'Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80' },
  { name: 'Coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80' },
  { name: 'Juices', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop&q=80' },
];

const RESTAURANTS = [
  { id: 1, name: 'Sangeetha Veg Restaurant', rating: 4.8, time: '20-25 mins', cuisines: 'South Indian, Pure Veg', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80', offer: '20% OFF', location: 'T. Nagar, Chennai' },
  { id: 2, name: 'A2B - Adyar Ananda Bhavan', rating: 4.6, time: '15-20 mins', cuisines: 'Sweets, South Indian', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop&q=80', offer: 'FREE DELIVERY', location: 'Adyar, Chennai' },
  { id: 3, name: 'Murugan Idli Shop', rating: 4.9, time: '30-35 mins', cuisines: 'South Indian, Breakfast', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80', offer: '10% OFF', location: 'Besant Nagar, Chennai' },
  { id: 4, name: 'Dindigul Thalappakatti', rating: 4.7, time: '40-45 mins', cuisines: 'Biryani, South Indian', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80', offer: '20% OFF above ₹400', location: 'Nungambakkam' },
  { id: 5, name: 'Buhari Hotel', rating: 4.5, time: '25-30 mins', cuisines: 'Mughlai, Biryani', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&auto=format&fit=crop&q=80', offer: '60% OFF', location: 'Mount Road, Chennai' },
  { id: 6, name: 'Junior Kuppanna', rating: 4.4, time: '10-15 mins', cuisines: 'Kongunadu, South Indian', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80', offer: 'Buy 1 Get 1', location: 'Velachery' },
  { id: 7, name: 'Ambur Star Briyani', rating: 4.3, time: '15-25 mins', cuisines: 'Biryani, Fast Food', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80', offer: '20% OFF', location: 'Anna Nagar' },
  { id: 8, name: 'Saravana Bhavan', rating: 4.8, time: '30-40 mins', cuisines: 'South Indian, Pure Veg', image: 'https://images.unsplash.com/photo-1627308595229-7830f5c9c66e?w=800&auto=format&fit=crop&q=80', offer: 'FREE DESSERT', location: 'Mylapore, Chennai' },
  { id: 9, name: 'KFC', rating: 4.2, time: '25-30 mins', cuisines: 'American, Fast Food', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop&q=80', offer: '30% OFF', location: 'Anna Nagar, Chennai' },
  { id: 10, name: 'Domino\'s Pizza', rating: 4.3, time: '30 mins', cuisines: 'Pizza, Fast Food', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&auto=format&fit=crop&q=80', offer: '₹100 OFF', location: 'Nungambakkam' },
  { id: 11, name: 'McDonald\'s', rating: 4.4, time: '20-25 mins', cuisines: 'Burger, Fast Food', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80', offer: 'FREE FRIES', location: 'T. Nagar, Chennai' },
  { id: 12, name: 'Anjappar Chettinad', rating: 4.6, time: '35-40 mins', cuisines: 'Chettinad, South Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80', offer: '15% OFF', location: 'Egmore, Chennai' },
  { id: 13, name: 'Theobroma', rating: 4.8, time: '20 mins', cuisines: 'Desserts, Bakery', image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop&q=80', offer: '10% OFF', location: 'Adyar, Chennai' },
  { id: 14, name: 'Truffles', rating: 4.7, time: '40-45 mins', cuisines: 'American, Continental', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80', offer: 'FREE DELIVERY', location: 'Velachery' },
  { id: 15, name: 'Paradise Biryani', rating: 4.5, time: '30-35 mins', cuisines: 'Biryani, Mughlai', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80', offer: '25% OFF', location: 'OMR, Chennai' },
  { id: 16, name: 'Cream Stone', rating: 4.7, time: '15-20 mins', cuisines: 'Ice Cream, Desserts', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&auto=format&fit=crop&q=80', offer: 'Buy 1 Get 1', location: 'Besant Nagar' },
  { id: 17, name: 'Absolute Barbecues', rating: 4.8, time: '45-50 mins', cuisines: 'BBQ, North Indian', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80', offer: '20% OFF above ₹800', location: 'T. Nagar, Chennai' },
  { id: 18, name: 'Subway', rating: 4.4, time: '15-20 mins', cuisines: 'Healthy Food, Sandwich', image: 'https://images.unsplash.com/photo-1553909489-cd47ce56350f?w=800&auto=format&fit=crop&q=80', offer: 'FREE COOKIE', location: 'Anna Nagar' },
  { id: 19, name: 'Burger King', rating: 4.3, time: '25-30 mins', cuisines: 'Burger, Fast Food', image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&auto=format&fit=crop&q=80', offer: '40% OFF', location: 'Royapettah' },
  { id: 20, name: 'Empire Restaurant', rating: 4.5, time: '35-40 mins', cuisines: 'North Indian, Mughlai', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80', offer: '10% OFF', location: 'Mount Road' },
];

export default function ExplorerPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'time' | 'default'>('default');

  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await createClient().auth.getSession();
      if (!session) return;
      
      const user = session.user;
      if (user && user.user_metadata?.onboarding_complete === false) {
        router.push('/explorer/onboarding');
      }
    }
    
    checkUser();
    setUserLocation(t('defaultLocation') || 'Chennai Central, TN');
  }, [t, router]);

  const filteredRestaurants = RESTAURANTS
    .filter(r => {
      const matchesCategory = !activeCategory || r.cuisines.toLowerCase().includes(activeCategory.toLowerCase()) || r.name.toLowerCase().includes(activeCategory.toLowerCase());
      const matchesSearch = searchQuery.trim() === '' || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisines.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'time') return parseInt(a.time) - parseInt(b.time);
      return 0;
    });

  const searchResults = searchQuery.trim() === '' ? [] : [
    ...RESTAURANTS.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisines.toLowerCase().includes(searchQuery.toLowerCase())),
    ...CATEGORIES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => ({ id: `cat-${c.name}`, name: c.name, type: 'category', image: c.image }))
  ].slice(0, 6);

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-500 relative overflow-hidden ${
      isLight ? 'bg-[#f8f9fb] text-slate-900' : 'bg-[#07080b] text-white'
    }`}>
      {/* ─── Premium Ambient Lighting ─── */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Golden Amber Radial Glow at Top Center */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] opacity-70 blur-[130px]"
          style={{
            background: isLight 
              ? 'radial-gradient(ellipse at center, rgba(245,158,11,0.12) 0%, rgba(251,191,36,0.04) 50%, transparent 80%)'
              : 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, rgba(217,119,6,0.03) 50%, transparent 80%)'
          }}
        />
        {/* Soft Ember Glow in Corner */}
        <div 
          className="absolute top-[35%] -right-40 w-[600px] h-[600px] opacity-40 blur-[150px]"
          style={{
            background: isLight 
              ? 'radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)'
          }}
        />
      </div>

      <ExplorerNav />

      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-5 sm:py-7 flex flex-col gap-6 sm:gap-8 relative z-10">
        
        {/* ─── Hero Search & Action Console ─── */}
        <section className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 border shadow-2xl transition-all duration-300 backdrop-blur-2xl ${
          isLight 
            ? 'bg-white/80 border-slate-200/80 shadow-slate-200/60' 
            : 'bg-[#0c0e15]/75 border-white/[0.08] shadow-black/80'
        }`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Title & Micro Tag */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
                  <Flame className="w-3 h-3" /> Live in Chennai
                </span>
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                  {filteredRestaurants.length} Places Open
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl tracking-wide uppercase leading-none">
                {t('cravings')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f59e0b]" />
                {userLocation}
              </p>
            </div>

            {/* Search Input Bar with Autocomplete */}
            <div className="w-full lg:max-w-xl relative">
              <div className={`relative flex items-center rounded-2xl border transition-all duration-300 shadow-inner ${
                isLight 
                  ? 'bg-slate-100/80 border-slate-200 focus-within:border-[#f59e0b] focus-within:bg-white' 
                  : 'bg-white/[0.04] border-white/[0.09] focus-within:border-[#f59e0b] focus-within:bg-white/[0.07]'
              }`}>
                <Search className="w-5 h-5 ml-4 text-[#f59e0b] shrink-0" />
                <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full bg-transparent py-3.5 px-3 text-xs sm:text-sm font-medium focus:outline-none placeholder:text-gray-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mr-3 text-xs text-gray-400 hover:text-white bg-white/10 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Autocomplete Popup */}
              <AnimatePresence>
                {isSearchFocused && searchQuery.trim() !== '' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border overflow-hidden z-50 backdrop-blur-2xl ${
                      isLight ? 'bg-white/95 border-slate-200' : 'bg-[#0f121a]/95 border-white/15'
                    }`}
                  >
                    {searchResults.length > 0 ? (
                      <div className="py-2 divide-y divide-white/5">
                        {searchResults.map((result: any, idx: number) => (
                          <Link 
                            href={result.type === 'category' ? '#' : `/explorer/restaurant/${result.id}`} 
                            key={result.id || idx}
                            onClick={() => {
                              if (result.type === 'category') {
                                setActiveCategory(result.name);
                                setSearchQuery('');
                              }
                              setIsSearchFocused(false);
                            }}
                            className={`flex items-center gap-3.5 px-4 py-3 transition-colors ${
                              isLight ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                            }`}
                          >
                            <img 
                              src={result.image || FALLBACK_FOOD_IMG} 
                              alt={result.name} 
                              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_FOOD_IMG; }}
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/10" 
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs sm:text-sm truncate">{result.name}</h4>
                              <p className="text-[11px] text-gray-400 truncate mt-0.5">
                                {result.type === 'category' ? 'Food Category' : `${result.cuisines} • ${result.location}`}
                              </p>
                            </div>
                            {result.type !== 'category' && (
                              <div className="flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-md text-[10px] font-black">
                                <Star className="w-3 h-3 fill-emerald-400" /> {result.rating}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-400 text-xs">
                        No culinary spots matched "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Filters & Sorting */}
            <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
              {activeCategory && (
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-black tracking-wider uppercase transition-all bg-[#f59e0b] text-black shadow-lg shadow-[#f59e0b]/20"
                >
                  ✕ {activeCategory}
                </button>
              )}
              <button 
                onClick={() => setSortBy(sortBy === 'rating' ? 'default' : 'rating')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] font-black tracking-wider uppercase transition-all ${
                  sortBy === 'rating'
                    ? 'border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b] shadow-lg shadow-[#f59e0b]/20'
                    : isLight 
                      ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700' 
                      : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white/80'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" /> Top Rated
              </button>
              <button 
                onClick={() => setSortBy(sortBy === 'time' ? 'default' : 'time')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] font-black tracking-wider uppercase transition-all ${
                  sortBy === 'time'
                    ? 'border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b] shadow-lg shadow-[#f59e0b]/20'
                    : isLight 
                      ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700' 
                      : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white/80'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Fastest
              </button>
            </div>

          </div>
        </section>

        {/* ─── "What's On Your Mind?" Categories ─── */}
        <section className="space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
              <h2 className="font-display text-2xl sm:text-3xl tracking-wide uppercase">
                {t('whatsOnMind')}
              </h2>
            </div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">
              Scroll to explore flavors →
            </span>
          </div>

          <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x scroll-smooth">
            {CATEGORIES.map((cat, idx) => {
              const isActive = activeCategory === cat.name;
              const label = t(`cat_${cat.name}`) || cat.name;

              return (
                <button 
                  key={idx} 
                  type="button"
                  onClick={() => setActiveCategory(isActive ? null : cat.name)}
                  className="flex flex-col items-center gap-2.5 shrink-0 snap-center group cursor-pointer text-center"
                >
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-b from-[#f59e0b] to-[#d97706] shadow-lg shadow-[#f59e0b]/30 scale-105'
                      : isLight
                        ? 'bg-white border border-slate-200 shadow-sm group-hover:border-[#f59e0b]/60 group-hover:shadow-md'
                        : 'bg-[#10131d] border border-white/10 shadow-lg group-hover:border-[#f59e0b]/50 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                  }`}>
                    <div className="w-full h-full rounded-[14px] overflow-hidden relative">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_FOOD_IMG; }}
                        className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500 will-change-transform" 
                        loading="lazy" 
                      />
                      <div className={`absolute inset-0 transition-opacity duration-300 ${
                        isActive ? 'bg-black/10' : 'bg-black/15 group-hover:bg-transparent'
                      }`} />
                    </div>
                  </div>
                  <span className={`text-[11px] sm:text-xs font-black tracking-wider uppercase transition-colors max-w-[88px] truncate ${
                    isActive
                      ? 'text-[#f59e0b]'
                      : isLight ? 'text-slate-700 group-hover:text-black' : 'text-gray-300 group-hover:text-white'
                  }`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── Top Restaurant Chains Near You (Featured Carousel) ─── */}
        <section className="space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="font-display text-2xl sm:text-3xl tracking-wide uppercase">
                {t('topRestaurants')}
              </h2>
            </div>
            <span className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-widest flex items-center gap-1">
              Popular in town <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth">
            {RESTAURANTS.slice(0, 10).map((rest) => (
              <Link 
                href={`/explorer/restaurant/${rest.id}`} 
                key={rest.id} 
                className={`w-[270px] sm:w-[300px] md:w-[320px] shrink-0 snap-center rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 group cursor-pointer block hover:-translate-y-1.5 shadow-xl ${
                  isLight 
                    ? 'bg-white border-slate-200 hover:border-[#f59e0b]/50 hover:shadow-slate-300/60' 
                    : 'bg-[#0d1017]/85 border-white/[0.08] hover:border-[#f59e0b]/40 hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)]'
                }`}
              >
                {/* Visual Cover Header */}
                <div className="w-full aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={rest.image} 
                    alt={rest.name} 
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_FOOD_IMG; }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out will-change-transform" 
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center">
                    <span className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-black text-[10px] sm:text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      {rest.offer}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md border border-white/15 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Clock className="w-3 h-3 text-[#f59e0b]" /> {rest.time}
                    </span>
                  </div>

                  {/* Bottom Image Tag */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-semibold text-white/90 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#f59e0b]" /> {rest.location}
                    </span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base sm:text-lg truncate group-hover:text-[#f59e0b] transition-colors">
                      {rest.name}
                    </h3>
                    <span className="flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-md text-xs font-black shrink-0">
                      <Star className="w-3 h-3 fill-emerald-400" /> {rest.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {rest.cuisines}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── All Restaurants Grid ─── */}
        <section className="space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between border-b pb-3 border-white/10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl tracking-wide uppercase">
                {t('restaurantsExplore')}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Showing {filteredRestaurants.length} verified culinary spots
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((rest) => (
                <Link 
                  href={`/explorer/restaurant/${rest.id}`} 
                  key={rest.id} 
                  className={`rounded-3xl overflow-hidden border transition-all duration-300 group cursor-pointer block hover:-translate-y-1.5 shadow-lg ${
                    isLight 
                      ? 'bg-white border-slate-200 hover:border-[#f59e0b]/50 hover:shadow-slate-300/60' 
                      : 'bg-[#0c0e15]/80 border-white/[0.08] hover:border-[#f59e0b]/40 hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)]'
                  }`}
                >
                  <div className="w-full aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={rest.image} 
                      alt={rest.name} 
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_FOOD_IMG; }}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out will-change-transform" 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    
                    {/* Top Overlay Chips */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                      <span className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                        {rest.offer}
                      </span>
                      <span className="bg-black/60 backdrop-blur-md border border-white/15 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {rest.time}
                      </span>
                    </div>

                    {/* Bottom Location */}
                    <div className="absolute bottom-2.5 left-3.5 right-3.5">
                      <span className="text-[11px] text-white/90 truncate flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-[#f59e0b]" /> {rest.location}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-sm sm:text-base truncate group-hover:text-[#f59e0b] transition-colors">
                        {rest.name}
                      </h3>
                      <span className="flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-md text-[11px] font-black shrink-0">
                        <Star className="w-3 h-3 fill-emerald-400" /> {rest.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {rest.cuisines}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20 rounded-3xl border border-white/10 bg-white/[0.02]">
                <Utensils className="w-12 h-12 mx-auto mb-4 text-[#f59e0b]/40" />
                <p className="text-lg font-bold">No culinary spots found</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  We couldn't find any restaurants matching your filters or search query.
                </p>
                <button 
                  onClick={() => { setActiveCategory(null); setSearchQuery(''); }} 
                  className="mt-5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f59e0b]/25 cursor-pointer"
                >
                  Clear Filters & Search
                </button>
              </div>
            )}
          </div>
        </section>

      </main>

    </div>
  );
}
