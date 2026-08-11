'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import ExplorerNav from '@/components/ExplorerNav';
import {
  Compass, Search, Star, Clock, Filter, SlidersHorizontal, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { name: 'Idli', image: '/img/idli.png' },
  { name: 'Dosa', image: '/img/dosa.png' },
  { name: 'Biryani', image: '/img/biryani.png' },
  { name: 'Meals', image: '/img/food_general.png' },
  { name: 'Sweets', image: '/img/desserts.png' },
  { name: 'Snacks', image: '/img/food_general.png' },
  { name: 'Chaat', image: '/img/food_general.png' },
  { name: 'Coffee', image: '/img/coffee.png' },
];

const RESTAURANTS = [
  { id: 1, name: 'Sangeetha Veg Restaurant', rating: 4.8, time: '20-25 mins', cuisines: 'South Indian, Pure Veg', image: '/img/dosa.png', offer: '20% OFF', location: 'T. Nagar, Chennai' },
  { id: 2, name: 'A2B - Adyar Ananda Bhavan', rating: 4.6, time: '15-20 mins', cuisines: 'Sweets, South Indian', image: '/img/desserts.png', offer: 'FREE DELIVERY', location: 'Adyar, Chennai' },
  { id: 3, name: 'Murugan Idli Shop', rating: 4.9, time: '30-35 mins', cuisines: 'South Indian, Breakfast', image: '/img/idli.png', offer: '10% OFF', location: 'Besant Nagar, Chennai' },
  { id: 4, name: 'Dindigul Thalappakatti', rating: 4.7, time: '40-45 mins', cuisines: 'Biryani, South Indian', image: '/img/biryani.png', offer: '20% OFF above ₹400', location: 'Nungambakkam' },
  { id: 5, name: 'Buhari Hotel', rating: 4.5, time: '25-30 mins', cuisines: 'Mughlai, Biryani', image: '/img/biryani.png', offer: '60% OFF', location: 'Mount Road, Chennai' },
  { id: 6, name: 'Junior Kuppanna', rating: 4.4, time: '10-15 mins', cuisines: 'Kongunadu, South Indian', image: '/img/food_general.png', offer: 'Buy 1 Get 1', location: 'Velachery' },
  { id: 7, name: 'Ambur Star Briyani', rating: 4.3, time: '15-25 mins', cuisines: 'Biryani, Fast Food', image: '/img/biryani.png', offer: '20% OFF', location: 'Anna Nagar' },
  { id: 8, name: 'Saravana Bhavan', rating: 4.8, time: '30-40 mins', cuisines: 'South Indian, Pure Veg', image: '/img/dosa.png', offer: 'FREE DESSERT', location: 'Mylapore, Chennai' },
];

