'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export function HiddenEatsLogo({ href = '/dashboard' }: { href?: string }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <Link href={href} className="flex items-center gap-3 group">
      <div className={`w-10 h-10 rounded-xl overflow-hidden border shadow-sm group-hover:scale-105 transition-transform shrink-0 ${
        isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#111111]'
      }`}>
        <img
          src="/logo.png"
          alt="Hidden Eats Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <span className={`text-card-title text-[15px] transition-colors leading-none tracking-tight ${
          isLight ? 'text-[#111111] group-hover:text-black' : 'text-white group-hover:text-[#FAFAFA]'
        }`}>
          HIDDEN EATS
        </span>
        <span className={`text-label text-[9px] tracking-[0.15em] uppercase mt-1 font-bold ${
          isLight ? 'text-[#666666]' : 'text-[#888888]'
        }`}>
          Secret Food Discovery
        </span>
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '✦' },
    { href: '/dashboard/menu', label: 'Secret Menu', icon: '❖' },
    { href: '/dashboard/bookings', label: 'Reservations', icon: '🗓' },
    { href: '/dashboard/reviews', label: 'Live Reviews', icon: '★' },
    { href: '/dashboard/analytics', label: 'Demand Predictor', icon: '📈' },
    { href: '/dashboard/settings', label: 'Partner Settings', icon: '⚙' },
  ];

  return (
    <aside className={`w-[260px] border-r p-6 flex flex-col justify-between hidden md:flex min-h-screen transition-colors duration-500 ${
      isLight ? 'bg-[#FAFAFA] border-black/5 text-[#111111]' : 'bg-[#0A0A0A] border-white/5 text-white'
    }`}>
      <div className="space-y-10">
        <div className="px-2">
          <HiddenEatsLogo href="/dashboard" />
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-[14px] text-label text-[13px] font-bold transition-all ${
                  isActive
                    ? isLight
                      ? 'bg-[#111111] text-white shadow-md shadow-black/10 hover:shadow-black/20'
                      : 'bg-white text-black shadow-md shadow-white/10 hover:shadow-white/20'
                    : isLight
                    ? 'text-[#666666] hover:text-[#111111] hover:bg-black/5'
                    : 'text-[#888888] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`text-[15px] ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`p-5 rounded-2xl border space-y-1.5 shadow-sm transition-colors ${
        isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
      }`}>
        <span className={`text-label text-[10px] uppercase tracking-widest font-bold ${isLight ? 'text-[#666666]' : 'text-[#888888]'}`}>
          PARTNER KITCHEN
        </span>
        <p className={`text-card-title text-[14px] leading-snug ${isLight ? 'text-[#111111]' : 'text-white'}`}>
          Grand Secret Kitchen
        </p>
        <div className="flex items-center gap-1.5 pt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <p className="text-label text-[10px] text-[#10b981] font-bold">FSSAI Verified</p>
        </div>
      </div>
    </aside>
  );
}
