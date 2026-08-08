'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, Info, Search, Share2, Heart, Plus, Minus, Check, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../../context/CartContext';
import { useParams } from 'next/navigation';
import { RestaurantService } from '@hidden-eats/shared';
import { useTheme } from '@/context/ThemeContext';

export default function RestaurantMenu() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const params = useParams();
  const id = params.id as string;
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [resData, menuData] = await Promise.all([
          RestaurantService.getRestaurantById(id),
          RestaurantService.getMenu(id)
        ]);
        setRestaurant(resData);
        setMenuItems(menuData);
      } catch (err) {
        console.error("Failed to load restaurant data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const { cart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { clearCart } = useCart();

  const handleCheckout = () => {
    setIsCheckoutOpen(false);
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
    }, 3000);
  };

  if (loading || !restaurant) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-[#FAFAFA] text-black' : 'bg-black text-white'}`}>
        <div className="animate-pulse text-[#f8b11c] font-bold text-xl uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  const filteredMenu = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen selection:bg-[#f8b11c] selection:text-black pb-24 transition-colors duration-500 ${isLight ? 'bg-[#FAFAFA] text-black' : 'bg-black text-white'}`}>
      {/* Header Image */}
      <div className="relative h-[250px] md:h-[350px] w-full bg-black">
        <img src={restaurant.image} className="w-full h-full object-cover opacity-70" alt={restaurant.name} />
        <div className={`absolute inset-0 bg-gradient-to-t ${
          isLight ? 'from-[#FAFAFA] via-[#FAFAFA]/50 to-transparent' : 'from-black via-black/40 to-transparent'
        }`}></div>
        
        {/* Navbar */}
        <div className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center z-10">
          <Link href="/" className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-colors ${
            isLight ? 'bg-white/70 hover:bg-white text-black' : 'bg-black/50 hover:bg-black text-white'
          }`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex gap-3">
            <button className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-colors ${
              isLight ? 'bg-white/70 hover:bg-white text-black' : 'bg-black/50 hover:bg-black text-white'
            }`}>
              <Search className="w-5 h-5" />
            </button>
            <button className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-colors ${
              isLight ? 'bg-white/70 hover:bg-white text-black' : 'bg-black/50 hover:bg-black text-white'
            }`}>
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="absolute bottom-0 w-full p-4 md:p-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className={`${isLight ? 'text-black' : 'text-white'}`}>
              <h1 className="text-3xl md:text-5xl font-display uppercase tracking-tight">{restaurant.name}</h1>
              <p className={`mt-2 text-sm md:text-base ${isLight ? 'text-gray-600' : 'text-gray-200'}`}>{restaurant.cuisines} • {restaurant.location}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className={`flex items-center gap-1 px-2 py-1 rounded font-bold ${
                  isLight ? 'bg-green-100 text-green-700' : 'bg-green-700/30 text-green-400'
                }`}>
                  <Star className={`w-4 h-4 ${isLight ? 'fill-green-600' : 'fill-green-400'}`} /> {restaurant.rating}
                </span>
                <span className={`flex items-center gap-1 ${isLight ? 'text-gray-600' : 'text-gray-200'}`}>
                  <Clock className="w-4 h-4" /> {restaurant.time}
                </span>
              </div>
            </div>
            <div className={`border px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 backdrop-blur-sm w-fit ${
              isLight ? 'bg-[#f8b11c]/20 border-[#f8b11c]/50 text-[#d9980d]' : 'bg-[#f8b11c]/20 border-[#f8b11c]/50 text-[#f8b11c]'
            }`}>
              <Info className="w-4 h-4" />
              {restaurant.offer}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-colors ${
              isLight ? 'bg-black/5 border-black/10 text-black placeholder-gray-500 focus:border-[#f8b11c]/50 focus:bg-white' : 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-[#f8b11c]/50 focus:bg-white/10'
            }`}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <h3 className={`font-display text-2xl tracking-wide uppercase border-b pb-4 mb-6 ${isLight ? 'border-black/10' : 'border-white/10'}`}>
          {searchQuery ? 'Search Results' : 'Recommended'}
        </h3>
        
        <div className="flex flex-col gap-6">
          {filteredMenu.length === 0 ? (
            <div className={`text-center py-8 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
              No dishes found matching "{searchQuery}"
            </div>
          ) : filteredMenu.map((item) => {
            const cartItem = cart.find(c => c.id === item.id);
            return (
              <div key={item.id} className={`flex gap-4 p-4 rounded-2xl border transition-colors ${
                isLight ? 'bg-white border-black/10 hover:border-black/30 shadow-sm' : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className={`w-4 h-4 border ${item.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center p-0.5 rounded-sm mb-2`}>
                      <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-sm font-semibold mt-1">₹{item.price}</p>
                    <p className={`text-xs md:text-sm mt-2 line-clamp-2 leading-relaxed ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{item.description}</p>
                  </div>
                </div>
                
                {/* Image and Add Button */}
                <div className="relative w-32 md:w-40 h-32 md:h-40 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%]">
                    {!cartItem ? (
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-full py-2 bg-white text-green-600 font-black tracking-wider uppercase text-sm rounded-lg shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-white text-green-600 font-bold rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-gray-100 w-full flex justify-center"><Minus className="w-4 h-4" /></button>
                        <span className="w-full text-center">{cartItem.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-gray-100 w-full flex justify-center"><Plus className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Cart Banner */}
      <AnimatePresence>
        {cartCount > 0 && !isCheckoutOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 md:px-0 pointer-events-none"
          >
            <div className="w-full max-w-[600px] bg-[#50b263] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer hover:bg-[#439c54] transition-colors pointer-events-auto"
                 onClick={() => setIsCheckoutOpen(true)}>
              <div>
                <p className="font-bold">{cartCount} ITEM{cartCount > 1 ? 'S' : ''}</p>
                <p className="text-sm opacity-90">₹{cartTotal} plus taxes</p>
              </div>
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
                View Cart <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Side Drawer */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 bottom-0 w-full md:w-[450px] z-50 overflow-y-auto border-l flex flex-col ${
                isLight ? 'bg-[#FAFAFA] border-black/10' : 'bg-[#111] border-white/10'
              }`}
            >
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 backdrop-blur-md z-10 ${
                isLight ? 'border-black/10 bg-[#FAFAFA]/80' : 'border-white/10 bg-[#111]/80'
              }`}>
                <h2 className={`font-display text-2xl uppercase tracking-wider ${isLight ? 'text-black' : 'text-white'}`}>Your Order</h2>
                <button onClick={() => setIsCheckoutOpen(false)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isLight ? 'bg-black/5 hover:bg-black/10 text-black' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 border ${item.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center p-px rounded-sm shrink-0`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <div className={`w-10 h-10 rounded overflow-hidden shrink-0 border ${isLight ? 'border-black/10' : 'border-white/10'}`}>
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className={`font-semibold text-sm max-w-[100px] sm:max-w-[120px] leading-tight ${isLight ? 'text-black' : 'text-white'}`}>{item.name}</span>
                      </div>
                      
                      <div className={`flex items-center gap-4 ${isLight ? 'text-black' : 'text-white'}`}>
                        <div className={`flex items-center rounded border ${isLight ? 'bg-black/5 border-black/10' : 'bg-white/10 border-white/10'}`}>
                          <button onClick={() => updateQuantity(item.id, -1)} className={`p-1 px-2 transition-colors ${isLight ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}><Minus className="w-3 h-3" /></button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className={`p-1 px-2 transition-colors ${isLight ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}><Plus className="w-3 h-3" /></button>
                        </div>
                        <span className="font-semibold text-sm w-12 text-right">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Details */}
                <div className={`mt-auto rounded-xl p-5 border space-y-3 ${
                  isLight ? 'bg-white border-black/10' : 'bg-white/5 border-white/10'
                }`}>
                  <h4 className={`font-bold uppercase tracking-wider text-sm mb-2 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Bill Details</h4>
                  <div className={`flex justify-between text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                    <span>Item Total</span>
                    <span className={isLight ? 'text-black' : 'text-white'}>₹{cartTotal}</span>
                  </div>
                  <div className={`flex justify-between text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                    <span>Delivery Fee</span>
                    <span className={isLight ? 'text-black' : 'text-white'}>₹40</span>
                  </div>
                  <div className={`flex justify-between text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                    <span>Taxes</span>
                    <span className={isLight ? 'text-black' : 'text-white'}>₹{(cartTotal * 0.05).toFixed(2)}</span>
                  </div>
                  <div className={`border-t pt-3 flex justify-between font-bold text-lg mt-2 ${
                    isLight ? 'border-black/10 text-black' : 'border-white/10 text-white'
                  }`}>
                    <span>To Pay</span>
                    <span>₹{(cartTotal + 40 + cartTotal * 0.05).toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#f8b11c] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#e09e13] transition-colors mt-4 active:scale-[0.98]"
                >
                  Place Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {orderPlaced && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <div className={`p-10 rounded-[2rem] border border-[#f8b11c]/30 text-center max-w-sm w-full flex flex-col items-center shadow-2xl ${
              isLight ? 'bg-white' : 'bg-[#111]'
            }`}>
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <Check className="w-10 h-10 text-white stroke-[3]" />
              </div>
              <h2 className={`font-display text-4xl uppercase tracking-wide mb-4 ${isLight ? 'text-black' : 'text-white'}`}>Order Confirmed!</h2>
              <p className={`leading-relaxed text-sm px-2 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>Your food is being prepared and will be delivered shortly.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
