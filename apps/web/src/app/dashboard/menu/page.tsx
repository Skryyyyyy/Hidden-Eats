'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { createClient } from '@/lib/supabase';
import { MenuItem } from '@hidden-eats/shared';
import { Flame, Plus, Check, ChevronRight, Zap } from 'lucide-react';

export default function NotionPartnerMenuPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [items, setItems] = useState<Partial<MenuItem>[]>([
    {
      id: 'm-1',
      name: "Chef's Secret Smoked Biryani",
      price: 340,
      description: 'Slow-cooked mutton biryani prepared on secret request.',
      category: "Off-Menu / Local's Pick",
      is_off_menu_secret: true,
      is_available: true,
    },
    {
      id: 'm-2',
      name: 'Midnight Chili Garlic Wings',
      price: 220,
      description: 'Crispy fried wings tossed in secret spice blend.',
      category: "Off-Menu / Local's Pick",
      is_off_menu_secret: true,
      is_available: true,
    },
    {
      id: 'm-3',
      name: 'Classic Butter Chicken',
      price: 310,
      description: 'Rich tomato cream gravy with tender tandoori chicken.',
      category: 'Mains',
      is_off_menu_secret: false,
      is_available: true,
    },
  ]);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState("Off-Menu / Local's Pick");
  const [isSecret, setIsSecret] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const loadLiveMenuItems = async () => {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (!error && data && data.length > 0) {
        setItems(data as MenuItem[]);
      }
    };
    loadLiveMenuItems();
  }, [supabase]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    setSaving(true);
    const newItem = {
      id: `m-${Date.now()}`,
      name,
      price: parseFloat(price),
      description,
      category,
      is_off_menu_secret: isSecret,
      is_available: true,
    };

    try {
      await supabase.from('menu_items').insert(newItem);
    } catch (e) {
      console.log('Local state updated');
    }

    setItems([newItem, ...items]);
    setName('');
    setPrice('');
    setDescription('');
    setSaving(false);
  };

  return (
    <div className={`min-h-screen flex font-sans antialiased text-body transition-colors ${
      isLight ? 'bg-[#FAFAFA] text-[#111111]' : 'bg-[#0A0A0A] text-white'
    }`}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-20 px-8 flex items-center justify-between sticky top-0 z-20 transition-all border-b glass-header ${
          isLight ? 'border-black/5 bg-[#FAFAFA]/70' : 'border-white/5 bg-[#0A0A0A]/70'
        }`}>
          <div className="flex items-center gap-2 text-label text-[11px] uppercase tracking-widest font-bold">
            <Link href="/dashboard" className={`transition-colors ${isLight ? 'text-[#666666] hover:text-[#111111]' : 'text-[#888888] hover:text-white'}`}>Dashboard</Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className={isLight ? 'text-[#111111] font-bold' : 'text-white font-bold'}>Secret Menu Catalog</span>
          </div>

          <Link href="/dashboard" className={`text-label text-[11px] uppercase tracking-widest font-bold transition-colors ${
            isLight ? 'text-[#666666] hover:text-[#111111]' : 'text-[#888888] hover:text-white'
          }`}>
            ← Back to Overview
          </Link>
        </header>

        <main className="p-6 sm:p-12 space-y-8 max-w-6xl mx-auto w-full animate-fade-in">
          <div>
            <h1 className={`text-h1 text-4xl tracking-tight mb-2 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
              Secret & Regular Menu Items
            </h1>
            <p className="text-body text-[13px] text-[#666666] dark:text-[#aaaaaa]">
              Add off-menu specials displayed exclusively to authenticated Hidden Eats mobile users.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Item Form */}
            <div className={`border rounded-[32px] p-8 h-fit shadow-sm transition-colors ${
              isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
            }`}>
              <h2 className={`text-label text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 mb-6 ${
                isLight ? 'text-[#111111]' : 'text-white'
              }`}>
                <Plus className={`w-4 h-4 ${isLight ? 'text-[#111111]' : 'text-white'}`} /> Create New Dish
              </h2>
              <form onSubmit={handleAddItem} className="space-y-5">
                <div>
                  <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                    isLight ? 'text-[#666666]' : 'text-[#888888]'
                  }`}>
                    Dish Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Secret Smoked Ribs"
                    className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] outline-none transition-all ${
                      isLight 
                        ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                        : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                    isLight ? 'text-[#666666]' : 'text-[#888888]'
                  }`}>
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="290"
                    className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] outline-none transition-all ${
                      isLight 
                        ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                        : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                    isLight ? 'text-[#666666]' : 'text-[#888888]'
                  }`}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] outline-none transition-all ${
                      isLight 
                        ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                        : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                    isLight ? 'text-[#666666]' : 'text-[#888888]'
                  }`}>
                    Preparation Secret Note
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Special secret spice blend..."
                    className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] outline-none transition-all resize-none ${
                      isLight 
                        ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                        : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                    }`}
                  />
                </div>

                <div className={`flex items-center gap-3 p-4 border rounded-[24px] transition-colors cursor-pointer hover:shadow-sm ${
                  isLight ? 'bg-[#F3F4F6] border-[#D62828]/20 hover:border-[#D62828]/40' : 'bg-[#1A1A1A] border-[#3a2c0c] hover:border-[#FFB703]/40'
                }`} onClick={() => setIsSecret(!isSecret)}>
                  <input
                    type="checkbox"
                    id="secretCheck"
                    checked={isSecret}
                    onChange={(e) => setIsSecret(e.target.checked)}
                    className={`w-4 h-4 rounded border ${
                      isLight ? 'accent-[#D62828]' : 'accent-[#FFB703]'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor="secretCheck" className={`text-label text-[11px] uppercase tracking-widest font-bold font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${
                    isLight ? 'text-[#111111]' : 'text-white'
                  }`} onClick={(e) => e.stopPropagation()}>
                    <Flame className="w-4 h-4 fill-current" /> Mark as Secret Off-Menu Item
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full py-3.5 px-4 rounded-[24px] text-label text-[13px] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0 mt-2 ${
                    isLight
                      ? 'bg-[#111111] hover:bg-black text-white shadow-black/10 hover:shadow-black/20'
                      : 'bg-white hover:bg-[#F3F4F6] text-black font-bold shadow-white/10 hover:shadow-white/20'
                  }`}
                >
                  {saving ? 'Publishing...' : 'Publish to Live Menu'}
                </button>
              </form>
            </div>

            {/* Menu Items Database Catalog */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className={`text-label text-[11px] font-bold uppercase tracking-wider mb-2 ${
                isLight ? 'text-[#666666]' : 'text-[#888888]'
              }`}>
                Active Catalog ({items.length} Items)
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-[32px] p-6 flex flex-col sm:flex-row justify-between items-start gap-4 transition-all shadow-sm hover:shadow-md ${
                      item.is_off_menu_secret
                        ? isLight ? 'bg-gradient-to-r from-[#FFF3E8] to-white border-[#D62828]/20' : 'bg-gradient-to-r from-[#1e1708] to-[#131A2C] border-[#382607]'
                        : isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
                    }`}
                  >
                    <div>
                      {item.is_off_menu_secret && (
                        <span className={`text-label text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2 ${
                          isLight ? 'text-[#111111]' : 'text-white'
                        }`}>
                          <Zap className="w-3.5 h-3.5 fill-current" /> SECRET OFF-MENU ITEM
                        </span>
                      )}
                      <h3 className={`text-card-title text-base ${isLight ? 'text-[#111111]' : 'text-white'}`}>{item.name}</h3>
                      <p className="text-body text-[13px] opacity-70 mt-1.5 leading-relaxed max-w-lg">{item.description}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`text-label text-[10px] px-2.5 py-1 rounded-lg border ${
                          isLight ? 'bg-[#FAFAFA] text-[#666666] border-black/5' : 'bg-[#0A0A0A] text-[#888888] border-white/5'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-price text-lg text-[#16A34A] dark:text-[#10b981]">₹{item.price}</span>
                      <span className={`text-label text-[10px] uppercase font-bold mt-2 flex items-center gap-1 ${
                        isLight ? 'text-[#16A34A]' : 'text-[#10b981]'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_5px_currentColor]" /> Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
