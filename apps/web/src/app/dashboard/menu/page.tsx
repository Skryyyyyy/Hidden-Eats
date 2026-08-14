'use client';

import React, { useState } from 'react';
import { Search, UtensilsCrossed, Power, PowerOff, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  image: string;
};

const initialMenu: MenuItem[] = [
  { id: '1', name: 'Chicken Biryani (Regular)', category: 'Biryani', price: 220, isAvailable: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60' },
  { id: '2', name: 'Mutton Chukka', category: 'Starters', price: 250, isAvailable: true, image: 'https://images.unsplash.com/photo-1626776876729-ab5220c5d577?w=800&auto=format&fit=crop&q=60' },
  { id: '3', name: 'Paneer Butter Masala', category: 'Curries', price: 180, isAvailable: false, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=800&auto=format&fit=crop&q=60' },
  { id: '4', name: 'Garlic Naan', category: 'Breads', price: 50, isAvailable: true, image: 'https://images.unsplash.com/photo-1626777610022-7935f8fc3227?w=800&auto=format&fit=crop&q=60' },
  { id: '5', name: 'Special Chicken 65', category: 'Starters', price: 200, isAvailable: true, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=60' },
];

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAvailability = (id: string) => {
    setMenuItems(items => items.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display text-white tracking-wide">Menu Availability</h1>
          <p className="text-sm text-gray-400 mt-1">Quickly mark items as sold out (86'd) to prevent orders.</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#f8b11c]/50 transition-colors"
            />
          </div>
          <button className="bg-[#1a1a1a] p-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className={`bg-[#1a1a1a] rounded-3xl overflow-hidden border transition-all ${
              !item.isAvailable ? 'border-red-500/30 opacity-75' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="h-32 w-full relative overflow-hidden">
              <img src={item.image} alt={item.name} className={`w-full h-full object-cover transition-all ${!item.isAvailable ? 'grayscale opacity-50' : ''}`} />
              {!item.isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    Sold Out
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{item.category}</span>
                  <h3 className="font-bold text-white text-lg leading-tight mt-1">{item.name}</h3>
                  <p className="text-[#f8b11c] font-medium mt-1">₹{item.price}</p>
                </div>
              </div>

              <button 
                onClick={() => toggleAvailability(item.id)}
                className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                  item.isAvailable 
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' 
                    : 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20'
                }`}
              >
                {item.isAvailable ? (
                  <>
                    <PowerOff className="w-4 h-4" /> Mark Sold Out (86)
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4" /> Make Available
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
