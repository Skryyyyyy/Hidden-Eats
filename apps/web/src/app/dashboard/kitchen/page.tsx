'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Check, AlertCircle, ChefHat } from 'lucide-react';
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
      </div>

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

                {/* Items List */}
                <div className="p-4 space-y-4">
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

    </div>
  );
}
