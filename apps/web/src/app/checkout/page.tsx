'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, CreditCard, ChevronRight, Utensils, Receipt, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const cartItems = [
    { id: 1, name: 'Chicken Biryani (Regular)', price: 220, quantity: 2 },
    { id: 2, name: 'Mutton Chukka', price: 250, quantity: 1 },
    { id: 3, name: 'Coke (330ml)', price: 40, quantity: 2 },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 45;
  const taxesAndCharges = 35.50;
  const total = subtotal + deliveryFee + taxesAndCharges;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 selection:bg-[#f8b11c] selection:text-black">
      <div className="max-w-4xl mx-auto animate-fade-in">
        
        <h1 className="text-3xl font-display uppercase tracking-widest text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Delivery Details & Payment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Address */}
            <section className="bg-[#111] p-6 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#f8b11c]/20 p-2 rounded-xl">
                  <MapPin className="w-5 h-5 text-[#f8b11c]" />
                </div>
                <h2 className="text-xl font-bold text-white">Delivery Address</h2>
              </div>
              
              <div className="bg-white/5 border border-[#f8b11c]/50 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-4 h-4 rounded-full border-4 border-[#f8b11c] bg-[#111]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Home</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      14/2, 3rd Cross Street, Shenoy Nagar<br/>
                      Near Thiru Vi Ka Park, Chennai 600030
                    </p>
                    <p className="text-sm text-gray-300 font-medium mt-2">Delivery Instructions: Leave at door</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-[#111] p-6 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500/20 p-2 rounded-xl">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Payment Method</h2>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-white rounded flex items-center justify-center font-bold text-blue-900 text-xs italic tracking-tighter">
                    VISA
                  </div>
                  <div>
                    <h3 className="font-bold text-white">•••• •••• •••• 4242</h3>
                    <p className="text-xs text-gray-400">Expires 12/26</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
            </section>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] p-6 rounded-3xl border border-white/10 sticky top-24">
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gray-400" /> Order Summary
              </h2>

              <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Ambur Star Biryani</h3>
                  <Link href="/restaurant/ambur-star" className="text-[10px] text-[#f8b11c] uppercase tracking-widest font-bold hover:underline">
                    View Menu
                  </Link>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex gap-2">
                      <span className="font-bold text-white border border-white/20 px-1.5 py-0.5 rounded text-xs">
                        {item.quantity}x
                      </span>
                      <span className="text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-white font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-3 pt-4 border-t border-white/10 mb-6 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="text-white">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Taxes & Charges</span>
                  <span className="text-white">₹{taxesAndCharges.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-end pt-4 border-t border-white/20 mb-8">
                <span className="text-white font-bold">Total</span>
                <span className="text-2xl font-bold text-white">₹{total.toFixed(2)}</span>
              </div>

              {/* Place Order Button */}
              <Link href="/orders" className="block">
                <button className="w-full py-4 rounded-2xl bg-[#f8b11c] text-black font-bold uppercase tracking-widest text-sm hover:bg-[#e0a019] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(248,177,28,0.3)] group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Place Order <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
