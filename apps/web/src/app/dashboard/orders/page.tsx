'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { Clock, Search, ChevronRight } from 'lucide-react';

type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

interface Order {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: OrderStatus;
  time: string;
  driver: string | null;
}

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-8921', customer: 'Rahul Sharma', items: ['2x Hidden Smoked Biryani', '1x Thums Up'], total: 720, status: 'NEW', time: 'Just now', driver: null },
  { id: 'ORD-8920', customer: 'Priya Patel', items: ['1x Secret Tandoori Wings'], total: 220, status: 'PREPARING', time: '12 mins ago', driver: null },
  { id: 'ORD-8919', customer: 'Arun Kumar', items: ['3x Mystery Dosas', '3x Filter Coffee'], total: 540, status: 'READY', time: '24 mins ago', driver: 'Waiting for Driver' },
  { id: 'ORD-8918', customer: 'Deepa V', items: ['1x VIP Meals'], total: 450, status: 'OUT_FOR_DELIVERY', time: '45 mins ago', driver: 'Mani (En route)' },
  { id: 'ORD-8917', customer: 'Karthik', items: ['2x Special Kothu Parotta'], total: 360, status: 'DELIVERED', time: '1 hr ago', driver: 'Suresh (Delivered)' },
];

const getStatusColor = (status: OrderStatus, isLight: boolean) => {
  switch (status) {
    case 'NEW': return isLight ? 'bg-red-100 text-red-700 border-red-200' : 'bg-[#E93B3B]/20 text-[#E93B3B] border-[#E93B3B]/30';
    case 'PREPARING': return isLight ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-[#f8b11c]/20 text-[#f8b11c] border-[#f8b11c]/30';
    case 'READY': return isLight ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'OUT_FOR_DELIVERY': return isLight ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'DELIVERED': return isLight ? 'bg-green-100 text-green-700 border-green-200' : 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return isLight ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-white/10 text-white/70 border-white/20';
  }
};

export default function OrdersDashboardPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(o => o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`min-h-screen flex font-sans antialiased text-body transition-colors ${
      isLight ? 'bg-[#FAFAFA] text-[#111111]' : 'bg-[#0A0A0A] text-white'
    }`}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-20 px-8 flex items-center justify-between sticky top-0 z-20 transition-all border-b glass-header ${
          isLight ? 'border-black/5 bg-[#FAFAFA]/70' : 'border-white/5 bg-[#0A0A0A]/70'
        }`}>
          <h1 className="font-display text-2xl uppercase tracking-wider">Orders Management</h1>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center border rounded-lg px-3 py-1.5 transition-colors ${
              isLight ? 'border-black/10 bg-white focus-within:border-black/30' : 'border-white/10 bg-[#111111] focus-within:border-[#f8b11c]/50'
            }`}>
              <Search className={`w-4 h-4 mr-2 ${isLight ? 'text-black/40' : 'text-white/40'}`} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-48 font-mono uppercase"
              />
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-xl font-bold font-display uppercase tracking-wider mb-2">Live Orders</h2>
            <p className={`text-sm ${isLight ? 'text-black/60' : 'text-white/60'}`}>Manage and track incoming delivery orders from the community.</p>
          </div>

          <div className={`rounded-xl border overflow-hidden ${
            isLight ? 'bg-white border-black/10' : 'bg-[#111] border-white/10'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-xs font-bold uppercase tracking-widest ${
                    isLight ? 'border-black/10 bg-black/5 text-black/60' : 'border-white/10 bg-white/5 text-white/60'
                  }`}>
                    <th className="p-4 font-mono">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Driver</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className={`border-b last:border-b-0 transition-colors ${
                      isLight ? 'border-black/5 hover:bg-black/5' : 'border-white/5 hover:bg-white/5'
                    }`}>
                      <td className="p-4 font-mono font-bold">{order.id}</td>
                      <td className="p-4">{order.customer}</td>
                      <td className="p-4">
                        <div className="max-w-[200px] truncate">
                          {order.items.join(', ')}
                        </div>
                        <span className={`text-xs ${isLight ? 'text-black/50' : 'text-white/50'}`}>{order.items.length} items</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-[#E93B3B]">₹{order.total}</td>
                      <td className="p-4 flex items-center gap-2">
                        <Clock className="w-3 h-3 opacity-50" />
                        {order.time}
                      </td>
                      <td className="p-4 text-xs uppercase tracking-wider">{order.driver || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 border rounded text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status, isLight)}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className={`p-2 rounded hover:bg-black/10 transition-colors ${isLight ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white'}`}>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className={`p-12 text-center text-sm font-mono uppercase tracking-widest ${isLight ? 'text-black/40' : 'text-white/40'}`}>
                  No orders found.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
