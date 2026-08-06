'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { createClient } from '@/lib/supabase';
import { Star, MessageSquare, ShieldCheck, RefreshCw, ChevronRight } from 'lucide-react';

export default function PartnerReviewsPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [reviews, setReviews] = useState([
    {
      id: 'r-1',
      user: 'Rahul S.',
      rating: 5,
      food: 5,
      price: 5,
      comment: 'Absolute gem! The secret smoked biryani blew my mind.',
      date: 'Just now',
    },
    {
      id: 'r-2',
      user: 'Ananya M.',
      rating: 5,
      food: 5,
      price: 4,
      comment: 'Peaceful ambience, amazing off-menu wings.',
      date: 'Yesterday',
    },
    {
      id: 'r-3',
      user: 'Authenticated Explorer',
      rating: 5,
      food: 5,
      price: 5,
      comment: 'Best secret biryani in Bangalore! Recommending to everyone.',
      date: '2 hours ago',
    },
  ]);

  const supabase = createClient();

  // Real-time Supabase Subscription for Customer Reviews
  useEffect(() => {
    const fetchLiveReviews = async () => {
      const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        const formatted = data.map((r: any) => ({
          id: r.id,
          user: r.user_id ? `Explorer #${r.user_id.slice(0, 5)}` : 'Diner Explorer',
          rating: r.rating_overall || 5,
          food: r.rating_food || 5,
          price: r.rating_price || 5,
          comment: r.comment || '',
          date: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setReviews(formatted);
      }
    };

    fetchLiveReviews();

    const channel = supabase
      .channel('reviews-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, (payload) => {
        const newRev = payload.new as any;
        setReviews((prev) => [
          {
            id: newRev.id,
            user: 'New Diner Reviewer',
            rating: newRev.rating_overall || 5,
            food: newRev.rating_food || 5,
            price: newRev.rating_price || 5,
            comment: newRev.comment || '',
            date: 'Just now',
          },
          ...prev,
        ]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className={`min-h-screen flex font-sans antialiased text-body transition-colors ${
      isLight ? 'bg-[#FAFAFA] text-[#111111]' : 'bg-[#0A0A0A] text-white'
    }`}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-20 px-8 flex items-center justify-between sticky top-0 z-20 transition-all border-b glass-header ${
          isLight ? 'border-black/5 bg-[#FAFAFA]/70' : 'border-white/5 bg-[#0A0A0A]/70'
        }`}>
          <div className="flex items-center gap-2 text-label text-[11px] uppercase tracking-widest font-bold">
            <Link href="/dashboard" className={`transition-colors ${isLight ? 'text-[#666666] hover:text-[#111111]' : 'text-[#888888] hover:text-white'}`}>Dashboard</Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className={isLight ? 'text-[#111111] font-bold' : 'text-white font-bold'}>Customer Reviews</span>
          </div>

          <Link href="/dashboard" className={`text-label text-[11px] uppercase tracking-widest font-bold transition-colors ${
            isLight ? 'text-[#666666] hover:text-[#111111]' : 'text-[#888888] hover:text-white'
          }`}>
            ← Back to Overview
          </Link>
        </header>

        <main className="p-6 sm:p-12 space-y-8 max-w-5xl mx-auto w-full animate-fade-in">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-label text-[10px] uppercase font-bold px-3 py-1 rounded-2xl border flex items-center gap-1.5 ${
                isLight ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]' : 'bg-[#092615] text-[#10b981] border-[#0f4424]'
              }`}>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> LIVE GOOGLE & DINER REVIEWS SYNC
              </span>
            </div>
            <h1 className={`text-h1 text-4xl tracking-tight mb-1 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
              Community Food Reviews Feed
            </h1>
            <p className="text-body text-[13px] text-[#666666] dark:text-[#aaaaaa]">
              Reviews submitted by diners on the mobile & web app automatically appear here in real-time.
            </p>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className={`border rounded-[32px] p-6 md:p-8 transition-all shadow-sm hover:shadow-md ${
                isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                      isLight ? 'bg-[#F3F4F6] text-[#111111]' : 'bg-[#1A1A1A] text-white'
                    }`}>
                      {rev.user.charAt(0)}
                    </div>
                    <div>
                      <span className={`text-card-title text-base block ${isLight ? 'text-[#111111]' : 'text-white'}`}>{rev.user}</span>
                      <span className={`text-label text-[10px] font-bold mt-1 flex items-center gap-1.5 ${
                        isLight ? 'text-[#111111]' : 'text-white'
                      }`}>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'fill-transparent opacity-30'} ${
                              isLight ? 'text-[#111111]' : 'text-white'
                            }`} />
                          ))}
                        </div>
                        {rev.rating} / 5 Overall
                      </span>
                    </div>
                  </div>
                  <span className={`text-label text-[11px] uppercase tracking-widest font-bold ${isLight ? 'text-[#666666]' : 'text-[#777777]'}`}>{rev.date}</span>
                </div>
                
                <p className={`text-body text-[15px] leading-relaxed mb-6 ${
                  isLight ? 'text-[#4B5563]' : 'text-[#cccccc]'
                }`}>"{rev.comment}"</p>
                
                <div className={`flex flex-wrap items-center gap-4 text-label text-[11px] pt-4 border-t ${
                  isLight ? 'text-[#666666] border-black/5' : 'text-[#777777] border-white/5'
                }`}>
                  <span className="flex items-center gap-2">
                    Taste: <span className={`font-bold px-2 py-0.5 rounded-lg border ${
                      isLight ? 'bg-[#F3F4F6] text-[#111111] border-[#D62828]/20' : 'bg-[#1A1A1A] text-white border-[#FFB703]/30'
                    }`}>★ {rev.food}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    Value: <span className={`font-bold px-2 py-0.5 rounded-lg border ${
                      isLight ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]' : 'bg-[#092615] text-[#10b981] border-[#0f4424]'
                    }`}>★ {rev.price}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
