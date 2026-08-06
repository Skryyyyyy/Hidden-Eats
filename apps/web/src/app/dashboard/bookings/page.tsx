'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { createClient } from '@/lib/supabase';
import { Calendar, Users, Clock, Check, X, ChevronRight } from 'lucide-react';

interface BookingRecord {
  id: string;
  userName: string;
  partySize: number;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests: string;
}

export default function NotionPartnerBookingsPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      id: 'b-1',
      userName: 'Rahul Sharma',
      partySize: 4,
      time: 'Tonight at 8:30 PM',
      status: 'pending',
      specialRequests: 'Anniversary celebration, quiet table requested.',
    },
    {
      id: 'b-2',
      userName: 'Priya Patel',
      partySize: 2,
      time: 'Tomorrow at 1:00 PM',
      status: 'confirmed',
      specialRequests: 'Window seating if available.',
    },
    {
      id: 'b-3',
      userName: 'Vikram Singh',
      partySize: 6,
      time: 'Aug 7 at 9:00 PM',
      status: 'confirmed',
      specialRequests: 'High chair required.',
    },
  ]);

  const supabase = createClient();

  useEffect(() => {
    const loadBookings = async () => {
      const { data, error } = await supabase.from('bookings').select('*');
      if (!error && data && data.length > 0) {
        setBookings(
          data.map((b: any) => ({
            id: b.id,
            userName: b.user_id ? `User #${b.user_id.slice(0, 5)}` : 'Diner',
            partySize: b.party_size,
            time: new Date(b.booking_time).toLocaleString(),
            status: b.status,
            specialRequests: b.special_requests || '',
          }))
        );
      }
    };
    loadBookings();
  }, [supabase]);

  const updateStatus = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    try {
      await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    } catch (e) {
      console.log('Status updated locally');
    }
  };

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
            <span className={isLight ? 'text-[#111111] font-bold' : 'text-white font-bold'}>Table Reservations</span>
          </div>

          <Link href="/dashboard" className={`text-label text-[11px] uppercase tracking-widest font-bold transition-colors ${
            isLight ? 'text-[#666666] hover:text-[#111111]' : 'text-[#888888] hover:text-white'
          }`}>
            ← Back to Overview
          </Link>
        </header>

        <main className="p-6 sm:p-12 space-y-8 max-w-6xl mx-auto w-full animate-fade-in">
          <div>
            <h1 className={`text-h1 text-4xl tracking-tight mb-2 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
              Table Reservations
            </h1>
            <p className="text-body text-[13px] text-[#666666] dark:text-[#aaaaaa]">
              Review and manage table reservation requests in real-time.
            </p>
          </div>

          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className={`border rounded-[32px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all shadow-sm hover:shadow-md ${
                  isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
                }`}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className={`text-card-title text-base ${isLight ? 'text-[#111111]' : 'text-white'}`}>{b.userName}</span>
                    <span className={`text-label text-[11px] px-3 py-1 rounded-2xl border font-bold flex items-center gap-1.5 ${
                      isLight ? 'bg-[#FAFAFA] border-black/5 text-[#666666]' : 'bg-[#0A0A0A] border-white/5 text-[#888888]'
                    }`}>
                      <Users className="w-3.5 h-3.5" /> {b.partySize} Guests
                    </span>
                    <span
                      className={`text-label text-[10px] uppercase tracking-wider px-3 py-1 rounded-2xl font-bold border ${
                        b.status === 'confirmed'
                          ? isLight ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]' : 'bg-[#092615] text-[#10b981] border-[#0f4424]'
                          : b.status === 'cancelled'
                          ? isLight ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]' : 'bg-[#260909] text-red-400 border-[#440f0f]'
                          : isLight ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]' : 'bg-[#241a08] text-[#f59e0b] border-[#44300a]'
                      }`}
                    >
                      ● {b.status}
                    </span>
                  </div>

                  <p className={`text-body text-[13px] flex items-center gap-1.5 ${
                    isLight ? 'text-[#4B5563]' : 'text-[#aaaaaa]'
                  }`}>
                    <Clock className="w-4 h-4" /> {b.time}
                  </p>
                  
                  {b.specialRequests && (
                    <div className={`mt-3 p-3 rounded-[24px] border text-body text-[13px] italic ${
                      isLight ? 'bg-[#FAFAFA] border-[#FCA5A5]/30 text-[#666666]' : 'bg-[#0A0A0A] border-[#441010]/50 text-[#888888]'
                    }`}>
                      <span className="font-bold opacity-70">Note:</span> "{b.specialRequests}"
                    </div>
                  )}
                </div>

                {b.status === 'pending' && (
                  <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => updateStatus(b.id, 'confirmed')}
                      className={`flex-1 sm:flex-none px-5 py-2.5 rounded-[24px] text-label text-[11px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                        isLight
                          ? 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-[#16A34A]/25'
                          : 'bg-[#10b981] hover:bg-[#059669] text-black shadow-[#10b981]/25'
                      }`}
                    >
                      <Check className="w-4 h-4" /> Confirm Table
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, 'cancelled')}
                      className={`flex-1 sm:flex-none px-5 py-2.5 rounded-[24px] text-label text-[11px] uppercase tracking-wider font-bold border transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                        isLight
                          ? 'bg-white border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEE2E2]'
                          : 'bg-[#111111] border-[#441010] text-[#ef4444] hover:bg-[#1a0f0f]'
                      }`}
                    >
                      <X className="w-4 h-4" /> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
