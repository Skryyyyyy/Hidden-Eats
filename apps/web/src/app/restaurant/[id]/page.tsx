'use client';

import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, Info, Search, Share2, Heart, Plus, Minus, Check, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../../context/CartContext';
import { useParams } from 'next/navigation';

const RESTAURANT_DETAILS = {
  1: { name: 'Sangeetha Veg Restaurant', rating: 4.8, time: '20-25 mins', cuisines: 'South Indian, Pure Veg', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2000&q=100', location: 'T. Nagar, Chennai', offer: '20% OFF' },
  2: { name: 'A2B - Adyar Ananda Bhavan', rating: 4.6, time: '15-20 mins', cuisines: 'Sweets, South Indian', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=2000&q=100', location: 'Adyar, Chennai', offer: 'FREE DELIVERY' },
  3: { name: 'Murugan Idli Shop', rating: 4.9, time: '30-35 mins', cuisines: 'South Indian, Breakfast', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=2000&q=100', location: 'Besant Nagar, Chennai', offer: '10% OFF' },
  4: { name: 'Dindigul Thalappakatti', rating: 4.7, time: '40-45 mins', cuisines: 'Biryani, South Indian', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=2000&q=100', location: 'Nungambakkam', offer: '20% OFF above ₹400' },
  5: { name: 'Buhari Hotel', rating: 4.5, time: '25-30 mins', cuisines: 'Mughlai, Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=2000&q=100', location: 'Mount Road, Chennai', offer: '60% OFF' },
  6: { name: 'Junior Kuppanna', rating: 4.4, time: '10-15 mins', cuisines: 'Kongunadu, South Indian', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=2000&q=100', location: 'Velachery', offer: 'Buy 1 Get 1' },
  7: { name: 'Ambur Star Briyani', rating: 4.3, time: '15-25 mins', cuisines: 'Biryani, Fast Food', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=2000&q=100', location: 'Anna Nagar', offer: '20% OFF' },
  8: { name: 'Saravana Bhavan', rating: 4.8, time: '30-40 mins', cuisines: 'South Indian, Pure Veg', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=2000&q=100', location: 'Mylapore, Chennai', offer: 'FREE DESSERT' },
};

const MENU = [
  { id: 'm1', name: 'Ghee Roast Dosa', description: 'Crispy dosa cooked with pure ghee, served with 3 types of chutney and sambar.', price: 120, isVeg: true, image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=300&q=80' },
  { id: 'm2', name: 'Chicken Biryani', description: 'Classic seeraga samba biryani cooked with tender chicken pieces and aromatic spices.', price: 280, isVeg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80' },
  { id: 'm3', name: 'Paneer Butter Masala', description: 'Soft paneer cubes in a rich, creamy tomato gravy.', price: 220, isVeg: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=300&q=80' },
  { id: 'm4', name: 'Idli (2 Pcs)', description: 'Soft and fluffy steamed rice cakes.', price: 40, isVeg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=300&q=80' },
  { id: 'm5', name: 'Filter Coffee', description: 'Authentic South Indian filter coffee.', price: 60, isVeg: true, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80' },
];

export default function RestaurantMenu() {
  const params = useParams();
  const id = params.id as string;
  const restaurant = RESTAURANT_DETAILS[id as unknown as keyof typeof RESTAURANT_DETAILS] || RESTAURANT_DETAILS[1];
  
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#f8b11c] selection:text-black pb-24">
      {/* Header Image */}
      <div className="relative h-[250px] md:h-[350px] w-full">
        <img src={restaurant.image} className="w-full h-full object-cover opacity-70" alt={restaurant.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        {/* Navbar */}
        <div className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center z-10">
          <Link href="/" className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black transition-colors">
              <Search className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black transition-colors">
              <Heart className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="absolute bottom-0 w-full p-4 md:p-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-display uppercase tracking-tight">{restaurant.name}</h1>
              <p className="text-gray-300 mt-2 text-sm md:text-base">{restaurant.cuisines} • {restaurant.location}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1 bg-green-700/30 text-green-400 px-2 py-1 rounded font-bold">
                  <Star className="w-4 h-4 fill-green-400" /> {restaurant.rating}
                </span>
                <span className="flex items-center gap-1 text-gray-300">
                  <Clock className="w-4 h-4" /> {restaurant.time}
                </span>
              </div>
            </div>
            <div className="bg-[#f8b11c]/20 border border-[#f8b11c]/50 text-[#f8b11c] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 backdrop-blur-sm w-fit">
              <Info className="w-4 h-4" />
              {restaurant.offer}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8">
        <h3 className="font-display text-2xl tracking-wide uppercase border-b border-white/10 pb-4 mb-6">Recommended</h3>
        
        <div className="flex flex-col gap-6">
          {MENU.map((item) => {
            const cartItem = cart.find(c => c.id === item.id);
            return (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className={`w-4 h-4 border ${item.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center p-0.5 rounded-sm mb-2`}>
                      <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-sm font-semibold mt-1">₹{item.price}</p>
                    <p className="text-gray-400 text-xs md:text-sm mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
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
            className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-40"
          >
            <div className="bg-[#50b263] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer hover:bg-[#439c54] transition-colors"
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
              className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-[#111] z-50 overflow-y-auto border-l border-white/10 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#111]/80 backdrop-blur-md z-10">
                <h2 className="font-display text-2xl uppercase tracking-wider">Your Order</h2>
                <button onClick={() => setIsCheckoutOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 border ${item.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center p-px rounded-sm`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <span className="font-semibold text-sm max-w-[120px] truncate">{item.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white/10 rounded border border-white/10">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 px-2 hover:bg-white/10"><Minus className="w-3 h-3" /></button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 px-2 hover:bg-white/10"><Plus className="w-3 h-3" /></button>
                        </div>
                        <span className="font-semibold text-sm w-12 text-right">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Details */}
                <div className="mt-auto bg-white/5 rounded-xl p-5 border border-white/10 space-y-3">
                  <h4 className="font-bold uppercase tracking-wider text-sm text-gray-400 mb-2">Bill Details</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Item Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Delivery Fee</span>
                    <span>₹40</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Taxes</span>
                    <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg mt-2">
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
            <div className="bg-[#111] p-8 rounded-[2rem] border border-[#f8b11c]/30 text-center max-w-sm w-full flex flex-col items-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-white stroke-[3]" />
              </div>
              <h2 className="font-display text-3xl uppercase tracking-tighter text-white mb-2">Order Confirmed!</h2>
              <p className="text-gray-400">Your food is being prepared and will be delivered shortly.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
