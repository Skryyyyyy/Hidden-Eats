'use client';

import React, { useState } from 'react';
import { 
  Search, UtensilsCrossed, Power, PowerOff, Filter, Plus, Sparkles, Check, X, 
  Minus, Flame, Clock, TrendingUp, AlertTriangle, DollarSign, ChefHat, Tag, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sanitizeInput } from '@/lib/security';

const FALLBACK_DISH_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  foodCost: number;
  isVeg: boolean;
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  prepTime: string;
  isAvailable: boolean;
  isSecretItem: boolean;
  batchRemaining: number;
  maxBatch: number;
  ordersCountToday: number;
  image: string;
};

const initialMenu: MenuItem[] = [
  {
    id: '1',
    name: 'Smoked Mutton Dum Biryani',
    category: 'Biryani',
    price: 340,
    foodCost: 98,
    isVeg: false,
    spiceLevel: 'Hot',
    prepTime: '25 mins',
    isAvailable: true,
    isSecretItem: true,
    batchRemaining: 8,
    maxBatch: 15,
    ordersCountToday: 7,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Black Garlic Smoked Wings',
    category: 'Starters',
    price: 320,
    foodCost: 85,
    isVeg: false,
    spiceLevel: 'Medium',
    prepTime: '18 mins',
    isAvailable: true,
    isSecretItem: true,
    batchRemaining: 4,
    maxBatch: 12,
    ordersCountToday: 8,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'Truffle Butter Ghee Roast Dosa',
    category: 'Breads & Dosas',
    price: 190,
    foodCost: 45,
    isVeg: true,
    spiceLevel: 'Mild',
    prepTime: '12 mins',
    isAvailable: true,
    isSecretItem: false,
    batchRemaining: 18,
    maxBatch: 30,
    ordersCountToday: 12,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    name: 'Chettinad Brain Fry',
    category: 'Curries',
    price: 280,
    foodCost: 80,
    isVeg: false,
    spiceLevel: 'Extra Hot',
    prepTime: '20 mins',
    isAvailable: false,
    isSecretItem: true,
    batchRemaining: 0,
    maxBatch: 10,
    ordersCountToday: 10,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '5',
    name: 'Filter Coffee Panna Cotta',
    category: 'Desserts',
    price: 150,
    foodCost: 35,
    isVeg: true,
    spiceLevel: 'Mild',
    prepTime: '8 mins',
    isAvailable: true,
    isSecretItem: false,
    batchRemaining: 15,
    maxBatch: 20,
    ordersCountToday: 5,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '6',
    name: 'Malabar Lobster Pepper Roast',
    category: 'Starters',
    price: 620,
    foodCost: 210,
    isVeg: false,
    spiceLevel: 'Hot',
    prepTime: '28 mins',
    isAvailable: true,
    isSecretItem: true,
    batchRemaining: 3,
    maxBatch: 8,
    ordersCountToday: 5,
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '7',
    name: 'Guntur Chili Paneer Tikka',
    category: 'Starters',
    price: 240,
    foodCost: 60,
    isVeg: true,
    spiceLevel: 'Hot',
    prepTime: '15 mins',
    isAvailable: true,
    isSecretItem: false,
    batchRemaining: 12,
    maxBatch: 20,
    ordersCountToday: 8,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '8',
    name: 'Charcoal Smoked Hyderabadi Haleem',
    category: 'Biryani',
    price: 360,
    foodCost: 105,
    isVeg: false,
    spiceLevel: 'Medium',
    prepTime: '22 mins',
    isAvailable: true,
    isSecretItem: true,
    batchRemaining: 6,
    maxBatch: 15,
    ordersCountToday: 9,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '9',
    name: 'Saffron Tender Coconut Payasam',
    category: 'Desserts',
    price: 170,
    foodCost: 40,
    isVeg: true,
    spiceLevel: 'Mild',
    prepTime: '6 mins',
    isAvailable: true,
    isSecretItem: false,
    batchRemaining: 9,
    maxBatch: 25,
    ordersCountToday: 16,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '10',
    name: 'Slow-Cooked Truffle Dal Makhani',
    category: 'Curries',
    price: 260,
    foodCost: 65,
    isVeg: true,
    spiceLevel: 'Mild',
    prepTime: '18 mins',
    isAvailable: true,
    isSecretItem: false,
    batchRemaining: 14,
    maxBatch: 25,
    ordersCountToday: 11,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
  },
];

const CATEGORIES = [
  'All Items',
  'Secret Vault Items',
  'Biryani',
  'Starters',
  'Breads & Dosas',
  'Curries',
  'Desserts',
  'Sold Out (86\'d)',
];

