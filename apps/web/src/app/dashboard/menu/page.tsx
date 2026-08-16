'use client';

import React, { useState } from 'react';
import { Search, UtensilsCrossed, Power, PowerOff, Filter, Plus, Sparkles, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sanitizeInput } from '@/lib/security';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  isSecretItem?: boolean;
  image: string;
};

const initialMenu: MenuItem[] = [
  { id: '1', name: 'Smoked Mutton Biryani', category: 'Biryani', price: 340, isAvailable: true, isSecretItem: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60' },
  { id: '2', name: 'Black Garlic Smoked Chicken', category: 'Starters', price: 320, isAvailable: true, isSecretItem: true, image: 'https://images.unsplash.com/photo-1626776876729-ab5220c5d577?w=800&auto=format&fit=crop&q=60' },
  { id: '3', name: 'Truffle Butter Ghee Roast Dosa', category: 'Dosa', price: 180, isAvailable: true, isSecretItem: false, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=800&auto=format&fit=crop&q=60' },
  { id: '4', name: 'Chettinad Special Curry', category: 'Curries', price: 280, isAvailable: false, isSecretItem: false, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=60' },
  { id: '5', name: 'Filter Coffee Panna Cotta', category: 'Sweets', price: 150, isAvailable: true, isSecretItem: false, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60' },
];

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModal, setAddModal] = useState(false);

  // New Dish Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Biryani');
  const [newPrice, setNewPrice] = useState('');
  const [isSecret, setIsSecret] = useState(false);

  const toggleAvailability = (id: string) => {
    setMenuItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
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

    const newItem: MenuItem = {
      id: `m-${Date.now()}`,
      name: sanitizeInput(newName),
      category: sanitizeInput(newCategory),
      price: Number(newPrice),
      isAvailable: true,
      isSecretItem: isSecret,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60',
    };

    setMenuItems([newItem, ...menuItems]);
    setAddModal(false);
    setNewName('');
    setNewPrice('');
    setIsSecret(false);
  };

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141414] border border-white/10 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-[10px] font-bold text-[#f8b11c] uppercase tracking-widest block mb-1">
            Menu Vault & Stock Controls
          </span>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Dish Inventory & Price Modifier
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#f8b11c] transition-colors"
            />
          </div>

          <button
            onClick={() => setAddModal(true)}
            className="bg-[#f8b11c] text-black px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#e0a019] transition-colors flex items-center gap-1.5 shrink-0 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add New Dish
          </button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            layout
            key={item.id}
            className={`bg-[#141414] rounded-3xl overflow-hidden border transition-all ${
              !item.isAvailable ? 'border-red-500/30 opacity-75' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="h-36 w-full relative overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className={`w-full h-full object-cover transition-all ${
                  !item.isAvailable ? 'grayscale opacity-50' : ''
                }`}
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {!item.isAvailable && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    Sold Out (86'd)
                  </span>
                )}
                {item.isSecretItem && (
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Secret Dish
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#f8b11c]">
                  {item.category}
                </span>
                <h3 className="font-bold text-white text-base leading-tight mt-0.5">{item.name}</h3>
                <p className="text-white font-mono font-bold mt-1 text-sm">₹{item.price}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-1 ${
                    item.isAvailable
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                  }`}
                >
                  {item.isAvailable ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                  {item.isAvailable ? 'Mark Sold Out' : 'Make In-Stock'}
                </button>

                <button
                  onClick={() => toggleSecretItem(item.id)}
                  className={`py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-1 ${
                    item.isSecretItem
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {item.isSecretItem ? 'Secret Item' : 'Standard'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ➕ Add New Dish Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Add New Dish to Vault</h3>
              <button onClick={() => setAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDish} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Special Smoked Pepper Chicken"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#f8b11c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#f8b11c]"
                >
                  <option value="Biryani">Biryani</option>
                  <option value="Starters">Starters</option>
                  <option value="Dosa">Dosa</option>
                  <option value="Curries">Curries</option>
                  <option value="Sweets">Sweets</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g. 290"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none focus:border-[#f8b11c]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="secretCheck"
                  checked={isSecret}
                  onChange={(e) => setIsSecret(e.target.checked)}
                  className="w-4 h-4 accent-[#f8b11c]"
                />
                <label htmlFor="secretCheck" className="text-xs text-gray-300 font-bold uppercase tracking-wider cursor-pointer">
                  Mark as Off-Menu Secret Item
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#f8b11c] text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#e0a019] transition-colors mt-4"
              >
                Save Dish to Menu
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
