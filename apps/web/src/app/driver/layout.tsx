'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, DollarSign, Settings, Power, Bell } from 'lucide-react';
import { HiddenEatsLogo } from '@/components/Sidebar';

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(false);

  const navItems = [
    { name: 'Map', href: '/driver/map', icon: <Map className="w-5 h-5" /> },
    { name: 'Earnings', href: '/driver/earnings', icon: <DollarSign className="w-5 h-5" /> },
    { name: 'Settings', href: '/driver/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row font-sans selection:bg-[#f8b11c] selection:text-black">
      
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#111] p-6 h-screen sticky top-0">
        <div className="mb-12">
          <HiddenEatsLogo />
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-[#f8b11c] text-black font-bold shadow-lg shadow-[#f8b11c]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                {item.icon}
                <span className="tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${
              isOnline 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
                : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
            }`}
          >
            <Power className="w-4 h-4" />
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative pb-20 md:pb-0 h-screen overflow-y-auto">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#111]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
            <span className="font-bold text-xs uppercase tracking-widest">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
              isOnline 
                ? 'border-red-500/50 text-red-500 bg-red-500/10' 
                : 'border-green-500/50 text-green-500 bg-green-500/10'
            }`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111]/90 backdrop-blur-xl border-t border-white/10 z-50 px-6 py-4 pb-safe flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-[#f8b11c]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-[#f8b11c]/10' : 'bg-transparent'}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