export default function ExplorerPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userLocation, setUserLocation] = useState('Fetching Location...');

  useEffect(() => {
    const lat = localStorage.getItem('userLat');
    const lng = localStorage.getItem('userLng');
    if (lat && lng) {
      setUserLocation(`Location: ${Number(lat).toFixed(3)}, ${Number(lng).toFixed(3)}`);
    } else {
      setUserLocation('Default Location');
    }
  }, []);

  const searchResults = searchQuery.trim() === '' ? [] : [
    ...RESTAURANTS.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisines.toLowerCase().includes(searchQuery.toLowerCase())),
    ...CATEGORIES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => ({ id: `cat-${c.name}`, name: c.name, type: 'category', image: c.image }))
  ].slice(0, 6);

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased text-body transition-colors ${
      isLight ? 'bg-[#FAFAFA] text-black' : 'bg-[#111111] text-white'
    }`}>
      <ExplorerNav />
      <div id="menu" className="w-full px-6 py-12 md:px-12 md:py-12 flex flex-col gap-12 relative z-40 transition-colors duration-500">
        
        {/* Sticky Search & Filter Bar */}
        <div className={`sticky top-0 z-50 py-4 -mx-6 px-6 md:-mx-12 md:px-12 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-8 border-b transition-colors duration-500 backdrop-blur-xl ${
          isLight ? 'bg-[#FAFAFA]/95 border-black/10' : 'bg-[#111111]/95 border-white/10'
        }`}>
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="font-display text-3xl md:text-4xl tracking-wide uppercase">Cravings?</h2>
            {userLocation && <span className="text-xs text-[#f8b11c] font-bold mt-1 tracking-widest uppercase">{userLocation}</span>}
          </div>
          
          <div className="flex-1 w-full max-w-3xl relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for restaurants, cuisines, or dishes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className={`w-full border rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none transition-colors ${
                isLight ? 'bg-black/5 border-black/10 focus:border-[#f8b11c] focus:bg-white placeholder:text-gray-500 text-black' : 'bg-white/5 border-white/10 focus:border-[#f8b11c] focus:bg-white/10 placeholder:text-gray-500 text-white'
              }`}
            />

            {/* Autocomplete Popup */}
            <AnimatePresence>
              {isSearchFocused && searchQuery.trim() !== '' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border overflow-hidden z-50 ${
                    isLight ? 'bg-white border-black/10' : 'bg-[#1a1a1a] border-white/10'
                  }`}
                >
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result: any, idx: number) => (
                        <Link 
                          href={result.type === 'category' ? '#' : `/restaurant/${result.id}`} 
                          key={result.id || idx}
                          onClick={() => setIsSearchFocused(false)}
                          className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                            isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                            <img src={result.image || '/img/food_general.png'} alt={result.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-sm truncate ${isLight ? 'text-black' : 'text-white'}`}>{result.name}</h4>
                            <p className={`text-xs truncate ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                              {result.type === 'category' ? 'Category' : `${result.cuisines} • ${result.location}`}
                            </p>
                          </div>
                          {result.type !== 'category' && (
                            <div className="flex items-center gap-1 bg-green-700/20 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              <Star className="w-2.5 h-2.5 fill-green-400" /> {result.rating}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Search className={`w-8 h-8 mx-auto mb-3 opacity-20 ${isLight ? 'text-black' : 'text-white'}`} />
                      <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>No results found for "{searchQuery}"</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full lg:w-auto flex justify-center lg:justify-end gap-3">
            <button className={`flex items-center gap-2 px-5 py-3 rounded-full border text-xs font-bold tracking-widest uppercase transition-colors ${
              isLight ? 'border-black/10 bg-black/5 hover:bg-black/10 text-black' : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
            }`}>
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button className={`flex items-center gap-2 px-5 py-3 rounded-full border text-xs font-bold tracking-widest uppercase transition-colors ${
              isLight ? 'border-black/10 bg-black/5 hover:bg-black/10 text-black' : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
            }`}>
              <SlidersHorizontal className="w-4 h-4" /> Sort
            </button>
          </div>
        </div>

        {/* Categories */}
        <section className="space-y-6">
          <h3 className={`font-display text-2xl md:text-3xl tracking-wide uppercase ${isLight ? 'text-black/90' : 'text-white/90'}`}>What's on your mind?</h3>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 shrink-0 snap-center group cursor-pointer w-24 md:w-32">
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border overflow-hidden transition-colors duration-[400ms] relative shadow-lg ${
                  isLight ? 'bg-white border-black/10 group-hover:border-black/30' : 'bg-[#1A1A1A] border-white/5 group-hover:border-white/30'
                }`}>
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform" loading="lazy" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-[400ms]"></div>
                </div>
                <span className={`text-xs md:text-sm font-bold tracking-wider uppercase transition-colors duration-[400ms] text-center ${
                  isLight ? 'text-gray-600 group-hover:text-black' : 'text-gray-400 group-hover:text-white'
                }`}>{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Top Chains Carousel */}
        <section className="space-y-6">
          <h3 className={`font-display text-2xl md:text-3xl tracking-wide uppercase ${isLight ? 'text-black/90' : 'text-white/90'}`}>Top restaurant chains near you</h3>
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
                  <h4 className={`font-bold text-base md:text-lg truncate transition-colors duration-[400ms] ${
                    isLight ? 'text-black/90 group-hover:text-black' : 'text-white/90 group-hover:text-white'
                  }`}>{rest.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs md:text-sm font-medium">
                    <span className="flex items-center gap-1 bg-green-700/20 text-green-400 px-2 py-0.5 rounded"><Star className="w-3 h-3 fill-green-400" /> {rest.rating}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span className={`flex items-center gap-1 ${isLight ? 'text-gray-600' : 'text-gray-300'}`}><Clock className="w-3.5 h-3.5" /> {rest.time}</span>
                  </div>
                  <p className={`text-xs md:text-sm mt-1 truncate ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>{rest.cuisines}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Restaurants Grid */}
        <section className="space-y-6">
          <h3 className={`font-display text-2xl md:text-3xl tracking-wide uppercase border-b pb-4 ${
            isLight ? 'text-black/90 border-black/10' : 'text-white/90 border-white/10'
          }`}>Restaurants to explore right now</h3>
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
                    <h4 className={`font-bold text-base md:text-lg truncate transition-colors duration-[400ms] ${
                      isLight ? 'text-black/90 group-hover:text-black' : 'text-white/90 group-hover:text-white'
                    }`}>{rest.name}</h4>
                    <span className="flex items-center gap-1 bg-green-700/20 text-green-400 px-1.5 py-0.5 rounded text-xs shrink-0 mt-0.5">
                      <Star className="w-3 h-3 fill-green-400" /> {rest.rating}
                    </span>
                  </div>
                  <p className={`text-xs md:text-sm mt-1 truncate ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>{rest.cuisines} • {rest.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
