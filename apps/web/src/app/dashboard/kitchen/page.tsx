'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Check, AlertCircle, ChefHat, BellRing, X, Printer, Send, Sparkles, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import QRScannerModal from '@/components/QRScannerModal';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  price?: number;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  status: 'new' | 'preparing' | 'ready' | 'dispatched';
  timeReceived: Date;
  prepTimeMinutes: number;
  totalAmount?: number;
  tableNumber?: string;
};

const initialOrders: Order[] = [
  {
    id: 'HE-8492',
    customerName: 'Rahul S.',
    customerPhone: '+91 98401 23456',
    status: 'new',
    timeReceived: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
    prepTimeMinutes: 15,
    totalAmount: 480,
    tableNumber: 'T-04',
    items: [
      { id: '1', name: 'Chicken Biryani (Dum Special)', quantity: 2, notes: 'Extra raita & spicy gravy', price: 220 },
      { id: '2', name: 'Mutton Chukka', quantity: 1, price: 260 }
    ]
  },
  {
    id: 'HE-8493',
    customerName: 'Priya K.',
    customerPhone: '+91 98840 98765',
    status: 'preparing',
    timeReceived: new Date(Date.now() - 1000 * 60 * 12), // 12 mins ago
    prepTimeMinutes: 20,
    totalAmount: 340,
    tableNumber: 'Takeaway #12',
    items: [
      { id: '3', name: 'Paneer Butter Masala', quantity: 1, price: 180 },
      { id: '4', name: 'Butter Garlic Naan', quantity: 3, price: 160 }
    ]
  },
  {
    id: 'HE-8494',
    customerName: 'Karthik V.',
    customerPhone: '+91 97910 11223',
    status: 'preparing',
    timeReceived: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago (overdue)
    prepTimeMinutes: 20,
    totalAmount: 290,
    tableNumber: 'T-09',
    items: [
      { id: '5', name: 'Special Chicken 65', quantity: 1, price: 210 },
      { id: '6', name: 'Thums Up (330ml)', quantity: 2, price: 80 }
    ]
  }
];

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [now, setNow] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [kotOrder, setKotOrder] = useState<Order | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('New Order Arrived!');
  const [showQRScanner, setShowQRScanner] = useState(false);

  const supabase = createClient();

  // Synthetic Audio Bell via Web Audio API (Zero external asset dependency)
  const playKitchenBell = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1760, ctx.currentTime); // A6

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio playback prevented or unsupported');
    }
  };

  // Realtime Supabase Channel Subscription
  useEffect(() => {
    const channel = supabase
      .channel('kitchen-orders-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const newOrder = payload.new as any;
        const formatted: Order = {
          id: newOrder.id ? `HE-${String(newOrder.id).slice(-4)}` : `HE-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: newOrder.customer_name || 'Walk-in Diner',
          status: 'new',
          timeReceived: new Date(),
          prepTimeMinutes: 15,
          totalAmount: newOrder.total_amount || 350,
          tableNumber: newOrder.table_number || 'T-Live',
          items: newOrder.items || [{ id: '1', name: 'Chef Special Signature Thali', quantity: 1 }],
        };

        setOrders(prev => [formatted, ...prev]);
        setAlertText(`New Live Order #${formatted.id} • ₹${formatted.totalAmount}`);
        setShowAlert(true);
        playKitchenBell();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Timer Tick
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerMockNewOrder = () => {
    const newId = `HE-${Math.floor(8500 + Math.random() * 500)}`;
    const dishes = [
      { id: '1', name: 'Chettinad Pepper Chicken', quantity: 1, price: 240, notes: 'Medium spice' },
      { id: '2', name: 'Malabar Parotta', quantity: 4, price: 120 },
    ];
    const newOrder: Order = {
      id: newId,
      customerName: 'Ananya M.',
      customerPhone: '+91 98411 55667',
      status: 'new',
      timeReceived: new Date(),
      prepTimeMinutes: 15,
      totalAmount: 360,
      tableNumber: 'T-07',
      items: dishes,
    };

    setOrders(prev => [newOrder, ...prev]);
    setAlertText(`New Live Order #${newId} • ₹360`);
    setShowAlert(true);
    playKitchenBell();
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const getElapsedTime = (received: Date) => {
    return Math.floor((now.getTime() - received.getTime()) / 60000);
  };

  return (
    <div className="animate-fade-in text-white">
      {/* KDS Header Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#1a1a1a] px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="bg-[#f8b11c]/20 p-3 rounded-xl">
              <ChefHat className="w-6 h-6 text-[#f8b11c]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {orders.filter(o => o.status !== 'ready' && o.status !== 'dispatched').length}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Active in Kitchen</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] px-6 py-4 rounded-2xl border border-white/10 hidden sm:flex items-center gap-4">
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {orders.filter(o => o.status === 'ready').length}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ready for Pickup</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQRScanner(true)}
            className="bg-[#10b981] hover:bg-[#059669] text-black px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" /> Scan Diner QR Pass
          </button>
          <button
            onClick={triggerMockNewOrder}
            className="bg-[#f8b11c] text-black px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#e0a019] shadow-lg shadow-[#f8b11c]/20 transition-all cursor-pointer"
          >
            <BellRing className="w-4 h-4" /> Simulate Incoming Order
          </button>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScannerModal
          onClose={() => setShowQRScanner(false)}
          onVerified={(pass) => {
            setAlertText(`Verified Secret Pass for ${pass.dinerName} • ${pass.tableAssigned || pass.details}`);
            setShowAlert(true);
            playKitchenBell();
          }}
        />
      )}

      {/* 🔔 New Order Alert Banner */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="mb-8 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-3xl p-5 shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex items-center justify-between border border-emerald-400"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner animate-pulse">
                <BellRing className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-white font-black uppercase tracking-tight text-lg">Live Order Ingested!</h3>
                <p className="text-emerald-100 text-xs font-semibold">{alertText}</p>
              </div>
            </div>
            <button onClick={() => setShowAlert(false)} className="text-emerald-100 hover:text-white p-2 rounded-full hover:bg-emerald-700/50 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {orders.filter(o => o.status !== 'dispatched').map(order => {
            const elapsed = getElapsedTime(order.timeReceived);
            const isOverdue = elapsed > order.prepTimeMinutes;
            const isWarning = elapsed > order.prepTimeMinutes * 0.75 && !isOverdue;

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-[#18181b] rounded-3xl overflow-hidden border transition-all shadow-xl flex flex-col justify-between ${
                  isOverdue ? 'border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.2)]' : 
                  isWarning ? 'border-[#f8b11c]/60' : 'border-white/10'
                }`}
              >
                {/* Order Header */}
                <div className={`p-5 border-b flex justify-between items-start ${
                  isOverdue ? 'bg-red-500/15 border-red-500/30' : 
                  order.status === 'new' ? 'bg-[#f8b11c]/15 border-[#f8b11c]/30' : 
                  order.status === 'ready' ? 'bg-emerald-500/15 border-emerald-500/30' : 'bg-white/5 border-white/10'
                }`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                        {order.tableNumber || 'Takeaway'}
                      </span>
                      {order.status === 'new' && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400 text-black">
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white">#{order.id}</h3>
                    <p className="text-xs text-gray-400 font-medium">{order.customerName}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      {elapsed} / {order.prepTimeMinutes}m
                    </div>

                    <button
                      onClick={() => setKotOrder(order)}
                      title="Print KOT Ticket"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div 
                  className="p-5 space-y-4 cursor-pointer hover:bg-white/[0.03] transition-colors flex-1"
                  onClick={() => setSelectedOrder(order)}
                >
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4">
                      <div className="flex gap-3">
                        <span className="bg-white/10 text-[#f8b11c] w-7 h-7 flex items-center justify-center rounded-xl font-black text-sm shrink-0">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-bold text-white text-base leading-tight">{item.name}</p>
                          {item.notes && (
                            <p className="text-xs text-[#f8b11c] mt-1 bg-[#f8b11c]/10 px-2 py-0.5 rounded-md inline-block font-medium">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Action Buttons */}
                <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                  {order.status === 'new' ? (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="w-full py-3.5 rounded-2xl bg-[#f8b11c] hover:bg-[#e0a019] text-black font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#f8b11c]/20"
                    >
                      Accept & Cook (15m)
                    </button>
                  ) : order.status === 'preparing' ? (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      <Check className="w-4 h-4" /> Ready for Courier
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'dispatched')}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      <Send className="w-4 h-4" /> Dispatch with Driver
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {orders.filter(o => o.status !== 'dispatched').length === 0 && (
        <div className="text-center py-24 bg-[#18181b] rounded-3xl border border-white/10">
          <ChefHat className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Kitchen is all clear!</h3>
          <p className="text-gray-400 text-sm">All dishes prepared and handed over to courier drivers.</p>
        </div>
      )}

      {/* 🧾 Digital KOT (Kitchen Order Ticket) Modal */}
      {kotOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-white text-black p-6 rounded-3xl font-mono text-xs shadow-2xl relative">
            <div className="text-center border-b border-black/20 pb-4 mb-4">
              <h2 className="font-black text-lg uppercase tracking-wider">GRAND SECRET KITCHEN</h2>
              <p className="text-[10px] text-gray-600 uppercase">KITCHEN ORDER TICKET (KOT)</p>
              <div className="flex justify-between items-center mt-2 text-[10px] text-gray-500">
                <span>Ticket: #{kotOrder.id}</span>
                <span>{kotOrder.tableNumber}</span>
              </div>
              <div className="text-[10px] text-gray-500 text-left mt-0.5">
                Time: {kotOrder.timeReceived.toLocaleTimeString()}
              </div>
            </div>

            <div className="space-y-3 border-b border-black/20 pb-4 mb-4">
              {kotOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <span className="font-bold">{item.quantity}x {item.name}</span>
                  <span>₹{(item.price || 150) * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-sm mb-6">
              <span>TOTAL ESTIMATE</span>
              <span>₹{kotOrder.totalAmount}</span>
            </div>

            <div className="flex gap-2 font-sans">
              <button
                onClick={() => { window.print(); setKotOrder(null); }}
                className="flex-1 py-3 rounded-full bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-gray-800"
              >
                Print Ticket
              </button>
              <button
                onClick={() => setKotOrder(null)}
                className="py-3 px-4 rounded-full border border-black/20 text-black font-bold text-xs uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
