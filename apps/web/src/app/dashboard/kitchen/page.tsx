'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Check, AlertCircle, ChefHat, BellRing, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
};

type Order = {
  id: string;
  customerName: string;
  items: OrderItem[];
  status: 'new' | 'preparing' | 'ready';
  timeReceived: Date;
  prepTimeMinutes: number;
};

const initialOrders: Order[] = [
  {
    id: 'HE-8492',
    customerName: 'Rahul S.',
    status: 'new',
    timeReceived: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
    prepTimeMinutes: 15,
    items: [
      { id: '1', name: 'Chicken Biryani (Regular)', quantity: 2, notes: 'Extra raita' },
      { id: '2', name: 'Mutton Chukka', quantity: 1 }
    ]
  },
  {
    id: 'HE-8493',
    customerName: 'Priya K.',
    status: 'preparing',
    timeReceived: new Date(Date.now() - 1000 * 60 * 12), // 12 mins ago
    prepTimeMinutes: 20,
    items: [
      { id: '3', name: 'Paneer Butter Masala', quantity: 1 },
      { id: '4', name: 'Garlic Naan', quantity: 3 }
    ]
  },
  {
    id: 'HE-8494',
    customerName: 'Karthik V.',
    status: 'preparing',
    timeReceived: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago (overdue)
    prepTimeMinutes: 20,
    items: [
      { id: '5', name: 'Special Chicken 65', quantity: 1 },
      { id: '6', name: 'Coke (330ml)', quantity: 2 }
    ]
  }
];

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [now, setNow] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-dismiss alert after 5s
  useEffect(() => {
    if (showAlert) {
      const t = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showAlert]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const getElapsedTime = (received: Date) => {
    return Math.floor((now.getTime() - received.getTime()) / 60000);
  };

  return (
    <div className="animate-fade-in">
      
      {/* KDS Header Stats */}
      <div className="flex gap-4 mb-8">
        <div className="bg-[#1a1a1a] px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="bg-[#f8b11c]/20 p-3 rounded-xl">
            <ChefHat className="w-6 h-6 text-[#f8b11c]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{orders.filter(o => o.status !== 'ready').length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Active Orders</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowAlert(true)}
          className="ml-auto bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
          <BellRing className="w-4 h-4" /> Simulate Ping
        </button>
      </div>

      {/* 🔔 New Order Alert Banner */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="mb-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-4 shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex items-center justify-between border border-emerald-400"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner animate-pulse">
                <BellRing className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-white font-black uppercase tracking-tight text-lg">New Order Arrived!</h3>
                <p className="text-emerald-100 text-sm font-medium">Order #HE-8495 • ₹420.00</p>
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
          {orders.filter(o => o.status !== 'ready').map(order => {
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
                className={`bg-[#1a1a1a] rounded-3xl overflow-hidden border transition-colors ${
                  isOverdue ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 
                  isWarning ? 'border-[#f8b11c]/50' : 'border-white/10'
                }`}
              >
                {/* Order Header */}
                <div className={`p-4 border-b flex justify-between items-start ${
                  isOverdue ? 'bg-red-500/10 border-red-500/20' : 
                  order.status === 'new' ? 'bg-[#f8b11c]/10 border-[#f8b11c]/20' : 'bg-white/5 border-white/10'
                }`}>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">#{order.id}</h3>
                    <p className="text-sm text-gray-400">{order.customerName}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    isOverdue ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    {elapsed} / {order.prepTimeMinutes} min
                  </div>
                </div>

                {/* Items List (Click to open modal) */}
                <div 
                  className="p-4 space-y-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setSelectedOrder(order)}
                >
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-start gap-4">
                      <div className="flex gap-3">
                        <span className="bg-white/10 text-white w-6 h-6 flex items-center justify-center rounded font-bold text-sm shrink-0">
                          {item.quantity}
                        </span>
                        <div>
                          <p className="font-medium text-white text-lg leading-tight">{item.name}</p>
                          {item.notes && (
                            <p className="text-sm text-[#f8b11c] mt-1 bg-[#f8b11c]/10 px-2 py-0.5 rounded-md inline-block">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                  {order.status === 'new' ? (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="w-full py-3 rounded-xl bg-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-colors"
                    >
                      Start Preparing
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full py-3 rounded-xl bg-green-500 text-white font-bold uppercase tracking-widest text-xs hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    >
                      <Check className="w-4 h-4" /> Ready for Courier
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {orders.filter(o => o.status !== 'ready').length === 0 && (
        <div className="text-center py-20">
          <ChefHat className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Kitchen is clear</h3>
          <p className="text-gray-400">Waiting for new orders...</p>
        </div>
      )}

      {/* 🧾 Slide-Out Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full md:w-[450px] bg-[#141414] border-l border-white/10 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white">Order #{selectedOrder.id}</h2>
                  <p className="text-gray-400 text-sm">Customer: <span className="text-white font-bold">{selectedOrder.customerName}</span></p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-8 h-8 rounded bg-[#f8b11c]/20 text-[#f8b11c] font-bold flex items-center justify-center shrink-0">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="font-bold text-white leading-snug text-lg">{item.name}</p>
                        {item.notes && (
                          <div className="mt-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
                            <span className="font-bold uppercase tracking-wider text-[10px] block mb-0.5">Special Instructions:</span>
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 rounded-xl border border-[#f8b11c]/20 bg-[#f8b11c]/5">
                  <h4 className="text-[10px] font-bold text-[#f8b11c] uppercase tracking-widest mb-2">Courier Status</h4>
                  <p className="text-sm text-gray-300">Courier assigned. Arriving in <span className="font-bold text-white">4 mins</span>.</p>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-[#111]">
                {selectedOrder.status === 'new' ? (
                  <button 
                    onClick={() => { updateOrderStatus(selectedOrder.id, 'preparing'); setSelectedOrder(null); }}
                    className="w-full py-4 rounded-xl bg-[#f8b11c] text-black font-bold uppercase tracking-widest text-sm hover:bg-[#e0a019] transition-colors"
                  >
                    Accept & Start Preparing
                  </button>
                ) : selectedOrder.status === 'preparing' ? (
                  <button 
                    onClick={() => { updateOrderStatus(selectedOrder.id, 'ready'); setSelectedOrder(null); }}
                    className="w-full py-4 rounded-xl bg-green-500 text-white font-bold uppercase tracking-widest text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" /> Mark Ready for Courier
                  </button>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
