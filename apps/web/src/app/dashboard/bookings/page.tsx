'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle, Search, Filter, PhoneCall } from 'lucide-react';

interface Booking {
  id: string;
  guestName: string;
  phone: string;
  guestsCount: number;
  timeSlot: string;
  date: string;
  specialNotes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-101',
    guestName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    guestsCount: 4,
    timeSlot: ' Tonight, 8:30 PM',
    date: '16 Aug 2026',
    specialNotes: 'Prefers quiet corner table for birthday celebration.',
    status: 'PENDING',
  },
  {
    id: 'BK-102',
    guestName: 'Priya Patel',
    phone: '+91 91234 56789',
    guestsCount: 2,
    timeSlot: ' Tomorrow, 1:00 PM',
    date: '17 Aug 2026',
    specialNotes: 'Request window seating.',
    status: 'CONFIRMED',
  },
  {
    id: 'BK-103',
    guestName: 'Vikram Singh',
    phone: '+91 99887 76655',
    guestsCount: 6,
    timeSlot: ' 18 Aug, 9:00 PM',
    date: '18 Aug 2026',
    status: 'CONFIRMED',
  },
];

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState('');

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery)
  );

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141414] border border-white/10 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-[10px] font-bold text-[#f8b11c] uppercase tracking-widest block mb-1">
            Dine-In Reservations
          </span>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Table Seating & Guests Pipeline
          </h1>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search guest or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#f8b11c] transition-colors"
          />
        </div>
      </div>

      {/* Bookings Table / Cards */}
      <div className="bg-[#141414] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-black/20">
                <th className="p-5">Guest Info</th>
                <th className="p-5">Party Size</th>
                <th className="p-5">Date & Time</th>
                <th className="p-5">Special Notes</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-medium text-gray-300">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-5">
                    <span className="font-bold text-white block text-sm">{b.guestName}</span>
                    <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1 mt-0.5">
                      <PhoneCall className="w-3 h-3 text-[#f8b11c]" /> {b.phone}
                    </span>
                  </td>

                  <td className="p-5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#f8b11c]" /> {b.guestsCount} Guests
                    </span>
                  </td>

                  <td className="p-5">
                    <span className="text-white font-bold block">{b.timeSlot}</span>
                    <span className="text-[10px] text-gray-500">{b.date}</span>
                  </td>

                  <td className="p-5 max-w-xs truncate text-gray-400">
                    {b.specialNotes || 'Standard seating'}
                  </td>

                  <td className="p-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : b.status === 'CANCELLED'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : 'bg-[#f8b11c]/10 text-[#f8b11c] border-[#f8b11c]/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="p-5 text-right">
                    {b.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}
                          className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                          className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