function DietarySymbol({ isVeg }: { isVeg: boolean }) {
  return (
    <div 
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center shrink-0 ${
        isVeg ? 'border-emerald-500 bg-emerald-950/30' : 'border-rose-600 bg-rose-950/30'
      }`}
    >
      {isVeg ? (
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      ) : (
        <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-rose-600" />
      )}
    </div>
  );
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [addModal, setAddModal] = useState(false);

  // New Dish Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Biryani');
  const [newPrice, setNewPrice] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newBatch, setNewBatch] = useState('15');
  const [newPrepTime, setNewPrepTime] = useState('20 mins');
  const [newSpice, setNewSpice] = useState<'Mild' | 'Medium' | 'Hot' | 'Extra Hot'>('Medium');
  const [newIsVeg, setNewIsVeg] = useState(false);
  const [isSecret, setIsSecret] = useState(false);

  // Stats
  const totalItems = menuItems.length;
  const secretItemsCount = menuItems.filter((i) => i.isSecretItem).length;
  const soldOutCount = menuItems.filter((i) => !i.isAvailable).length;
  const lowStockCount = menuItems.filter((i) => i.isAvailable && i.batchRemaining > 0 && i.batchRemaining <= 4).length;
  const totalPortionsRemaining = menuItems.reduce((acc, i) => acc + (i.isAvailable ? i.batchRemaining : 0), 0);
  const totalOrdersToday = menuItems.reduce((acc, i) => acc + i.ordersCountToday, 0);
  const estimatedRevenue = menuItems.reduce((acc, i) => acc + (i.ordersCountToday * i.price), 0);

  const toggleAvailability = (id: string) => {
    setMenuItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const nextAvail = !item.isAvailable;
          return {
            ...item,
            isAvailable: nextAvail,
            batchRemaining: nextAvail && item.batchRemaining <= 0 ? (item.maxBatch || 10) : item.batchRemaining,
          };
        }
        return item;
      })
    );
  };

  const adjustBatchStock = (id: string, delta: number) => {
    setMenuItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const current = item.batchRemaining || 0;
          const updated = Math.max(0, current + delta);
          return {
            ...item,
            batchRemaining: updated,
            isAvailable: updated > 0,
          };
        }
        return item;
      })
    );
  };

  const toggleSecretItem = (id: string) => {
    setMenuItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isSecretItem: !item.isSecretItem } : item
      )
    );
  };

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    const batch = Number(newBatch) || 15;
    const priceNum = Number(newPrice);
    const costNum = Number(newCost) || Math.round(priceNum * 0.3);

    const newItem: MenuItem = {
      id: `m-${Date.now()}`,
      name: sanitizeInput(newName),
      category: sanitizeInput(newCategory),
      price: priceNum,
      foodCost: costNum,
      isVeg: newIsVeg,
      spiceLevel: newSpice,
      prepTime: newPrepTime || '20 mins',
      isAvailable: true,
      isSecretItem: isSecret,
      batchRemaining: batch,
      maxBatch: batch,
      ordersCountToday: 0,
      image: FALLBACK_DISH_IMG,
    };

    setMenuItems([newItem, ...menuItems]);
    setAddModal(false);
    setNewName('');
    setNewPrice('');
    setNewCost('');
    setIsSecret(false);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'All Items') return true;
    if (selectedCategory === 'Secret Vault Items') return item.isSecretItem;
    if (selectedCategory === "Sold Out (86'd)") return !item.isAvailable;
    return item.category === selectedCategory;
  });

  return (
    <div className="w-full space-y-6 pb-12 animate-fade-in text-white selection:bg-[#f59e0b] selection:text-black">
      
      {/* ─── 1. Real-Time Operational Pulse / Restaurant KPI Bar ─── */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Live Orders */}
        <div className="bg-[#10131a]/85 border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Today's Orders</span>
            <UtensilsCrossed className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="mt-2">
            <span className="font-display text-2xl sm:text-3xl text-white">{totalOrdersToday}</span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">Active kitchen load</span>
          </div>
        </div>

        {/* Metric 2: Estimated Revenue */}
        <div className="bg-[#10131a]/85 border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gross Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="font-display text-2xl sm:text-3xl text-emerald-400">₹{estimatedRevenue.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">+14% vs yesterday</span>
          </div>
        </div>

        {/* Metric 3: Vault Portions Left */}
        <div className="bg-[#10131a]/85 border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Batch Portions</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="font-display text-2xl sm:text-3xl text-white">{totalPortionsRemaining}</span>
            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">Across in-stock menu</span>
          </div>
        </div>

        {/* Metric 4: Secret Vault Dishes */}
        <div className="bg-[#10131a]/85 border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Secret Vault</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <span className="font-display text-2xl sm:text-3xl text-purple-300">{secretItemsCount}</span>
            <span className="text-[10px] text-purple-400 font-bold block mt-0.5">VIP Off-Menu items</span>
          </div>
        </div>

        {/* Metric 5: Low Stock Alerts */}
        <div className="bg-[#10131a]/85 border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Low Stock (&lt;5)</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2">
            <span className="font-display text-2xl sm:text-3xl text-orange-400">{lowStockCount}</span>
            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">Needs prep soon</span>
          </div>
        </div>

        {/* Metric 6: 86'd / Sold Out */}
        <div className="bg-[#10131a]/85 border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">86'd Items</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <span className="font-display text-2xl sm:text-3xl text-rose-400">{soldOutCount}</span>
            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">Unavailable to diners</span>
          </div>
        </div>
      </section>

      {/* ─── 2. Search, Controls & Add Dish Header ─── */}
      <section className="bg-[#0e1119]/80 border border-white/[0.08] p-4 sm:p-5 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-[#f59e0b] uppercase tracking-widest bg-[#f59e0b]/10 border border-[#f59e0b]/25 px-2 py-0.5 rounded-full">
              Live Kitchen POS & Vault
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">
              Ambur Star Biryani • Branch #01
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-white">
            Dish Inventory & Batch Decrement
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f59e0b]" />
            <input
              type="text"
              placeholder="Search dishes by name, cuisine, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.09] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#f59e0b] focus:bg-white/[0.06] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs bg-white/10 w-4 h-4 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => setAddModal(true)}
            className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black px-4 sm:px-5 py-2.5 rounded-2xl font-black uppercase tracking-wider text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shrink-0 shadow-lg shadow-[#f59e0b]/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Dish To Vault
          </button>
        </div>
      </section>

      {/* ─── 3. Category Filter Tabs ─── */}
      <section className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shrink-0 transition-all border ${
                isSelected
                  ? 'bg-[#f59e0b] text-black border-[#f59e0b] shadow-md shadow-[#f59e0b]/20 font-black'
                  : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06] border-white/[0.07]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </section>

      {/* ─── 4. Full-Screen Edge-to-Edge Menu Items Grid ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {filteredItems.map((item) => {
          const marginPercent = Math.round(((item.price - item.foodCost) / item.price) * 100);
          const isLowStock = item.isAvailable && item.batchRemaining > 0 && item.batchRemaining <= 4;
          const batchPercent = item.maxBatch ? Math.min(100, Math.round((item.batchRemaining / item.maxBatch) * 100)) : 100;

          return (
            <motion.div
              layout
              key={item.id}
              className={`bg-[#0d1017]/90 rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-xl group hover:shadow-2xl ${
                !item.isAvailable 
                  ? 'border-rose-500/30 opacity-75' 
                  : isLowStock
                    ? 'border-orange-500/40 shadow-orange-500/5'
                    : 'border-white/[0.08] hover:border-[#f59e0b]/40'
              }`}
            >
              {/* Cover Image & Badges */}
              <div>
                <div className="h-44 w-full relative overflow-hidden bg-[#151922]">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_DISH_IMG; }}
                    className={`w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 will-change-transform ${
                      !item.isAvailable ? 'grayscale opacity-40' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-transparent to-black/40" />
                  
                  {/* Top-Left Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {!item.isAvailable ? (
                      <span className="bg-rose-600 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                        Sold Out (86'd)
                      </span>
                    ) : isLowStock ? (
                      <span className="bg-orange-500 text-black px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg animate-pulse">
                        ⚠️ Low: {item.batchRemaining} Left
                      </span>
                    ) : (
                      <span className="bg-black/75 backdrop-blur-md border border-white/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                        🔥 {item.batchRemaining} Left
                      </span>
                    )}

                    {item.isSecretItem && (
                      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-200" /> Secret Vault
                      </span>
                    )}
                  </div>

                  {/* Top-Right Prep Time Chip */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/75 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#f59e0b]" /> {item.prepTime}
                    </span>
                  </div>

                  {/* Bottom Image Overlay: Price & Dietary Tag */}
                  <div className="absolute bottom-2.5 left-3.5 right-3.5 flex justify-between items-end">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#f59e0b] bg-black/60 px-2 py-0.5 rounded-md border border-[#f59e0b]/20">
                      {item.category}
                    </span>
                    <span className="font-display text-2xl text-white drop-shadow-md">
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <DietarySymbol isVeg={item.isVeg} />
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate group-hover:text-[#f59e0b] transition-colors">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  {/* Real Restaurant Financial & Spice Metadata */}
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium pt-1 border-t border-white/[0.06]">
                    <span className="flex items-center gap-1" title="Profitability Margin">
                      <span className="text-emerald-400 font-bold">{marginPercent}% Margin</span>
                      <span className="text-gray-500">(Cost ₹{item.foodCost})</span>
                    </span>
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                      🌶️ {item.spiceLevel}
                    </span>
                  </div>

                  {/* Live Limited Batch Stock Decrementer */}
                  <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">
                          Shift Batch Stock
                        </span>
                        <span className="font-black text-white text-xs">
                          {item.batchRemaining} / {item.maxBatch || 15} Portions
                        </span>
                      </div>

                      {/* Increment / Decrement Stepper */}
                      <div className="flex items-center gap-1 bg-black/60 border border-white/10 rounded-xl p-1">
                        <button
                          onClick={() => adjustBatchStock(item.id, -1)}
                          disabled={(item.batchRemaining || 0) <= 0}
                          title="Decrement 1 portion"
                          className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 text-white font-black flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono font-bold text-white text-xs">{item.batchRemaining || 0}</span>
                        <button
                          onClick={() => adjustBatchStock(item.id, 1)}
                          title="Increment 1 portion"
                          className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/15 text-white font-black flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Visual Remaining Gauge Bar */}
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          !item.isAvailable 
                            ? 'bg-rose-500' 
                            : isLowStock 
                              ? 'bg-orange-500' 
                              : 'bg-gradient-to-r from-[#f59e0b] to-emerald-400'
                        }`}
                        style={{ width: `${batchPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action Buttons */}
              <div className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.08]">
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`py-2 rounded-xl font-black uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      item.isAvailable
                        ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                    }`}
                  >
                    {item.isAvailable ? <PowerOff className="w-3 h-3" /> : <Power className="w-3 h-3" />}
                    {item.isAvailable ? "86'd Dish" : 'Make Active'}
                  </button>

                  <button
                    onClick={() => toggleSecretItem(item.id)}
                    className={`py-2 rounded-xl font-black uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      item.isSecretItem
                        ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/40'
                        : 'bg-white/[0.04] text-gray-400 hover:text-white border border-white/[0.08]'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-[#f59e0b]" />
                    {item.isSecretItem ? 'Secret Vault' : 'Regular'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ─── 5. Add New Dish Modal (Full Restaurant Form) ─── */}
      <AnimatePresence>
        {addModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0e111a] border border-white/[0.1] rounded-3xl p-6 sm:p-8 space-y-5 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-display uppercase tracking-tight text-white">Add New Dish To Vault</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Configure live inventory, pricing, and secret menu status</p>
                </div>
                <button 
                  onClick={() => setAddModal(false)} 
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDish} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                    Dish Title & Recipe Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Claypot Smoked Duck Biryani"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#f59e0b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      Menu Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-[#151922] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#f59e0b]"
                    >
                      <option value="Biryani">Biryani</option>
                      <option value="Starters">Starters & Grills</option>
                      <option value="Breads & Dosas">Breads & Dosas</option>
                      <option value="Curries">Curries & Gravies</option>
                      <option value="Desserts">Desserts & Drinks</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      Dietary Type
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setNewIsVeg(true)}
                        className={`flex-1 py-2 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 border transition-all ${
                          newIsVeg 
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-black' 
                            : 'border-white/10 bg-white/5 text-gray-400'
                        }`}
                      >
                        <DietarySymbol isVeg={true} /> Veg
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewIsVeg(false)}
                        className={`flex-1 py-2 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 border transition-all ${
                          !newIsVeg 
                            ? 'border-rose-500 bg-rose-500/20 text-rose-400 font-black' 
                            : 'border-white/10 bg-white/5 text-gray-400'
                        }`}
                      >
                        <DietarySymbol isVeg={false} /> Non-Veg
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="350"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#f59e0b]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      Raw Food Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      placeholder="95"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#f59e0b]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      Tonight's Batch
                    </label>
                    <input
                      type="number"
                      required
                      value={newBatch}
                      onChange={(e) => setNewBatch(e.target.value)}
                      placeholder="15"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#f59e0b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      Prep Time
                    </label>
                    <input
                      type="text"
                      value={newPrepTime}
                      onChange={(e) => setNewPrepTime(e.target.value)}
                      placeholder="20 mins"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#f59e0b]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                      Spice Level
                    </label>
                    <select
                      value={newSpice}
                      onChange={(e) => setNewSpice(e.target.value as any)}
                      className="w-full bg-[#151922] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#f59e0b]"
                    >
                      <option value="Mild">Mild 🌿</option>
                      <option value="Medium">Medium 🌶️</option>
                      <option value="Hot">Hot 🌶️🌶️</option>
                      <option value="Extra Hot">Extra Hot 🔥</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Off-Menu Secret Dish</span>
                      <span className="text-[10px] text-gray-400">Hidden from generic menu, unlocked via secret QR / codes</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSecret}
                    onChange={(e) => setIsSecret(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#f59e0b] focus:ring-[#f59e0b] cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:brightness-110 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg shadow-[#f59e0b]/25 cursor-pointer mt-2"
                >
                  Save Dish & Activate Live In Kitchen
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
