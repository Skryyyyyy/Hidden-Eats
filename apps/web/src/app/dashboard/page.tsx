'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  TrendingUp,
  Store,
  ChefHat,
  ShieldCheck,
  ChevronRight,
  Flame,
  Search,
} from 'lucide-react';

interface OrderItem {
  id: string;
  customerName: string;
  phone: string;
  items: string[];
  total: number;
  time: string;
  status: 'new' | 'preparing' | 'ready' | 'completed';
  otp?: string;
  prepTimeMinutes: number;
}

export default function FoodStyleDashboard() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [kitchenStatus, setKitchenStatus] = useState<'online' | 'busy' | 'offline'>('online');
  const [searchFilter, setSearchFilter] = useState('');

  // Sample Live Kitchen Orders State
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 'ORD-8812',
      customerName: 'Rahul Sharma',
      phone: '+91 98765 43210',
      items: ['2x Smoked Mutton Biryani', '1x Black Garlic Chicken'],
      total: 820,
      time: '2 mins ago',
      status: 'new',
      prepTimeMinutes: 20,
    },
    {
      id: 'ORD-8811',
      customerName: 'Priya Patel',
      phone: '+91 91234 56789',
      items: ['1x Truffle Butter Ghee Roast Dosa', '2x Filter Coffee'],
      total: 340,
      time: '12 mins ago',
      status: 'preparing',
      prepTimeMinutes: 15,
    },
    {
      id: 'ORD-8810',
      customerName: 'Vikram Singh',
      phone: '+91 99887 76655',
      items: ['3x Chef Secret Charcoal Dum Biryani'],
      total: 1170,
      time: '25 mins ago',
      status: 'ready',
      otp: '4892',
      prepTimeMinutes: 25,
    },
    {
      id: 'ORD-8809',
      customerName: 'Ananya Roy',
      phone: '+91 94433 22110',
      items: ['1x Special Chettinad Chicken Curry', '4x Malabar Parotta'],
      total: 560,
      time: '45 mins ago',
      status: 'completed',
      prepTimeMinutes: 18,
    },
  ]);

  const updateOrderStatus = (id: string, newStatus: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updatedOtp = newStatus === 'ready' ? Math.floor(1000 + Math.random() * 9000).toString() : o.otp;
          return { ...o, status: newStatus, otp: updatedOtp };
        }
        return o;
      })
    );
  };

  const filteredOrders = orders.filter((o) =>
    o.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    o.id.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-[1440px] mx-auto">
      
      {/* Top Controls Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141414] border border-white/10 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-[10px] font-bold text-[#f8b11c] uppercase tracking-widest block mb-1">
            Partner Kitchen Controls
          </span>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Live Dispatch & Kitchen Board
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Kitchen Status Toggle */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setKitchenStatus('online')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                kitchenStatus === 'online' ? 'bg-emerald-500 text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              ● Online
            </button>
            <button
              onClick={() => setKitchenStatus('busy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                kitchenStatus === 'busy' ? 'bg-[#f8b11c] text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              ● High Prep Delay
            </button>
            <button
              onClick={() => setKitchenStatus('offline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                kitchenStatus === 'offline' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              ● Closed
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order ID..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 outline-none focus:border-[#f8b11c] transition-colors"
            />
          </div>

          <Link
            href="/dashboard/menu"
            className="bg-[#f8b11c] text-black px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#e0a019] transition-colors flex items-center gap-1.5 shadow-md"
          >
            <ChefHat className="w-4 h-4" /> Menu Vault
          </Link>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <FoodMetricCard title="ACTIVE KITCHEN ORDERS" value={orders.filter((o) => o.status !== 'completed').length} subtext="IN PIPELINE" isLight={isLight} icon={<ShoppingBag className="w-5 h-5 text-[#f8b11c]" />} />
        <FoodMetricCard title="TODAY'S REVENUE" value="₹52,400" subtext="148 ORDERS PROCESSED" isLight={isLight} icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} />
        <FoodMetricCard title="AVG PREP TIME" value="16 Mins" subtext="-3 MINS FASTER THAN AVG" isLight={isLight} icon={<Clock className="w-5 h-5 text-blue-400" />} />
        <FoodMetricCard title="PARTNER RATING" value="4.9 / 5.0" subtext="98% POSITIVE REVIEWS" isLight={isLight} icon={<ShieldCheck className="w-5 h-5 text-purple-400" />} />
      </div>

      {/* Real-time Orders Kanban Board */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#f8b11c]" />
            <h2 className="font-display text-xl md:text-2xl tracking-wide uppercase font-bold text-white">
              Live Order Dispatch Board
            </h2>
          </div>
          <span className="text-xs text-[#f8b11c] font-mono font-bold">Auto-Sync Active ●</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Column 1: New Orders */}
          <div className="p-4 rounded-2xl border bg-[#141414] border-white/10">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#f8b11c] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 animate-bounce" /> New Pings ({filteredOrders.filter((o) => o.status === 'new').length})
              </span>
            </div>
            <div className="space-y-4">
              {filteredOrders
                .filter((o) => o.status === 'new')
                .map((order) => (
                  <div key={order.id} className="p-4 bg-black/40 border border-[#f8b11c]/30 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#f8b11c] block">{order.id}</span>
                        <h4 className="font-bold text-sm text-white">{order.customerName}</h4>
                      </div>
                      <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">{order.time}</span>
                    </div>
                    <ul className="text-xs text-gray-300 space-y-1 pl-3 list-disc">
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="font-mono font-bold text-xs text-white">₹{order.total}</span>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="bg-[#f8b11c] text-black font-bold text-xs px-3 py-1.5 rounded-lg uppercase tracking-wider hover:bg-[#e0a019] transition-colors"
                      >
                        Accept Order
                      </button>
                    </div>
                  </div>
                ))}
              {filteredOrders.filter((o) => o.status === 'new').length === 0 && (
                <p className="text-xs text-gray-500 text-center py-8">No new order pings</p>
              )}
            </div>
          </div>

          {/* Column 2: In Preparation */}
          <div className="p-4 rounded-2xl border bg-[#141414] border-white/10">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Cooking ({filteredOrders.filter((o) => o.status === 'preparing').length})
              </span>
            </div>
            <div className="space-y-4">
              {filteredOrders
                .filter((o) => o.status === 'preparing')
                .map((order) => (
                  <div key={order.id} className="p-4 bg-black/40 border border-blue-500/30 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-bold text-blue-400 block">{order.id}</span>
                        <h4 className="font-bold text-sm text-white">{order.customerName}</h4>
                      </div>
                      <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
                        Prep: {order.prepTimeMinutes}m
                      </span>
                    </div>
                    <ul className="text-xs text-gray-300 space-y-1 pl-3 list-disc">
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="font-mono font-bold text-xs text-white">₹{order.total}</span>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="bg-blue-500 text-black font-bold text-xs px-3 py-1.5 rounded-lg uppercase tracking-wider hover:bg-blue-400 transition-colors"
                      >
                        Mark Ready
                      </button>
                    </div>
                  </div>
                ))}
              {filteredOrders.filter((o) => o.status === 'preparing').length === 0 && (
                <p className="text-xs text-gray-500 text-center py-8">No orders currently cooking</p>
              )}
            </div>
          </div>

          {/* Column 3: Ready for Pickup (With OTP) */}
          <div className="p-4 rounded-2xl border bg-[#141414] border-white/10">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pickup Ready ({filteredOrders.filter((o) => o.status === 'ready').length})
              </span>
            </div>
            <div className="space-y-4">
              {filteredOrders
                .filter((o) => o.status === 'ready')
                .map((order) => (
                  <div key={order.id} className="p-4 bg-black/40 border border-emerald-500/30 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-bold text-emerald-400 block">{order.id}</span>
                        <h4 className="font-bold text-sm text-white">{order.customerName}</h4>
                      </div>
                      {order.otp && (
                        <span className="text-xs font-mono font-bold text-[#f8b11c] bg-[#f8b11c]/10 border border-[#f8b11c]/30 px-2 py-0.5 rounded">
                          OTP: {order.otp}
                        </span>
                      )}
                    </div>
                    <ul className="text-xs text-gray-300 space-y-1 pl-3 list-disc">
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="font-mono font-bold text-xs text-white">₹{order.total}</span>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="bg-emerald-500 text-black font-bold text-xs px-3 py-1.5 rounded-lg uppercase tracking-wider hover:bg-emerald-400 transition-colors"
                      >
                        Dispatch
                      </button>
                    </div>
                  </div>
                ))}
              {filteredOrders.filter((o) => o.status === 'ready').length === 0 && (
                <p className="text-xs text-gray-500 text-center py-8">No orders awaiting pickup</p>
              )}
            </div>
          </div>

          {/* Column 4: Completed */}
          <div className="p-4 rounded-2xl border bg-[#141414] border-white/10">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Dispatched ({filteredOrders.filter((o) => o.status === 'completed').length})
              </span>
            </div>
            <div className="space-y-4">
              {filteredOrders
                .filter((o) => o.status === 'completed')
                .map((order) => (
                  <div key={order.id} className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-2 opacity-80">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs text-gray-400">{order.id}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Delivered ✓</span>
                    </div>
                    <h4 className="font-bold text-xs text-white">{order.customerName}</h4>
                    <span className="font-mono text-xs text-[#f8b11c] font-bold block">₹{order.total}</span>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

function FoodMetricCard({ title, value, subtext, isLight, icon }: any) {
  return (
    <div
      className={`rounded-2xl p-6 flex flex-col justify-between border transition-colors ${
        isLight ? 'bg-white border-black/10 hover:border-black/30' : 'bg-[#141414] border-white/10 hover:border-white/30'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-xs uppercase tracking-widest mb-1 text-gray-400">
            {title}
          </h3>
          <div className="font-display text-3xl font-extrabold uppercase tracking-wide text-white">
            {value}
          </div>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">{icon}</div>
      </div>
      <div className="font-sans font-bold uppercase tracking-widest text-[10px] border-t border-white/10 pt-3 text-gray-400">
        {subtext}
      </div>
    </div>
  );
}
