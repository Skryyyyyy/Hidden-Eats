'use client';

import React, { useState } from 'react';
import { QrCode, X, Check, ShieldCheck, User, Sparkles, Key, AlertCircle, RefreshCw } from 'lucide-react';
import { generateSecretQRToken } from '@/lib/qrPass';

interface QRScannerModalProps {
  onClose: () => void;
  onVerified?: (pass: any) => void;
}

export default function QRScannerModal({ onClose, onVerified }: QRScannerModalProps) {
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [verifiedPass, setVerifiedPass] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = async (tokenOrPin: string) => {
    if (!tokenOrPin.trim()) return;
    setIsScanning(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/qr/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenOrPin: tokenOrPin.trim() }),
      });

      const data = await res.json();
      setIsScanning(false);

      if (res.ok && data.success) {
        setVerifiedPass(data.pass);
        if (onVerified) onVerified(data.pass);
      } else {
        setErrorMsg(data.error || 'Invalid or unverified QR Pass.');
      }
    } catch {
      setIsScanning(false);
      setErrorMsg('Failed to connect to verification server.');
    }
  };

  // Demo helper to simulate instant scanning of sample diner passes
  const handleSimulateScan = (type: 'BOOKING' | 'ORDER') => {
    let mock;
    if (type === 'BOOKING') {
      mock = generateSecretQRToken({
        type: 'TABLE_BOOKING',
        id: 'BK_101',
        restaurantId: 'res-1',
        restaurantName: 'Grand Secret Kitchen',
        dinerName: 'Rahul Sharma',
        dinerPhoneMasked: '+91 98*** ***10',
        details: 'Table for 4 • 8:30 PM (Window Seat)',
        tableAssigned: 'Table #4',
      });
    } else {
      mock = generateSecretQRToken({
        type: 'FOOD_ORDER',
        id: 'ORD_9912',
        restaurantId: 'res-1',
        restaurantName: 'Grand Secret Kitchen',
        dinerName: 'Priya Sundaram',
        dinerPhoneMasked: '+91 94*** ***22',
        details: '2x Chef Secret Smoked Biryani, 1x Brain Fry',
      });
    }

    handleVerify(mock.token);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#0b0e14] border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight">Scan Diner Secret Pass</h3>
              <p className="text-[11px] text-gray-400">Verify Table Reservations & Pickup Orders</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Success View */}
        {verifiedPass ? (
          <div className="py-6 space-y-6 animate-scale-up">
            <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 block">
                {verifiedPass.type === 'TABLE_BOOKING' ? 'Table Reservation Verified' : 'Food Order Handover Confirmed'}
              </span>
              <h4 className="text-xl font-black text-white">{verifiedPass.dinerName}</h4>
              <p className="text-xs text-gray-300 font-mono">{verifiedPass.dinerPhoneMasked}</p>
            </div>

            {/* Pass Details Breakdown */}
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-gray-400 uppercase tracking-wider text-[10px] font-bold">Pass Reference ID</span>
                <span className="font-mono font-bold text-[#f59e0b]">{verifiedPass.id}</span>
              </div>

              {verifiedPass.tableAssigned && (
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] font-bold">Assigned Seating</span>
                  <span className="font-bold text-white bg-[#f59e0b]/20 px-2.5 py-1 rounded-full text-emerald-400 border border-emerald-500/30">
                    {verifiedPass.tableAssigned}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-start pt-1">
                <span className="text-gray-400 uppercase tracking-wider text-[10px] font-bold">Order Details</span>
                <span className="font-bold text-white text-right max-w-[200px]">{verifiedPass.details}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setVerifiedPass(null)}
                className="flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Scan Another Pass
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#f59e0b]/25"
              >
                Done & Confirm Seated
              </button>
            </div>
          </div>
        ) : (
          /* Scanner Active View */
          <div className="py-6 space-y-6">
            
            {/* Camera Viewport Simulation */}
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-[#05070d] border border-white/10 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
              {/* Aiming Reticle Frame */}
              <div className="relative w-48 h-48 border-2 border-dashed border-[#f59e0b]/60 rounded-3xl flex items-center justify-center">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#f59e0b] -translate-x-1 -translate-y-1 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#f59e0b] translate-x-1 -translate-y-1 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#f59e0b] -translate-x-1 translate-y-1 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#f59e0b] translate-x-1 translate-y-1 rounded-br-lg" />
                
                {/* Scanning Laser Line Animation */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent animate-pulse shadow-[0_0_12px_#f59e0b]" />
              </div>

              <span className="text-[11px] text-gray-400 font-medium mt-4">
                Point camera at diner's <strong className="text-white">Secret Pass QR</strong> on their phone
              </span>
            </div>

            {/* Manual 4-Digit PIN Entry */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">
                Or Enter Diner's 4-Digit Backup PIN:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="w-4 h-4 text-[#f59e0b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={4}
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="e.g. 4892"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm font-mono tracking-widest text-white outline-none focus:border-[#f59e0b]"
                  />
                </div>
                <button
                  onClick={() => handleVerify(manualCode)}
                  disabled={isScanning || !manualCode.trim()}
                  className="px-6 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider transition-all"
                >
                  Verify PIN
                </button>
              </div>
            </div>

            {/* Quick Simulation Buttons */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">
                ⚡ Quick Test Simulation:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSimulateScan('BOOKING')}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-gray-200 transition-colors text-left flex items-center justify-between"
                >
                  <span>Scan Table #4 Pass</span>
                  <span className="text-[9px] bg-[#f59e0b]/20 text-[#f59e0b] px-1.5 py-0.5 rounded">BK_101</span>
                </button>
                <button
                  onClick={() => handleSimulateScan('ORDER')}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-gray-200 transition-colors text-left flex items-center justify-between"
                >
                  <span>Scan Food Pickup Pass</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">ORD_9912</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
