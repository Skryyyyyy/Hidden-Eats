'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import Link from 'next/link';

type OrderState = 'AVAILABLE' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED';

interface Order {
  id: string;
  restaurant: string;
  restaurantAddress: string;
  customerAddress: string;
  earnings: number;
  tip: number;
  distance: string;
  items: number;
  state: OrderState;
  otp: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    restaurant: 'Buhari Hotel 1951',
    restaurantAddress: '123 Anna Salai, T. Nagar, Chennai',
    customerAddress: '456 Mount Road, Chennai',
    earnings: 120,
    tip: 30,
    distance: '3.2 km',
    items: 2,
    state: 'AVAILABLE',
    otp: '4892',
  },
  {
    id: 'ORD-1244',
    restaurant: 'Ambur Star Biryani',
    restaurantAddress: '789 Nungambakkam High Rd, Chennai',
    customerAddress: '101 Kodambakkam, Chennai',
    earnings: 160,
    tip: 40,
    distance: '5.1 km',
    items: 4,
    state: 'AVAILABLE',
    otp: '7210',
  },
];

export default function DriverDashboard() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isOnline, setIsOnline] = useState(true);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const updateOrderState = (id: string, newState: OrderState) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, state: newState } : o)));
  };

  const activeOrder = orders.find((o) => o.state === 'ACCEPTED' || o.state === 'PICKED_UP');
  const availableOrders = orders.filter((o) => o.state === 'AVAILABLE');
  const completedOrders = orders.filter((o) => o.state === 'DELIVERED');

  const handleVerifyOtpAndDeliver = (order: Order) => {
    if (inputOtp.trim() === order.otp) {
      setOtpError('');
      updateOrderState(order.id, 'DELIVERED');
      setInputOtp('');
    } else {
      setOtpError('Invalid Diner OTP! Please ask customer for correct 4-digit code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans p-4 sm:p-8">
      {/* Header Bar */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/explorer" className="p-2.5 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <span className="text-[10px] font-bold text-[#f8b11c] uppercase tracking-widest block">
              Hidden Eats Driver Logistics
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide">
              Delivery Partner Portal
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Link Pills */}
          <Link
            href="/driver/map"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5 text-[#f8b11c]" /> GPS Map
          </Link>
          <Link
            href="/driver/earnings"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Earnings
          </Link>
          <Link
            href="/driver/settings"
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl"
          >
            <Settings className="w-4 h-4 text-gray-400" />
          </Link>

          {/* Duty Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-colors flex items-center gap-2 ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/10 text-gray-400 border border-white/20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
            {isOnline ? 'On Duty' : 'Off Duty'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {!isOnline && (
            <div className="bg-[#181818] rounded-3xl p-12 text-center border border-white/10 flex flex-col items-center">
              <Truck className="w-16 h-16 text-gray-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">You are currently Off Duty</h2>
              <p className="text-xs text-gray-400 max-w-sm">
                Switch to 'On Duty' to start receiving live delivery pings from nearby partner restaurants.
              </p>
            </div>
          )}

          {isOnline && activeOrder && (
            <div className="bg-gradient-to-r from-[#f8b11c] to-[#e0a019] text-black rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/70 block">
                    Active Mission ({activeOrder.id})
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                    {activeOrder.state === 'ACCEPTED' ? 'Head to Restaurant' : 'Deliver to Diner'}
                  </h2>
                </div>
                <span className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                  ₹{activeOrder.earnings + activeOrder.tip} Payout
                </span>
              </div>

              {/* Order Info Card */}
              <div className="bg-black/10 backdrop-blur-md rounded-2xl p-5 space-y-3 border border-black/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black">{activeOrder.restaurant}</h3>
                    <p className="text-xs font-medium text-black/80 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-4 h-4 shrink-0" /> {activeOrder.restaurantAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-black/10 text-xs font-bold">
                  <span className="flex items-center gap-1"><Package className="w-4 h-4" /> {activeOrder.items} items</span>
                  <span className="flex items-center gap-1"><Navigation className="w-4 h-4" /> {activeOrder.distance}</span>
                  <span className="text-black/70">Tip Included: ₹{activeOrder.tip}</span>
                </div>
              </div>

              {/* Action Buttons / OTP Step */}
              {activeOrder.state === 'ACCEPTED' ? (
                <button
                  onClick={() => updateOrderState(activeOrder.id, 'PICKED_UP')}
                  className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black/90 transition-colors shadow-xl"
                >
                  Confirm Food Pickup at Restaurant
                </button>
              ) : (
                <div className="bg-black text-white p-5 rounded-2xl space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#f8b11c] block">
                    Verify 4-Digit Diner OTP to Complete Dropoff:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={inputOtp}
                      onChange={(e) => setInputOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-lg font-mono text-center tracking-widest text-white outline-none focus:border-[#f8b11c]"
                    />
                    <button
                      onClick={() => handleVerifyOtpAndDeliver(activeOrder)}
                      className="bg-[#f8b11c] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#e0a019] transition-colors"
                    >
                      Verify & Handover
                    </button>
                  </div>
                  {otpError && <p className="text-xs text-red-400 font-medium">{otpError}</p>}
                </div>
              )}
            </div>
          )}

          {isOnline && !activeOrder && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#f8b11c] flex items-center gap-2">
                <Clock className="w-4 h-4" /> Nearby Available Delivery Requests ({availableOrders.length})
              </h3>

              {availableOrders.length === 0 ? (
                <div className="bg-[#181818] rounded-3xl p-8 text-center border border-white/10 text-gray-500 text-xs">
                  Scanning for new delivery requests...
                </div>
              ) : (
                <div className="space-y-4">
                  {availableOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-[#181818] rounded-3xl p-6 border border-white/10 hover:border-[#f8b11c]/50 transition-colors flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-black text-white">{order.restaurant}</h4>
                          <span className="text-[#f8b11c] font-mono font-black text-lg">
                            ₹{order.earnings + order.tip}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#f8b11c]" /> {order.restaurantAddress}
                        </p>
                        <div className="flex items-center gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest pt-1">
                          <span>{order.distance}</span>
                          <span>•</span>
                          <span>{order.items} Items</span>
                          <span>•</span>
                          <span className="text-emerald-400">Includes ₹{order.tip} Tip</span>
                        </div>
                      </div>

                      <button
                        onClick={() => updateOrderState(order.id, 'ACCEPTED')}
                        className="w-full sm:w-auto bg-[#f8b11c] text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#e0a019] transition-colors shrink-0 shadow-lg"
                      >
                        Accept Delivery
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#181818] rounded-3xl p-6 border border-white/10 space-y-4">
            <span className="text-[10px] font-bold text-[#f8b11c] uppercase tracking-widest block">
              Today's Performance
            </span>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-400 block">Total Earnings</span>
                <span className="text-3xl font-mono font-black text-emerald-400">
                  ₹{completedOrders.reduce((sum, o) => sum + o.earnings + o.tip, 480)}
                </span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between text-xs">
                <span className="text-gray-400">Completed Trips:</span>
                <span className="font-bold text-white">{completedOrders.length + 4} Trips</span>
              </div>
            </div>
          </div>

          {/* Quick Nav Button */}
          <Link
            href="/driver/map"
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl p-4 flex items-center justify-between text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <span className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#f8b11c]" /> Open Driver GPS Map
            </span>
            <Check className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>

      </div>
    </div>
  );
}
