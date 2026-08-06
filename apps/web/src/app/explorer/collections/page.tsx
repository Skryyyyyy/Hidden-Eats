'use client';

import React from 'react';
import Link from 'next/link';
import ExplorerNav from '@/components/ExplorerNav';
import { useTheme } from '@/context/ThemeContext';
import { Bookmark, Plus, MapPin } from 'lucide-react';

export default function SeparateDinerCollectionsPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const collections = [
    {
      id: 'col-1',
      title: 'Top Secret Biryani Spots 🍲',
      description: 'Hand-picked off-menu mutton & chicken biryani spots.',
      count: 4,
      isPrivate: false,
    },
    {
      id: 'col-2',
      title: 'Late Night Midnight Cravings 🌙',
      description: 'Hidden food joints open till 3:00 AM.',
      count: 7,
      isPrivate: true,
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#000000] text-[#e1e1e1]'}`}>
      <ExplorerNav />

      <main className="max-w-4xl mx-auto w-full p-6 sm:p-10 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b] block mb-1">
              CURATED FOOD LISTS
            </span>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              My Saved Collections
            </h1>
            <p className="text-xs text-[#777777] mt-1">Organize your favorite secret food spots and share with friends.</p>
          </div>

          <button className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-[#f59e0b]/20">
            <Plus className="w-4 h-4" /> New List
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collections.map((col) => (
            <div
              key={col.id}
              className={`border rounded-2xl p-5 space-y-3 transition-all ${
                isLight ? 'bg-white border-slate-200 hover:shadow-lg' : 'bg-[#0a0a0a] border-[#1c1c1c] hover:border-[#f59e0b]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-[#181818] text-[#888888] border border-[#262626]">
                  {col.isPrivate ? '🔒 Private List' : '🌐 Public List'}
                </span>
                <span className="text-xs text-[#f59e0b] font-bold">{col.count} Spots</span>
              </div>

              <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{col.title}</h2>
              <p className="text-xs text-[#777777]">{col.description}</p>

              <div className="pt-2">
                <Link
                  href="/explorer"
                  className="text-xs font-semibold text-[#f59e0b] hover:underline flex items-center gap-1"
                >
                  View Saved Spots →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
