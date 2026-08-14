'use client';

import React from 'react';
import { User, Car, Star, Navigation, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

export default function DriverSettingsPage() {
  const stats = [
    { label: 'Rating', value: '4.9', icon: <Star className="w-4 h-4 text-[#f8b11c]" />, suffix: '★' },
    { label: 'Acceptance', value: '95', icon: <Navigation className="w-4 h-4 text-green-500" />, suffix: '%' },
    { label: 'Total Trips', value: '1,204', icon: <Car className="w-4 h-4 text-blue-500" />, suffix: '' },
  ];

  const settingsLinks = [
    { title: 'Account Details', icon: <User className="w-5 h-5" />, desc: 'Personal info, phone number' },
    { title: 'Vehicle Information', icon: <Car className="w-5 h-5" />, desc: 'Honda Activa (TN-01-AB-1234)' },
    { title: 'Privacy & Security', icon: <Shield className="w-5 h-5" />, desc: 'Password, 2FA, data usage' },
    { title: 'Help & Support', icon: <HelpCircle className="w-5 h-5" />, desc: 'FAQs, contact support' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8 animate-fade-in">
      
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-10 bg-[#1a1a1a] p-6 rounded-3xl border border-white/10">
        <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[#f8b11c] overflow-hidden flex items-center justify-center">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-display text-white tracking-wide">Rahul Sharma</h1>
          <p className="text-gray-400 text-sm mt-1">Delivery Partner since 2023</p>
          <div className="mt-3 inline-block bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
            Gold Tier
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1a1a1a] p-4 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center">
            <div className="bg-white/5 p-2 rounded-full mb-3">
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white leading-none mb-1">
              {stat.value}<span className="text-sm font-medium text-gray-500 ml-0.5">{stat.suffix}</span>
            </p>
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Settings Links */}
      <div className="space-y-3 mb-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-2">Settings</h3>
        {settingsLinks.map((link, i) => (
          <div key={i} className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors border border-white/5">
                {link.icon}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{link.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{link.desc}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        ))}
      </div>

      {/* Logout */}
      <button className="w-full bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-500 p-4 rounded-2xl border border-red-500/20 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs">
        <LogOut className="w-4 h-4" /> Log Out
      </button>

    </div>
  );
}
