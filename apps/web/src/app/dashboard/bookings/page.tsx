'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  PhoneCall,
  QrCode,
  Sparkles,
  Layers,
  CreditCard,
  Zap,
  Check,
} from 'lucide-react';
import QRScannerModal from '@/components/QRScannerModal';
import DinerSecretQRPassModal from '@/components/DinerSecretQRPassModal';

interface Booking {
  id: string;
  guestName: string;
  phone: string;
  guestsCount: number;
  timeSlot: string;
  date: string;
  specialNotes?: string;
  tableAssigned?: string;
  status: 'PENDING' | 'CONFIRMED' | 'SEATED' | 'CANCELLED';
}

interface TableSlot {
  tableNumber: string;
  capacity: number;
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED';
  dinerName?: string;
}

const INITIAL_TABLES: TableSlot[] = [
  { tableNumber: 'Table #1', capacity: 2, status: 'AVAILABLE' },
  { tableNumber: 'Table #2', capacity: 2, status: 'RESERVED', dinerName: 'Priya Patel' },
  { tableNumber: 'Table #3', capacity: 4, status: 'AVAILABLE' },
  { tableNumber: 'Table #4', capacity: 4, status: 'OCCUPIED', dinerName: 'Rahul Sharma (Seated)' },
  { tableNumber: 'Table #5', capacity: 4, status: 'AVAILABLE' },
  { tableNumber: 'Table #6', capacity: 6, status: 'AVAILABLE' },
  { tableNumber: 'Table #7', capacity: 6, status: 'RESERVED', dinerName: 'Vikram Singh' },
  { tableNumber: 'Table #8', capacity: 8, status: 'AVAILABLE' },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-101',
    guestName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    guestsCount: 4,
    timeSlot: 'Tonight, 8:30 PM',
    date: '16 Aug 2026',
    tableAssigned: 'Table #4',
    specialNotes: 'Prefers quiet corner table for birthday celebration.',
    status: 'SEATED',
  },
  {
    id: 'BK-102',
    guestName: 'Priya Patel',
    phone: '+91 91234 56789',
    guestsCount: 2,
    timeSlot: 'Tomorrow, 1:00 PM',
    date: '17 Aug 2026',
    tableAssigned: 'Table #2',
    specialNotes: 'Request window seating.',
    status: 'CONFIRMED',
  },
  {
    id: 'BK-103',
    guestName: 'Vikram Singh',
    phone: '+91 99887 76655',
    guestsCount: 6,
    timeSlot: '18 Aug, 9:00 PM',
    date: '18 Aug 2026',
    tableAssigned: 'Table #7',
    status: 'PENDING',
  },
];

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [tables, setTables] = useState<TableSlot[]>(INITIAL_TABLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [activeQRPass, setActiveQRPass] = useState<any | null>(null);
  const [payoutTransferred, setPayoutTransferred] = useState(false);

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const handleQRVerified = (pass: any) => {
    setBookings((prev) => {
      const match = prev.find(
        (b) => b.id === pass.id || b.guestName.toLowerCase().includes(pass.dinerName.toLowerCase())
      );
      if (match) {
        return prev.map((b) => (b.id === match.id ? { ...b, status: 'SEATED' } : b));
      } else {
        const newBooking: Booking = {
          id: pass.id || `BK-${Date.now().toString().slice(-3)}`,
          guestName: pass.dinerName,
          phone: pass.dinerPhoneMasked,
          guestsCount: 4,
          timeSlot: 'Just Arrived',
          date: 'Today',
          tableAssigned: pass.tableAssigned || 'Table #1',
          specialNotes: pass.details,
          status: 'SEATED',
        };
        return [newBooking, ...prev];
      }
    });

    // Update floor table status
    if (pass.tableAssigned) {
      setTables((prev) =>
        prev.map((t) =>
          t.tableNumber === pass.tableAssigned
            ? { ...t, status: 'OCCUPIED', dinerName: `${pass.dinerName} (Seated)` }
            : t
        )
      );
    }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery)
  );

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8 text-white">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141414] border border-white/10 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-[10px] font-bold text-[#f8b11c] uppercase tracking-widest block mb-1">
            Dine-In Reservations & Live Check-In
          </span>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Table Seating & Guests Pipeline
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search guest or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#f8b11c] transition-colors"
            />
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#f8b11c] hover:bg-[#e0a019] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-[#f8b11c]/25 shrink-0 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Diner QR</span>
          </button>
        </div>
      </div>

      {/* 🗺️ INTERACTIVE TABLE OCCUPANCY FLOOR MAP */}
      <div className="bg-[#141414] border border-white/10 p-6 rounded-3xl space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#f8b11c]" />
            <h3 className="text-base font-black uppercase tracking-tight">Live Dining Floor Plan</h3>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Seated (Occupied)</span>
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#f8b11c]" /> Reserved (Incoming)</span>
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-white/20" /> Available</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {tables.map((t) => (
            <div
              key={t.tableNumber}
              className={`p-4 rounded-2xl border transition-all space-y-1.5 ${
                t.status === 'OCCUPIED'
                  ? 'bg-emerald-500/15 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : t.status === 'RESERVED'
                  ? 'bg-[#f8b11c]/15 border-[#f8b11c]/40'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono font-black text-xs text-white">{t.tableNumber}</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/40 text-gray-300">
                  {t.capacity} Seats
                </span>
              </div>
              <p className="text-xs font-bold truncate text-white">
                {t.dinerName || 'Available for Walk-ins'}
              </p>
              <span
                className={`text-[9px] font-black uppercase tracking-widest block ${
                  t.status === 'OCCUPIED'
                    ? 'text-emerald-400'
                    : t.status === 'RESERVED'
                    ? 'text-[#f8b11c]'
                    : 'text-gray-400'
                }`}
              >
                ● {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 💳 INSTANT DAILY UPI PARTNER SETTLEMENT CARD */}
      <div className="bg-gradient-to-r from-[#1b2333] to-[#0f172a] border border-[#f8b11c]/40 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#f8b11c] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-[#f8b11c]" /> Instant End-of-Day Payout Settlement
          </span>
          <h3 className="text-2xl font-black text-white">₹3,840.00 Net Payout Available</h3>
          <p className="text-xs text-gray-400">
            85% Kitchen Revenue Share (12 Dine-In & Secret Orders) • Zero Commission Delay
          </p>
        </div>

        <button
          onClick={() => {
            setPayoutTransferred(true);
            setTimeout(() => setPayoutTransferred(false), 4000);
          }}
          disabled={payoutTransferred}
          className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 shrink-0 cursor-pointer ${
            payoutTransferred
              ? 'bg-emerald-500 text-black shadow-emerald-500/25'
              : 'bg-[#f8b11c] hover:bg-[#e0a019] text-black shadow-[#f8b11c]/25'
          }`}
        >
          {payoutTransferred ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Transferred to hotel@upi!</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>1-Tap Instant UPI Payout</span>
            </>
          )}
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#141414] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-black/20">
                <th className="p-5">Guest Info</th>
                <th className="p-5">Party Size</th>
                <th className="p-5">Date & Time</th>
                <th className="p-5">Assigned Seating</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions & QR Pass</th>
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

                  <td className="p-5">
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-[11px]">
                      {b.tableAssigned || 'Table Assigned on Arrival'}
                    </span>
                  </td>

                  <td className="p-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        b.status === 'SEATED'
                          ? 'bg-emerald-500 text-black font-black border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                          : b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : b.status === 'CANCELLED'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : 'bg-[#f8b11c]/10 text-[#f8b11c] border-[#f8b11c]/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="p-5 text-right space-x-2">
                    <button
                      onClick={() =>
                        setActiveQRPass({
                          type: 'TABLE_BOOKING',
                          id: b.id,
                          restaurantName: 'Grand Secret Kitchen',
                          dinerName: b.guestName,
                          details: `${b.guestsCount} Guests • ${b.timeSlot}`,
                          tableAssigned: b.tableAssigned,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-gray-200 transition-colors cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#f8b11c]" /> View Secret QR Pass
                    </button>

                    {b.status === 'PENDING' && (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}
                          className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                          className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1"
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

      {/* QR Scanner Modal for Hotel Staff */}
      {showScanner && (
        <QRScannerModal
          onClose={() => setShowScanner(false)}
          onVerified={handleQRVerified}
        />
      )}

      {/* Diner Secret QR Pass Modal */}
      {activeQRPass && (
        <DinerSecretQRPassModal
          bookingOrOrder={activeQRPass}
          onClose={() => setActiveQRPass(null)}
        />
      )}

    </div>
  );
}
