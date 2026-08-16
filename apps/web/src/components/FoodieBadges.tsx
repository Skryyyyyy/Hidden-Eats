'use client';

import React from 'react';
import { Award, Flame, Compass, Moon, Sparkles, CheckCircle2 } from 'lucide-react';

interface Badge {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number; // 0 to 100
  perk: string;
}

const BADGES: Badge[] = [
  {
    id: 'b-1',
    title: 'Biryani Legend',
    category: 'Gourmet Explorer',
    description: 'Ordered 5 authentic dum biryanis from local hidden gems.',
    icon: <Flame className="w-5 h-5 text-[#f8b11c]" />,
    unlocked: true,
    progress: 100,
    perk: 'Free Extra Salna on Biryani Orders',
  },
  {
    id: 'b-2',
    title: 'Secret Vault Master',
    category: 'Gamification',
    description: 'Unlocked 3 off-menu secret dishes with passcodes.',
    icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    unlocked: true,
    progress: 100,
    perk: 'Exclusive Access to Night Chef Specials',
  },
  {
    id: 'b-[#b-3]',
    title: 'Midnight Craver',
    category: 'Night Owl',
    description: 'Placed 3 orders after 10 PM in Tamil Nadu.',
    icon: <Moon className="w-5 h-5 text-blue-400" />,
    unlocked: false,
    progress: 66,
    perk: 'Zero Delivery Fee After 10 PM',
  },
  {
    id: 'b-4',
    title: 'Tamil Nadu Pioneer',
    category: 'Statewide Foodie',
    description: 'Discovered hidden gems across 3 different cities.',
    icon: <Compass className="w-5 h-5 text-emerald-400" />,
    unlocked: false,
    progress: 33,
    perk: '5% Bonus Cashback on Explorer Orders',
  },
];

export default function FoodieBadges() {
  return (
    <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#f8b11c]/20 text-[#f8b11c] rounded-xl border border-[#f8b11c]/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f8b11c] block">
              Collector Status
            </span>
            <h3 className="font-display text-xl uppercase tracking-tight text-white font-bold">
              Foodie Achievements & Perks
            </h3>
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#f8b11c] bg-[#f8b11c]/10 px-3 py-1 rounded-full border border-[#f8b11c]/20">
          VIP Level 2
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BADGES.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-2xl border transition-all ${
              badge.unlocked
                ? 'bg-black/40 border-[#f8b11c]/30 shadow-lg'
                : 'bg-black/20 border-white/5 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl border ${
                    badge.unlocked
                      ? 'bg-white/5 border-white/10'
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    {badge.title}
                    {badge.unlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#f8b11c]" />
                    )}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-medium block">
                    {badge.category}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              {badge.description}
            </p>

            {/* Progress Bar */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span>Progress</span>
                <span>{badge.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#f8b11c] to-[#e0a019] rounded-full transition-all duration-500"
                  style={{ width: `${badge.progress}%` }}
                />
              </div>
            </div>

            {/* Unlocked Perk */}
            <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-medium text-[#f8b11c]">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>Perk: {badge.perk}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
