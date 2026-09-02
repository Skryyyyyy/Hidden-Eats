'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Package,
  CheckCircle,
  Clock,
  Truck,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Settings,
  DollarSign,
  PhoneCall,
  Check,
  QrCode,
  Zap,
  Volume2,
  VolumeX,
  Compass,
  Battery,
  AlertTriangle,
  ChevronRight,
  Eye,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { generateLocalBharatQRDataUrl } from '@/lib/payment';
import QRScannerModal from '@/components/QRScannerModal';

type OrderState = 'AVAILABLE' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED';

interface DriverMission {
  id: string;
  restaurant: string;
  restaurantAddress: string;
  secretAlleyInstructions: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  earnings: number;
  surgeBonus: number;
  tip: number;
  distance: string;
  items: string;
  orderTotal: number;
  paymentMode: 'PAID_ONLINE' | 'PAY_ON_DELIVERY';
  state: OrderState;
  otp: string;
}

const INITIAL_MISSIONS: DriverMission[] = [
  {
    id: 'DEL-8921',
    restaurant: 'Grand Secret Kitchen',
    restaurantAddress: '12-A Secret Alley, Off Brigade Road',
    secretAlleyInstructions: 'Enter through blue iron gate next to old bookstore, take stairs to 1st floor kitchen.',
    customerName: 'Rahul Sharma',
    customerAddress: 'Flat 402, Green Glen Layout, Bellandur',
    customerPhone: '+91 98765 43210',
    earnings: 65,
    surgeBonus: 25,
    tip: 30,
    distance: '3.4 km',
    items: '2x Mutton Dum Biryani, 1x Brain Fry',
    orderTotal: 480,
    paymentMode: 'PAY_ON_DELIVERY',
    state: 'AVAILABLE',
    otp: '4892',
  },
  {
    id: 'DEL-1244',
    restaurant: 'Alleyway Street Bakes',
    restaurantAddress: '44 Corner Lane, Indiranagar',
    secretAlleyInstructions: 'Walk into alley behind chai shop, kitchen counter is on the left.',
    customerName: 'Priya Sundaram',
    customerAddress: '789 12th Main, HAL 2nd Stage',
    customerPhone: '+91 94321 87654',
    earnings: 75,
    surgeBonus: 20,
    tip: 40,
    distance: '2.1 km',
    items: '3x Stuffed Malabar Buns, 2x Cold Badam Milk',
    orderTotal: 340,
    paymentMode: 'PAID_ONLINE',
    state: 'AVAILABLE',
    otp: '7210',
  },
];

