'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import {
  Compass,
  Building2,
  Sparkles,
  MapPin,
  Flame,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Radio,
  Clock,
  Play,
  Check,
  ChevronRight,
  ShoppingBag,
  Heart,
  Utensils,
  Award,
  Search,
  Sun,
  Moon,
} from 'lucide-react';

const FEATURED_DISHES = [
  {
    id: 'dish-1',
    title: "Chef's Secret Smoked Biryani",
    category: 'Biryani',
    rating: 4.9,
    reviews: '2.4k',
    price: 340,
    prepTime: '20 mins',
    tag: 'Secret Special',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
    restaurant: 'Grand Secret Kitchen',
  },
  {
    id: 'dish-2',
    title: 'Truffle Mushroom Artisan Pizza',
    category: 'Pizza',
    rating: 4.8,
    reviews: '1.8k',
    price: 390,
    prepTime: '18 mins',
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop',
    restaurant: 'Café De Quietude',
  },
  {
    id: 'dish-3',
    title: 'Secret Cheese Smash Burger',
    category: 'Burger',
    rating: 4.7,
    reviews: '950',
    price: 180,
    prepTime: '12 mins',
    tag: 'Chef Choice',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
    restaurant: 'Alleyway Street Bakes',
  },
  {
    id: 'dish-4',
    title: 'Crispy Mysore Masala Dosa',
    category: 'Dosa',
    rating: 4.9,
    reviews: '3.1k',
    price: 110,
    prepTime: '10 mins',
    tag: 'Traditional',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop',
    restaurant: 'Alleyway Street Bakes',
  },
];

