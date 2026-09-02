'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, X, Sparkles, ShieldCheck, Download, Share2, Check } from 'lucide-react';
import { generateSecretQRToken, generateLocalQRCodeDataUrl } from '@/lib/qrPass';

interface DinerSecretQRPassModalProps {
  bookingOrOrder: {
    type: 'TABLE_BOOKING' | 'FOOD_ORDER';
    id: string;
    restaurantName: string;
    dinerName: string;
    details: string;
    tableAssigned?: string;
  };
  onClose: () => void;
}

export default function DinerSecretQRPassModal({ bookingOrOrder, onClose }: DinerSecretQRPassModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const qrData = generateSecretQRToken({
    type: bookingOrOrder.type,
    id: bookingOrOrder.id,
    restaurantId: 'res-1',
    restaurantName: bookingOrOrder.restaurantName || 'Grand Secret Kitchen',
    dinerName: bookingOrOrder.dinerName || 'Rahul Sharma',
    dinerPhoneMasked: '+91 98*** ***10',
    details: bookingOrOrder.details || 'Table for 4 • 8:30 PM',
    tableAssigned: bookingOrOrder.tableAssigned || 'Table #4',
  });

  useEffect(() => {
    generateLocalQRCodeDataUrl(qrData.token).then((dataUrl) => {
      setQrCodeDataUrl(dataUrl);
    });
  }, [qrData.token]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-[#0a0d14] border-2 border-[#f59e0b]/50 rounded-[36px] p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden text-white text-center space-y-5">
        
        {/* Top Gold Glowing Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40">
            <Sparkles className="w-3 h-3" /> Hidden Eats Secret Pass
          </span>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-xl font-black tracking-tight">{bookingOrOrder.restaurantName}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{bookingOrOrder.details}</p>
        </div>

        {/* QR Code Container */}
        <div className="relative p-5 rounded-3xl bg-white shadow-2xl flex flex-col items-center justify-center mx-auto w-64 h-64 border-4 border-[#f59e0b]">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt="Secret Pass QR Code"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-[#f59e0b] border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-black font-bold uppercase tracking-wider">Generating Pass...</span>
            </div>
          )}
        </div>

        {/* Table & PIN Details */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          {bookingOrOrder.tableAssigned && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Reserved Table</span>
              <span className="font-black text-emerald-400 text-sm">{bookingOrOrder.tableAssigned}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-xs pt-1 border-t border-white/10">
            <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">4-Digit Backup PIN</span>
            <span className="font-mono font-black text-lg text-[#f59e0b] tracking-widest">{qrData.backupPin}</span>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 leading-relaxed">
          Show this QR code upon arrival at the secret alley entrance for instant table seating. Valid for 24h.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#f59e0b]/25"
        >
          Got It, Done
        </button>
      </div>
    </div>
  );
}
