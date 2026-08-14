'use client';

import React from 'react';
import { Wallet, TrendingUp, Clock, ChevronRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DriverEarningsPage() {
  const recentTrips = [
    { id: 1, restaurant: 'Ambur Star Biryani', amount: 185.50, time: '2:30 PM', date: 'Today' },
    { id: 2, restaurant: 'A2B Sweets', amount: 95.00, time: '1:15 PM', date: 'Today' },
    { id: 3, restaurant: 'Sangeetha Veg', amount: 120.00, time: '11:45 AM', date: 'Today' },
    { id: 4, restaurant: 'KFC', amount: 80.50, time: '9:30 PM', date: 'Yesterday' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8 animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2">Total Balance</span>
          <h1 className="text-5xl font-display text-white tracking-tight">₹1,245.00</h1>
        </div>
        <button className="bg-white/10 hover:bg-white/20 transition-colors text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 flex items-center gap-2">
          <Download className="w-4 h-4" /> Cash Out
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a1a] p-5 rounded-3xl border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Today's Earnings</span>
          </div>
          <p className="text-2xl font-bold text-white">₹400.50</p>
        </div>
        <div className="bg-[#1a1a1a] p-5 rounded-3xl border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Active Hours</span>
          </div>
          <p className="text-2xl font-bold text-white">4.5h</p>
        </div>
        <div className="bg-[#1a1a1a] p-5 rounded-3xl border border-white/10 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Wallet className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Completed Trips</span>
          </div>
          <p className="text-2xl font-bold text-white">12</p>
        </div>
      </div>

      {/* Quests & Promotions */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#f8b11c]/10 p-6 rounded-3xl border border-[#f8b11c]/30 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <TrendingUp className="w-24 h-24 text-[#f8b11c]" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="bg-[#f8b11c] text-black px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest inline-block mb-2">
                Active Quest
              </span>
              <h3 className="text-xl font-bold text-white">Weekend Warrior</h3>
              <p className="text-sm text-gray-400">Complete 15 trips this weekend to earn an extra ₹500.</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#f8b11c]">12<span className="text-sm text-gray-400">/15</span></span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#f8b11c] to-[#e0a019]"
            />
          </div>
          <p className="text-xs text-gray-500 font-medium mt-3 text-right">Ends in 14 hours</p>
        </div>
      </div>

      {/* Fake Weekly Chart */}
      <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 mb-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Weekly Overview</h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {[40, 70, 45, 90, 60, 100, 30].map((height, i) => (
            <div key={i} className="w-full relative group flex flex-col items-center">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-white text-black text-[10px] font-bold px-2 py-1 rounded transition-opacity pointer-events-none">
                ₹{height * 15}
              </div>
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className={`w-full rounded-t-lg ${i === 5 ? 'bg-[#f8b11c]' : 'bg-white/20'}`}
              />
              <span className="text-[10px] text-gray-500 font-medium mt-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Recent Trips</h3>
          <button className="text-[10px] text-[#f8b11c] uppercase font-bold tracking-widest hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {recentTrips.map((trip) => (
            <div key={trip.id} className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{trip.restaurant}</h4>
                  <p className="text-xs text-gray-500 mt-1">{trip.date} • {trip.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-white">₹{trip.amount.toFixed(2)}</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
