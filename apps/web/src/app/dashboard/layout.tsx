'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, BarChart3, Settings, Bell, PauseCircle } from 'lucide-react';
import { HiddenEatsLogo } from '@/components/Sidebar';

export default function RestaurantDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isBusyMode, setIsBusyMode] = useState(false);

  const navItems = [
    { name: 'Kitchen Display', href: '/dashboard/kitchen', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Menu Management', href: '/dashboard/menu', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { name: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans selection:bg-[#f8b11c] selection:text-black">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#111] p-6 h-screen sticky top-0 hidden md:flex flex-col">
        <div className="mb-12">
          <HiddenEatsLogo />
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-2">Partner Portal</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-white/10 text-white font-bold border border-white/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium border border-transparent'
                }`}
              >
                {item.icon}
                <span className="tracking-wide text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="mt-auto border-t border-white/10 pt-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="font-bold text-white">AS</span>
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-tight">Ambur Star Biryani</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-[#111]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
          <div>
            <h2 className="text-xl font-display uppercase tracking-widest hidden md:block">
              {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
            </h2>
            {/* Mobile Logo */}
            <div className="md:hidden">
               <HiddenEatsLogo />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#111]"></span>
            </button>
            
            <button 
              onClick={() => setIsBusyMode(!isBusyMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                isBusyMode 
                  ? 'border-red-500 text-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                  : 'border-white/20 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <PauseCircle className="w-4 h-4" />
              {isBusyMode ? 'Busy Mode (Paused)' : 'Normal Mode'}
            </button>
          </div>
        </header>

        {/* Top notification bar for busy mode */}
        {isBusyMode && (
          <div className="bg-red-500 text-white text-center py-2 text-xs font-bold uppercase tracking-widest animate-pulse">
            Warning: Incoming orders are temporarily paused. Estimated prep times increased by 15 mins.
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>

    </div>
  );
}