const CATEGORIES = [
  { name: 'All Dishes', icon: '🍽️' },
  { name: 'Secret Menu', icon: '🔥' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Biryani', icon: '🍲' },
  { name: 'Burger', icon: '🍔' },
  { name: 'Dosa', icon: '🥞' },
  { name: 'Desserts', icon: '🍰' },
];

export default function WorldClassLandingPage() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const [selectedCategory, setSelectedCategory] = useState('All Dishes');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeDishIndex, setActiveDishIndex] = useState(0);

  // Real-time Mouse Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDishIndex((prev) => (prev + 1) % FEATURED_DISHES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeDish = FEATURED_DISHES[activeDishIndex];

  return (
    <div className={`min-h-screen text-body overflow-x-hidden relative selection:bg-[#D62828] selection:text-white transition-colors ${
      isLight ? 'bg-[#FFF8F1] text-[#1F2937]' : 'bg-[#05070D] text-white'
    }`}>
      {/* 🌌 Background Lighting Blur Orb */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-gradient-to-b blur-[160px] pointer-events-none rounded-full ${
        isLight ? 'from-[#D62828]/12 via-[#F77F00]/8 to-transparent' : 'from-[#FFB703]/15 via-[#d97706]/10 to-transparent'
      }`} />

      {/* Glassmorphic Sticky Header Bar */}
      <header className={`h-20 border-b px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50 transition-colors ${
        isLight ? 'glass-header bg-[#FFF8F1]/85 border-black/8' : 'bg-[#05070D]/90 border-[#131A2C]'
      }`}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`w-10 h-10 rounded-2xl overflow-hidden border shadow-md group-hover:scale-105 transition-transform ${
            isLight ? 'border-[#D62828]/40 bg-white' : 'border-[#FFB703]/40 bg-black'
          }`}>
            <img src="/logo.png" alt="Hidden Eats Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-card-title text-base group-hover:text-[#D62828] dark:group-hover:text-[#FFB703] transition-colors block">
              HIDDEN EATS
            </span>
            <span className={`text-label text-[10px] block ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`}>
              Secret Food Discovery
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs">
          <a href="#menu-showcase" className="text-label hover:text-[#D62828] dark:hover:text-[#FFB703] transition-colors">Menu Showcase</a>
          <a href="#secret-specials" className="text-label hover:text-[#D62828] dark:hover:text-[#FFB703] transition-colors">Secret Specials</a>
          <a href="#how-it-works" className="text-label hover:text-[#D62828] dark:hover:text-[#FFB703] transition-colors">How It Works</a>
          <Link href="/legal/terms" className="text-label hover:text-[#D62828] dark:hover:text-[#FFB703] transition-colors">Legal Terms</Link>
        </div>

        {/* Action Buttons & Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-2xl border transition-all shadow-sm hover-lift ${
              isLight
                ? 'bg-white border-black/8 text-[#1F2937] hover:bg-[#FFF8F1]'
                : 'bg-[#131A2C] border-[#23314a] text-white hover:bg-[#05070D]'
            }`}
            title="Toggle Light / Dark Theme"
          >
            {isLight ? <Moon className="w-4 h-4 text-[#D62828]" /> : <Sun className="w-4 h-4 text-[#FFB703]" />}
          </button>

          <Link
            href="/login"
            className={`px-4.5 py-2.5 text-label text-xs rounded-2xl border shadow-sm transition-all hover-lift ${
              isLight
                ? 'bg-white border-black/8 text-[#1F2937] hover:bg-[#FFF3E8]'
                : 'bg-[#131A2C] border-[#23314a] text-white hover:bg-[#05070D]'
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/login/user"
            className={`px-5 py-2.5 text-label text-xs rounded-2xl shadow-lg transition-all hover-lift hover:scale-105 ${
              isLight
                ? 'bg-[#D62828] hover:bg-[#B91C1C] text-white shadow-[#D62828]/25'
                : 'bg-[#FFB703] hover:bg-[#d97706] text-black font-bold shadow-[#FFB703]/25'
            }`}
          >
            Explore Spots →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 animate-fade-in">
        {/* Left Content */}
        <div className="space-y-6">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-label text-xs shadow-sm ${
            isLight ? 'bg-[#FFF3E8] border-[#D62828]/30 text-[#D62828]' : 'bg-[#1e1708] border-[#FFB703]/30 text-[#FFB703]'
          }`}>
            <Sparkles className="w-4 h-4" />
            <span>EXPLICIT SECRET DISH DISCOVERY</span>
          </div>

          <h1 className="text-hero text-4xl sm:text-6xl tracking-tight leading-[1.1]">
            Taste Delicious <br />
            <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
              isLight
                ? 'from-[#D62828] via-[#F77F00] to-[#B91C1C]'
                : 'from-[#FFB703] via-[#fbbf24] to-[#d97706]'
            }`}>
              Secret Off-Menu Dishes
            </span> <br />
            From Top Local Chefs.
          </h1>

          <p className="text-body text-sm sm:text-base opacity-80 max-w-xl leading-relaxed">
            Discover unlisted restaurant specials, real-time wait-time radar, and direct table seat pre-ordering with zero middleman commissions.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search secret dishes (e.g. Biryani, Truffle Pizza)..."
              className={`w-full border rounded-2xl pl-4 pr-32 py-3.5 text-body text-xs outline-none shadow-sm ${
                isLight
                  ? 'bg-white border-black/8 text-[#1F2937] focus:border-[#D62828]'
                  : 'bg-[#131A2C] border-[#23314a] text-white focus:border-[#FFB703]'
              }`}
            />
            <Link
              href="/explorer"
              className={`absolute right-2 top-2 bottom-2 px-5 text-label text-xs rounded-xl flex items-center gap-1.5 transition-all hover-lift ${
                isLight
                  ? 'bg-[#D62828] hover:bg-[#B91C1C] text-white'
                  : 'bg-[#FFB703] hover:bg-[#d97706] text-black font-bold'
              }`}
            >
              <Search className="w-3.5 h-3.5" /> Search
            </Link>
          </div>

          {/* Stats Bar */}
          <div className={`flex items-center gap-8 pt-4 border-t ${isLight ? 'border-black/8' : 'border-[#23314a]'}`}>
            <div>
              <span className="text-section-heading text-2xl block">14k+</span>
              <span className="text-body text-xs opacity-70">Happy Diners</span>
            </div>
            <div>
              <span className={`text-section-heading text-2xl block ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`}>4.9 ★</span>
              <span className="text-body text-xs opacity-70">Verified Rating</span>
            </div>
            <div>
              <span className="text-section-heading text-2xl text-[#16A34A] dark:text-[#10b981] block">120+</span>
              <span className="text-body text-xs opacity-70">Partner Kitchens</span>
            </div>
          </div>
        </div>

        {/* Right 3D Interactive Dish Showcase */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
          className="perspective-1000 relative"
        >
          <div
            style={{
              transform: `rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)`,
              transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className={`border rounded-3xl p-6 shadow-2xl relative group transform-gpu ${
              isLight
                ? 'border-black/8 bg-gradient-to-b from-white to-[#FFF3E8] shadow-[#D62828]/10'
                : 'border-[#23314a] bg-gradient-to-b from-[#131A2C] to-[#05070D] shadow-[#FFB703]/10'
            }`}
          >
            {/* Featured Dish Card Image */}
            <div className={`relative h-80 rounded-2xl overflow-hidden border ${isLight ? 'border-black/8' : 'border-[#23314a]'}`}>
              <img
                src={activeDish.image}
                alt={activeDish.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Tag Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 text-label text-[10px] rounded-full uppercase shadow-md ${
                  isLight ? 'bg-[#D62828] text-white' : 'bg-[#FFB703] text-black font-bold'
                }`}>
                  🔥 {activeDish.tag}
                </span>
              </div>

              {/* Bottom Dish Info */}
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <span className={`text-label text-[11px] block ${isLight ? 'text-[#FFB703]' : 'text-[#FFB703]'}`}>
                  {activeDish.restaurant}
                </span>
                <h3 className="text-card-title text-xl text-white leading-tight">
                  {activeDish.title}
                </h3>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-price text-lg text-[#16A34A] dark:text-[#10b981]">₹{activeDish.price}</span>
                  <Link
                    href="/explorer"
                    className={`px-4 py-2 text-label text-xs rounded-xl shadow-lg hover-lift flex items-center gap-1.5 ${
                      isLight ? 'bg-[#D62828] text-white' : 'bg-[#FFB703] text-black font-bold'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Order Dish
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating Rating Pill */}
            <div className={`absolute -top-4 -right-4 border px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce ${
              isLight ? 'bg-white border-black/8' : 'bg-[#131A2C] border-[#23314a]'
            }`}>
              <Star className="w-4 h-4 text-[#FFB703] fill-[#FFB703]" />
              <div>
                <span className="text-card-title text-xs block">{activeDish.rating} Score</span>
                <span className="text-body text-[9px] opacity-70">{activeDish.reviews} reviews</span>
              </div>
            </div>

            {/* Floating Prep Time Pill */}
            <div className={`absolute -bottom-4 -left-4 border px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 ${
              isLight ? 'bg-white border-black/8' : 'bg-[#131A2C] border-[#23314a]'
            }`}>
              <Clock className="w-4 h-4 text-[#16A34A] dark:text-[#10b981]" />
              <div>
                <span className="text-label text-xs block">Prep: {activeDish.prepTime}</span>
                <span className="text-body text-[9px] opacity-70">Live Wait Time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🍽️ Category Filter Bar */}
      <section id="menu-showcase" className={`max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t space-y-8 ${
        isLight ? 'border-black/8' : 'border-[#23314a]'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className={`text-label text-[10px] uppercase tracking-widest ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`}>EXPLORE CATEGORIES</span>
            <h2 className="text-section-heading text-3xl">Popular Craving Menus</h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-2xl text-label text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.name
                    ? isLight
                      ? 'bg-[#D62828] text-white shadow-lg shadow-[#D62828]/25 scale-105'
                      : 'bg-[#FFB703] text-black font-bold shadow-lg shadow-[#FFB703]/25 scale-105'
                    : isLight
                    ? 'bg-white border border-black/8 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF3E8]'
                    : 'bg-[#131A2C] border border-[#23314a] text-[#888888] hover:text-white hover:bg-[#05070D]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_DISHES.map((dish) => (
            <div
              key={dish.id}
              className={`border rounded-2xl p-4 space-y-3 hover-lift group shadow-sm hover:shadow-md transition-shadow ${
                isLight ? 'bg-white border-black/8' : 'bg-[#131A2C] border-[#23314a]'
              }`}
            >
              <div className={`relative h-44 rounded-xl overflow-hidden border ${isLight ? 'border-black/5' : 'border-[#23314a]'}`}>
                <img
                  src={dish.image}
                  alt={dish.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-2.5 left-2.5 text-label text-[9px] border px-2 py-0.5 rounded-md shadow-sm ${
                  isLight ? 'bg-white text-[#1F2937] border-black/8' : 'bg-[#05070D] text-white border-[#23314a]'
                }`}>
                  ★ {dish.rating}
                </span>
              </div>

              <div className="space-y-1">
                <span className={`text-label text-[10px] block ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`}>{dish.restaurant}</span>
                <h3 className="text-card-title text-sm truncate">{dish.title}</h3>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-price text-xs text-[#16A34A] dark:text-[#10b981]">₹{dish.price}</span>
                  <span className="text-body text-[10px] opacity-70">⏱ {dish.prepTime}</span>
                </div>
              </div>

              <Link
                href="/explorer"
                className={`w-full py-2.5 text-label text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 ${
                  isLight ? 'bg-[#D62828] hover:bg-[#B91C1C] text-white' : 'bg-[#FFB703] hover:bg-[#d97706] text-black font-bold'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Pre-Order Dish
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 Secret Off-Menu Banner */}
      <section id="secret-specials" className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className={`border rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-sm ${
          isLight
            ? 'border-[#D62828]/20 bg-gradient-to-r from-[#FFF3E8] via-[#FFEBE0] to-[#FFF8F1]'
            : 'border-[#382607] bg-gradient-to-r from-[#241a08] via-[#0d0a04] to-[#05070D]'
        }`}>
          <div className="space-y-3 text-center sm:text-left">
            <span className={`text-label text-[10px] uppercase tracking-widest ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`}>EXCLUSIVE DINER SPECIALS</span>
            <h2 className="text-section-heading text-3xl">Unlock Unlisted Chef Off-Menu Specials</h2>
            <p className="text-body text-xs opacity-80 max-w-xl">
              Access limited-quantity secret dishes crafted by award-winning chefs exclusively for authenticated diners.
            </p>
          </div>
          <Link
            href="/login/user"
            className={`px-8 py-4 text-label text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all shrink-0 hover-lift flex items-center gap-2 ${
              isLight ? 'bg-[#D62828] hover:bg-[#B91C1C] text-white shadow-[#D62828]/20' : 'bg-[#FFB703] hover:bg-[#d97706] text-black font-bold shadow-[#FFB703]/20'
            }`}
          >
            <Compass className="w-4 h-4" /> Explore Secret Menus →
          </Link>
        </div>
      </section>

      {/* 🚀 How It Works */}
      <section id="how-it-works" className={`max-w-7xl mx-auto px-6 lg:px-12 py-16 border-t space-y-12 ${
        isLight ? 'border-black/8' : 'border-[#23314a]'
      }`}>
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className={`text-label text-[10px] uppercase tracking-widest ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`}>3-STEP WORKFLOW</span>
          <h2 className="text-section-heading text-3xl">How Hidden Eats Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`border rounded-2xl p-6 space-y-4 hover-lift shadow-sm ${
            isLight ? 'bg-white border-black/8' : 'bg-[#131A2C] border-[#23314a]'
          }`}>
            <span className={`w-8 h-8 rounded-full text-label text-sm flex items-center justify-center ${
              isLight ? 'bg-[#D62828] text-white' : 'bg-[#FFB703] text-black font-bold'
            }`}>
              1
            </span>
            <h3 className="text-card-title text-lg">Discover Secret Spots</h3>
            <p className="text-body text-xs opacity-70">Use live GPS proximity search to uncover hidden culinary gems around you.</p>
          </div>

          <div className={`border rounded-2xl p-6 space-y-4 hover-lift shadow-sm ${
            isLight ? 'bg-white border-black/8' : 'bg-[#131A2C] border-[#23314a]'
          }`}>
            <span className={`w-8 h-8 rounded-full text-label text-sm flex items-center justify-center ${
              isLight ? 'bg-[#D62828] text-white' : 'bg-[#FFB703] text-black font-bold'
            }`}>
              2
            </span>
            <h3 className="text-card-title text-lg">Unlock Off-Menu Items</h3>
            <p className="text-body text-xs opacity-70">Claim secret specials prepared exclusively by partner chefs for authenticated diners.</p>
          </div>

          <div className={`border rounded-2xl p-6 space-y-4 hover-lift shadow-sm ${
            isLight ? 'bg-white border-black/8' : 'bg-[#131A2C] border-[#23314a]'
          }`}>
            <span className={`w-8 h-8 rounded-full text-label text-sm flex items-center justify-center ${
              isLight ? 'bg-[#D62828] text-white' : 'bg-[#FFB703] text-black font-bold'
            }`}>
              3
            </span>
            <h3 className="text-card-title text-lg">Reserve & Pre-Order</h3>
            <p className="text-body text-xs opacity-70">Reserve table seats and pre-order dishes directly with zero middleman commissions.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 text-center text-xs space-y-3 ${isLight ? 'border-black/8' : 'border-[#23314a]'}`}>
        <div className="flex justify-center gap-6">
          <Link href="/login/user" className="hover:text-[#D62828] dark:hover:text-[#FFB703] transition-colors text-label">Diner Portal</Link>
          <Link href="/login/partner" className="hover:text-[#D62828] dark:hover:text-[#FFB703] transition-colors text-label">Partner Studio</Link>
          <Link href="/legal/terms" className="hover:text-[#D62828] dark:hover:text-[#FFB703] transition-colors text-label">Terms & Compliance</Link>
        </div>
        <p className="text-body text-xs opacity-70">© 2026 Hidden Eats Inc. Secret Food Discovery Platform. Compliant with FSSAI & IT Act 2000 Norms.</p>
      </footer>
    </div>
  );
}