export default function DriverDashboard() {
  const [missions, setMissions] = useState<DriverMission[]>(INITIAL_MISSIONS);
  const [isOnline, setIsOnline] = useState(true);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [oledStealthMode, setOledStealthMode] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [showCollectUPI, setShowCollectUPI] = useState(false);
  const [upiDataUrl, setUpiDataUrl] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const activeMission = missions.find((m) => m.state === 'ACCEPTED' || m.state === 'PICKED_UP');
  const availableMissions = missions.filter((m) => m.state === 'AVAILABLE');
  const completedMissions = missions.filter((m) => m.state === 'DELIVERED');

  const updateMissionState = (id: string, newState: OrderState) => {
    setMissions(missions.map((m) => (m.id === id ? { ...m, state: newState } : m)));
  };

  // Voice Guidance announcement
  const speakGuidance = (text: string) => {
    if (voiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio fallback
    }
  };

  const handleAcceptMission = (id: string) => {
    updateMissionState(id, 'ACCEPTED');
    speakGuidance('Mission Accepted. Proceed to Secret Kitchen entrance.');
  };

  const handleConfirmPickup = (id: string) => {
    updateMissionState(id, 'PICKED_UP');
    speakGuidance('Order collected. Head to customer drop-off location.');
  };

  const handleVerifyOtpAndDeliver = (mission: DriverMission) => {
    if (inputOtp.trim() === mission.otp) {
      setOtpError('');
      updateMissionState(mission.id, 'DELIVERED');
      setInputOtp('');
      speakGuidance('Delivery verified and completed! Wallet credited.');
    } else {
      setOtpError('Invalid Diner OTP! Please ask customer for the correct 4-digit code.');
    }
  };

  const handleOpenCollectUPI = (mission: DriverMission) => {
    generateLocalBharatQRDataUrl({
      payeeVPA: 'hiddeneats@upi',
      payeeName: 'Hidden Eats Delivery',
      amount: mission.orderTotal,
      transactionRef: `DEL_PAY_${mission.id}`,
      note: `Pay on Delivery #${mission.id}`,
    }).then((url) => {
      setUpiDataUrl(url);
      setShowCollectUPI(true);
    });
  };

  return (
    <div
      className={`min-h-screen font-sans p-4 sm:p-8 transition-colors duration-300 ${
        oledStealthMode ? 'bg-[#000000] text-white' : 'bg-[#0b0f17] text-slate-100'
      }`}
    >
      {/* Top Header Bar */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/explorer" className="p-2.5 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-[#f59e0b] uppercase tracking-widest block">
                Hidden Eats Driver Logistics
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                GPS Radar Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Courier Mission Control
            </h1>
          </div>
        </div>

        {/* Quick Driver Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* OLED Battery Saver Mode */}
          <button
            onClick={() => setOledStealthMode(!oledStealthMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              oledStealthMode
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
            }`}
          >
            <Battery className="w-3.5 h-3.5" />
            <span>{oledStealthMode ? 'OLED Stealth On' : 'OLED Saver'}</span>
          </button>

          {/* Voice Guidance Toggle */}
          <button
            onClick={() => setVoiceMuted(!voiceMuted)}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle Voice HUD"
          >
            {voiceMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Duty Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-5 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              isOnline
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 font-black'
                : 'bg-white/10 text-gray-400 border border-white/20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-black animate-pulse' : 'bg-gray-400'}`} />
            {isOnline ? 'On Duty' : 'Off Duty'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Missions & Radar */}
        <div className="lg:col-span-8 space-y-6">
          {!isOnline && (
            <div className="bg-[#121824] rounded-3xl p-12 text-center border border-white/10 flex flex-col items-center">
              <Truck className="w-16 h-16 text-gray-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">You are currently Off Duty</h2>
              <p className="text-xs text-gray-400 max-w-sm">
                Toggle to 'On Duty' to receive real-time delivery missions from nearby secret kitchens.
              </p>
            </div>
          )}

          {/* ACTIVE MISSION CARD */}
          {isOnline && activeMission && (
            <div className="bg-gradient-to-br from-[#161f30] to-[#0f172a] border-2 border-[#f59e0b] rounded-[32px] p-6 sm:p-8 shadow-[0_0_40px_rgba(245,158,11,0.25)] space-y-6 text-white">
              
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#f59e0b] block">
                    Active Mission ({activeMission.id})
                  </span>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                    {activeMission.state === 'ACCEPTED' ? 'Step 1: Head to Secret Kitchen' : 'Step 2: Deliver to Customer'}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[#f59e0b] text-black px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-[#f59e0b]/30">
                    ₹{activeMission.earnings + activeMission.surgeBonus + activeMission.tip} Total Payout
                  </span>
                </div>
              </div>

              {/* Secret Alley Navigation Box */}
              <div className="p-4 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-black text-[#f59e0b] uppercase">
                  <Compass className="w-4 h-4" /> Secret Backdoor & Alley Instructions
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
                  {activeMission.secretAlleyInstructions}
                </p>
              </div>

              {/* Locations Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Pickup Kitchen</span>
                  <h4 className="font-bold text-white text-sm">{activeMission.restaurant}</h4>
                  <p className="text-gray-400 text-[11px]">{activeMission.restaurantAddress}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Dropoff Customer</span>
                  <h4 className="font-bold text-white text-sm">{activeMission.customerName}</h4>
                  <p className="text-gray-400 text-[11px]">{activeMission.customerAddress}</p>
                  <p className="text-[#f59e0b] text-[11px] font-mono">{activeMission.customerPhone}</p>
                </div>
              </div>

              {/* Order Package Contents */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#f59e0b]" />
                  <span className="font-bold text-gray-200">{activeMission.items}</span>
                </div>
                <span className="text-gray-400 font-mono">Total: ₹{activeMission.orderTotal}</span>
              </div>

              {/* Action Buttons: Pickup or Handover OTP */}
              {activeMission.state === 'ACCEPTED' ? (
                <div className="space-y-3">
                  <button
                    onClick={() => handleConfirmPickup(activeMission.id)}
                    className="w-full py-4 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#f59e0b]/25 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Food Pickup from Kitchen</span>
                  </button>
                  <button
                    onClick={() => setShowQRScanner(true)}
                    className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-[#f59e0b]" />
                    <span>Scan Order Bag QR Code</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Collect UPI at Door Tool */}
                  {activeMission.paymentMode === 'PAY_ON_DELIVERY' && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-black block">
                          Pay on Delivery Pending
                        </span>
                        <span className="text-lg font-black text-white">Collect ₹{activeMission.orderTotal}</span>
                      </div>
                      <button
                        onClick={() => handleOpenCollectUPI(activeMission)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" /> Show UPI QR to Diner
                      </button>
                    </div>
                  )}

                  {/* Diner OTP Verification */}
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                    <label className="text-xs font-black uppercase tracking-wider text-[#f59e0b] block flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Verify 4-Digit Diner OTP for Handover:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={inputOtp}
                        onChange={(e) => setInputOtp(e.target.value)}
                        placeholder="e.g. 4892"
                        className="flex-1 bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-lg font-mono text-center tracking-widest text-white outline-none focus:border-[#f59e0b]"
                      />
                      <button
                        onClick={() => handleVerifyOtpAndDeliver(activeMission)}
                        className="bg-[#f59e0b] hover:bg-[#d97706] text-black px-6 py-3 rounded-2xl font-black uppercase tracking-wider text-xs transition-all shadow-lg shadow-[#f59e0b]/20 cursor-pointer"
                      >
                        Verify & Complete
                      </button>
                    </div>
                    {otpError && <p className="text-xs text-red-400 font-medium">{otpError}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AVAILABLE MISSIONS RADAR */}
          {isOnline && !activeMission && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#f59e0b] flex items-center gap-2">
                <Clock className="w-4 h-4" /> Nearby Available Missions ({availableMissions.length})
              </h3>

              {availableMissions.length === 0 ? (
                <div className="bg-[#121824] rounded-3xl p-12 text-center border border-white/10 text-gray-400 text-xs">
                  Scanning for new delivery missions in your neighborhood...
                </div>
              ) : (
                <div className="space-y-4">
                  {availableMissions.map((m) => (
                    <div
                      key={m.id}
                      className="bg-[#121824] rounded-3xl p-6 border border-white/10 hover:border-[#f59e0b]/40 transition-all space-y-4 shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                            {m.distance} away • {m.items}
                          </span>
                          <h4 className="text-xl font-black text-white">{m.restaurant}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{m.restaurantAddress}</p>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-[#f59e0b]">
                            ₹{m.earnings + m.surgeBonus + m.tip}
                          </span>
                          <span className="text-[10px] text-gray-400 block font-bold">
                            Base ₹{m.earnings} + Surge ₹{m.surgeBonus} + Tip ₹{m.tip}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAcceptMission(m.id)}
                        className="w-full py-3.5 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#f59e0b]/25 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>⚡ Accept Mission (₹{m.earnings + m.surgeBonus + m.tip})</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Earnings Wallet & Settlement */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#121824] border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Driver Daily Wallet</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Today's Earnings</span>
              <h3 className="text-3xl font-black text-white">₹460.00</h3>
              <p className="text-xs text-emerald-400 font-bold mt-1">4 Completed Missions • 100% On-Time</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Base Trip Pay:</span>
                <span className="font-bold text-white">₹310.00</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Rain / Peak Surge:</span>
                <span className="font-bold text-[#f59e0b]">₹90.00</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Diner Tips:</span>
                <span className="font-bold text-emerald-400">₹60.00</span>
              </div>
            </div>

            <button
              onClick={() => alert('₹460.00 transferred directly to your registered UPI VPA (driver@upi)!')}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              1-Tap Instant UPI Withdrawal
            </button>
          </div>
        </div>
      </div>

      {/* Collect UPI at Doorstep Modal */}
      {showCollectUPI && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#0a0d14] border-2 border-emerald-500/50 rounded-[36px] p-6 text-center text-white space-y-5 shadow-2xl">
            <h3 className="text-base font-black uppercase tracking-tight">Collect Payment from Diner</h3>
            <p className="text-xs text-gray-400">Ask diner to scan with Google Pay, PhonePe, or Paytm</p>

            <div className="p-3 bg-white rounded-2xl inline-block shadow-2xl border-4 border-emerald-500">
              <img src={upiDataUrl} alt="UPI Collect QR" className="w-48 h-48 object-contain" />
            </div>

            <h4 className="text-2xl font-black text-emerald-400">₹{activeMission?.orderTotal}</h4>

            <button
              onClick={() => setShowCollectUPI(false)}
              className="w-full py-3 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-wider text-xs"
            >
              Payment Collected
            </button>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScannerModal
          onClose={() => setShowQRScanner(false)}
          onVerified={() => {
            if (activeMission) handleConfirmPickup(activeMission.id);
          }}
        />
      )}
    </div>
  );
}
