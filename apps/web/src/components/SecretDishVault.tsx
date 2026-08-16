'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, KeyRound, Sparkles, X, ShoppingBag, Check } from 'lucide-react';

interface SecretDish {
  id: string;
  code: string;
  name: string;
  restaurant: string;
  price: number;
  originalPrice: number;
  description: string;
  image: string;
  tags: string[];
}

const SECRET_DISHES: SecretDish[] = [
  {
    id: 'sec-1',
    code: 'OFFMENU',
    name: 'Spicy Garlic Charcoal Chicken',
    restaurant: 'Buhari Hotel 1951',
    price: 320,
    originalPrice: 450,
    description: 'Off-menu secret recipe marinated for 24 hours in black garlic & smoked bird eye chili. Prepared exclusively after 8 PM.',
    image: '/img/food_general.png',
    tags: ['Secret Recipe', 'Night Exclusive', '30% OFF'],
  },
  {
    id: 'sec-2',
    code: 'CHEFGEM',
    name: 'Gold Leaf Charcoal Dum Biryani',
    restaurant: 'Ambur Star Biryani',
    price: 390,
    originalPrice: 520,
    description: 'Hand-crafted slow-cooked Seeraga Samba biryani topped with edible 24K gold leaf and roasted cashew oil.',
    image: '/img/food_general.png',
    tags: ['Chef Signature', 'VVIP Only', 'Limited 15 Servings/Day'],
  },
  {
    id: 'sec-3',
    code: 'SECRET2026',
    name: 'Truffle Butter Ghee Roast Dosa',
    restaurant: 'Murugan Idli Shop',
    price: 180,
    originalPrice: 240,
    description: 'Crispy golden dosa infused with French black truffle oil and A2 Gir cow ghee served with 4 secret chutneys.',
    image: '/img/dosa.png',
    tags: ['Fusion Secret', 'Breakfast Spec', 'Exclusive'],
  },
];

// Helper to play synthesized Web Audio API sound effect on unlock
function playUnlockSFX() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Create oscillator for celebratory chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Audio Context blocked or unavailable
  }
}

export default function SecretDishVault() {
  const [isOpen, setIsOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [unlockedDishes, setUnlockedDishes] = useState<SecretDish[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);
  const [addedToCartId, setAddedToCartId] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setUnlockedSuccess(false);

    const cleanCode = passcode.trim().toUpperCase();
    const foundDish = SECRET_DISHES.find((d) => d.code === cleanCode);

    if (foundDish) {
      if (unlockedDishes.some((d) => d.id === foundDish.id)) {
        setErrorMsg('You have already unlocked this secret dish!');
        return;
      }
      playUnlockSFX();
      setUnlockedDishes((prev) => [...prev, foundDish]);
      setUnlockedSuccess(true);
      setPasscode('');
    } else {
      setErrorMsg('Invalid secret code! Hint: Try "OFFMENU", "CHEFGEM", or "SECRET2026"');
    }
  };

  return (
    <>
      {/* Vault Trigger Badge Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-[#f8b11c] to-[#e0a019] text-black px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-transform cursor-pointer"
      >
        <KeyRound className="w-4 h-4" />
        <span>Unlock Secret Menu</span>
        {unlockedDishes.length > 0 && (
          <span className="bg-black text-white px-2 py-0.5 rounded-full text-[10px]">
            {unlockedDishes.length}
          </span>
        )}
      </button>

      {/* Secret Vault Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#141414] border border-[#f8b11c]/30 rounded-3xl p-6 md:p-8 shadow-2xl z-50 text-white overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#f8b11c]/20 text-[#f8b11c] rounded-2xl border border-[#f8b11c]/40">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#f8b11c] uppercase tracking-widest block">
                    VIP Off-Menu Vault
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-tight font-black">
                    Secret Menu Passcode
                  </h3>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Enter an exclusive chef passcode to reveal unlisted signature dishes, off-menu specials, and secret discounts.
              </p>

              {/* Passcode Form */}
              <form onSubmit={handleUnlock} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter code (e.g. OFFMENU)"
                  className="flex-1 bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 uppercase tracking-wider focus:outline-none focus:border-[#f8b11c] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#f8b11c] text-black font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-[#e0a019] transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Unlock className="w-4 h-4" /> Unlock
                </button>
              </form>

              {/* Feedback messages */}
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium mb-6">
                  {errorMsg}
                </div>
              )}

              {unlockedSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Secret Dish Unlocked Successfully!
                </div>
              )}

              {/* Unlocked Secret Dishes List */}
              {unlockedDishes.length > 0 ? (
                <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#f8b11c] border-b border-white/10 pb-2">
                    Your Unlocked Secret Dishes ({unlockedDishes.length})
                  </div>
                  {unlockedDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-black/40 border border-[#f8b11c]/20 p-4 rounded-2xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-white leading-tight">
                            {dish.name}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-medium block">
                            {dish.restaurant}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono font-bold text-[#f8b11c]">
                              ₹{dish.price}
                            </span>
                            <span className="text-[10px] font-mono line-through text-gray-500">
                              ₹{dish.originalPrice}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setAddedToCartId(dish.id);
                          setTimeout(() => setAddedToCartId(null), 2000);
                        }}
                        className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 ${
                          addedToCartId === dish.id
                            ? 'bg-green-500 text-black'
                            : 'bg-[#f8b11c] text-black hover:bg-[#e0a019]'
                        }`}
                      >
                        {addedToCartId === dish.id ? (
                          <>
                            <Check className="w-4 h-4" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" /> Claim
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-black/20 rounded-2xl border border-white/5 text-gray-500 text-xs">
                  No secret dishes unlocked yet. Try codes <strong className="text-[#f8b11c]">OFFMENU</strong>, <strong className="text-[#f8b11c]">CHEFGEM</strong>, or <strong className="text-[#f8b11c]">SECRET2026</strong>.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
