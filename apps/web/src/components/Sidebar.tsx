'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export function HiddenEatsLogo({ href = '/dashboard' }: { href?: string }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <Link href={href} className="flex flex-col gap-2 group mb-4">
      <div className={`text-4xl md:text-5xl font-display uppercase tracking-widest leading-none ${
        isLight ? 'text-black group-hover:text-[#E93B3B]' : 'text-white group-hover:text-[#f8b11c]'
      } transition-colors duration-300`}>
        HIDDEN EATS
      </div>
      <div className="font-sans font-black text-xs uppercase tracking-[0.2em] opacity-80">
        Secret Food Discovery
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const navItems = [
    { href: '/dashboard', label: 'OVERVIEW' },
    { href: '/dashboard/menu', label: 'SECRET MENU' },
    { href: '/dashboard/bookings', label: 'RESERVATIONS' },
    { href: '/dashboard/reviews', label: 'LIVE REVIEWS' },
    { href: '/dashboard/analytics', label: 'DEMAND PREDICTOR' },
    { href: '/dashboard/settings', label: 'PARTNER SETTINGS' },
  ];

  return (
    <aside className={`w-[320px] border-r-4 p-8 flex flex-col justify-between hidden md:flex min-h-screen transition-colors duration-500 ${
      isLight ? 'bg-white border-black text-black' : 'bg-[#111111] border-[#222] text-white'
    }`}>
      <div className="space-y-12">
        <div>
          <HiddenEatsLogo href="/dashboard" />
        </div>

        <nav className="space-y-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-6 py-4 border-2 font-display uppercase tracking-wider text-2xl transition-all duration-300 ${
                  isActive
                    ? isLight
                      ? 'bg-[#E93B3B] text-white border-black shadow-[4px_4px_0_0_#000] -translate-y-1'
                      : 'bg-[#f8b11c] text-black border-white shadow-[4px_4px_0_0_#fff] -translate-y-1'
                    : isLight
                    ? 'border-transparent text-black/70 hover:text-black hover:border-black/20 hover:bg-black/5'
                    : 'border-transparent text-white/70 hover:text-white hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-6">
        <div className={`p-6 border-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${
          isLight ? 'bg-white border-black' : 'bg-[#E93B3B] border-black text-white'
        }`}>
          <span className="font-sans font-black text-xs uppercase tracking-widest opacity-90 block mb-2">
            PARTNER KITCHEN
          </span>
          <p className="font-display text-3xl uppercase tracking-wider leading-none mb-4">
            Grand Secret Kitchen
          </p>
          <div className="flex items-center gap-2 border-t-2 border-current pt-4">
            <div className={`w-3 h-3 rounded-full border-2 border-current ${isLight ? 'bg-[#10b981]' : 'bg-[#f8b11c]'}`} />
            <p className="font-sans font-bold text-sm uppercase tracking-widest">Verified</p>
          </div>
        </div>

        <Link href="/" className={`block w-full text-center py-4 border-2 font-display uppercase tracking-wider text-xl transition-all duration-300 ${
          isLight
            ? 'bg-black text-white border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1'
            : 'bg-white text-black border-white shadow-[4px_4px_0_0_#fff] hover:-translate-y-1'
        }`}>
          BACK TO FOOD APP
        </Link>
      </div>
    </aside>
  );
}
