'use client';

import React, { useState } from 'react';
import { Search, UtensilsCrossed, Power, PowerOff, Filter, Plus, Sparkles, Check, X, Minus, Flame, FlameKindling } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sanitizeInput } from '@/lib/security';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  isSecretItem?: boolean;
  batchRemaining?: number;
  maxBatch?: number;
  image: string;
};

const initialMenu: MenuItem[] = [
  {
    id: '1',
    name: 'Smoked Mutton Dum Biryani',
    category: 'Biryani',
    price: 340,
    isAvailable: true,
    isSecretItem: true,
    batchRemaining: 8,
    maxBatch: 15,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    name: 'Black Garlic Smoked Wings',
    category: 'Starters',
    price: 320,
    isAvailable: true,
    isSecretItem: true,
    batchRemaining: 4,
    maxBatch: 12,
    image: 'https://images.unsplash.com/photo-1626776876729-ab5220c5d577?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    name: 'Truffle Butter Ghee Roast Dosa',
    category: 'Dosa',
    price: 180,
    isAvailable: true,
    isSecretItem: false,
    batchRemaining: 18,
    maxBatch: 30,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '4',
    name: 'Chettinad Brain Fry',
    category: 'Curries',
    price: 280,
    isAvailable: false,
    isSecretItem: true,
    batchRemaining: 0,
    maxBatch: 10,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '5',
    name: 'Filter Coffee Panna Cotta',
    category: 'Sweets',
    price: 150,
    isAvailable: true,
    isSecretItem: false,
    batchRemaining: 15,
    maxBatch: 20,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60',
  },
];

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModal, setAddModal] = useState(false);

  // New Dish Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Biryani');
  const [newPrice, setNewPrice] = useState('');
  const [newBatch, setNewBatch] = useState('15');
  const [isSecret, setIsSecret] = useState(false);

  const toggleAvailability = (id: string) => {
    setMenuItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const nextAvail = !item.isAvailable;
          return {
            ...item,
            isAvailable: nextAvail,
            batchRemaining: nextAvail && (item.batchRemaining || 0) <= 0 ? (item.maxBatch || 10) : item.batchRemaining,
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

    const newItem: MenuItem = {
      id: `m-${Date.now()}`,
      name: sanitizeInput(newName),
      category: sanitizeInput(newCategory),
      price: Number(newPrice),
      isAvailable: true,
      isSecretItem: isSecret,
      batchRemaining: batch,
      maxBatch: batch,
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
            Menu Vault & Limited Batch Controls
          </span>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Dish Inventory & Batch Decrement
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
              className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#f8b11c] transition-colors"
            />
          </div>

          <button
            onClick={() => setAddModal(true)}
            className="bg-[#f8b11c] text-black px-5 py-2.5 rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-[#e0a019] transition-all flex items-center gap-1.5 shrink-0 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Secret Dish
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
            <div className="h-40 w-full relative overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className={`w-full h-full object-cover transition-all ${
                  !item.isAvailable ? 'grayscale opacity-50' : ''
                }`}
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {!item.isAvailable ? (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Sold Out (86'd)
                  </span>
                ) : (
                  <span className="bg-black/80 backdrop-blur-md border border-white/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    🔥 {item.batchRemaining} Portions Left
                  </span>
                )}
                {item.isSecretItem && (
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Secret Dish
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#f8b11c]">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-white text-base leading-tight mt-0.5">{item.name}</h3>
                </div>
                <p className="text-white font-mono font-black text-base">₹{item.price}</p>
              </div>

              {/* Limited Batch Live Stock Decrementer */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Tonight's Batch</span>
                  <span className="font-bold text-white">
                    {item.batchRemaining} / {item.maxBatch || 15} Available
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => adjustBatchStock(item.id, -1)}
                    disabled={(item.batchRemaining || 0) <= 0}
                    className="p-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-black"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-1.5 font-mono font-bold text-white text-xs">{item.batchRemaining || 0}</span>
                  <button
                    onClick={() => adjustBatchStock(item.id, 1)}
                    className="p-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-black"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
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
                  className={`py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-8 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Add New Dish to Vault</h3>
              <button onClick={() => setAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDish} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                  Dish Title
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Claypot Smoked Quail"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#f8b11c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="340"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#f8b11c]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                    Limited Batch Portions
                  </label>
                  <input
                    type="number"
                    required
                    value={newBatch}
                    onChange={(e) => setNewBatch(e.target.value)}
                    placeholder="15"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#f8b11c]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="secretCheckbox"
                  checked={isSecret}
                  onChange={(e) => setIsSecret(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-[#f8b11c] focus:ring-[#f8b11c]"
                />
                <label htmlFor="secretCheckbox" className="text-xs text-gray-300 font-bold">
                  Mark as Off-Menu Secret Dish
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#f8b11c] hover:bg-[#e0a019] text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg cursor-pointer mt-4"
              >
                Save to Kitchen Vault
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
