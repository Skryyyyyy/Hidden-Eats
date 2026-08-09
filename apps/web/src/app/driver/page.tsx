'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Package, CheckCircle, Clock, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type OrderState = 'AVAILABLE' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED';

interface Order {
  id: string;
  restaurant: string;
  restaurantAddress: string;
  customerAddress: string;
  earnings: number;
  distance: string;
  items: number;
  state: OrderState;
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    restaurant: 'Spice Kitchen',
    restaurantAddress: '123 Hidden Alley, SF',
    customerAddress: '456 Market St, SF',
    earnings: 7.50,
    distance: '3.2 miles',
    items: 2,
    state: 'AVAILABLE'
  },
  {
    id: 'ORD-1244',
    restaurant: 'Burger Joint',
    restaurantAddress: '789 Main St, SF',
    customerAddress: '101 Tech Blvd, SF',
    earnings: 12.00,
    distance: '5.1 miles',
    items: 4,
    state: 'AVAILABLE'
  }
];

export default function DriverDashboard() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isOnline, setIsOnline] = useState(false);

  const updateOrderState = (id: string, newState: OrderState) => {
    setOrders(orders.map(o => o.id === id ? { ...o, state: newState } : o));
  };

  const activeOrder = orders.find(o => o.state === 'ACCEPTED' || o.state === 'PICKED_UP');
  const availableOrders = orders.filter(o => o.state === 'AVAILABLE');
  const completedOrders = orders.filter(o => o.state === 'DELIVERED');

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans p-6 md:p-12">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest">Driver Portal</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your deliveries</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase transition-colors flex items-center gap-2 ${
            isOnline ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 text-white border border-white/20'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {!isOnline && (
            <div className="bg-[#1a1a1a] rounded-2xl p-12 text-center border border-white/5 flex flex-col items-center">
              <Truck className="w-16 h-16 text-gray-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">You're currently offline</h2>
              <p className="text-gray-400 max-w-sm">Go online to start receiving delivery requests from restaurants nearby.</p>
            </div>
          )}

          {isOnline && activeOrder && (
            <div className="bg-[#f8b11c] text-black rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Active Delivery</h2>
                <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {activeOrder.state === 'ACCEPTED' ? 'Head to Restaurant' : 'Deliver to Customer'}
                </div>
              </div>
              
              <div className="bg-black/5 rounded-xl p-4 mb-6">
                <h3 className="text-xl font-bold mb-1">{activeOrder.restaurant}</h3>
                <div className="flex items-center gap-2 text-black/70 text-sm mb-4">
                  <MapPin className="w-4 h-4" /> {activeOrder.restaurantAddress}
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-black/10">
                  <div className="flex items-center gap-1 font-bold"><Package className="w-4 h-4" /> {activeOrder.items} items</div>
                  <div className="flex items-center gap-1 font-bold"><Navigation className="w-4 h-4" /> {activeOrder.distance}</div>
                </div>
              </div>

              {activeOrder.state === 'ACCEPTED' ? (
                <button 
                  onClick={() => updateOrderState(activeOrder.id, 'PICKED_UP')}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
                >
                  Confirm Pickup
                </button>
              ) : (
                <button 
                  onClick={() => updateOrderState(activeOrder.id, 'DELIVERED')}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
                >
                  Confirm Dropoff
                </button>
              )}
            </div>
          )}

          {isOnline && !activeOrder && (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#f8b11c]" /> Available Deliveries
              </h3>
              
              {availableOrders.length === 0 ? (
                <div className="bg-[#1a1a1a] rounded-2xl p-8 text-center border border-white/5">
                  <p className="text-gray-400">Waiting for new orders...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableOrders.map(order => (
                    <div key={order.id} className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors flex flex-col sm:flex-row gap-6 justify-between items-center">
                      <div className="w-full sm:w-auto">
                        <div className="flex items-start justify-between sm:justify-start sm:gap-4 mb-2">
                          <h4 className="text-lg font-bold">{order.restaurant}</h4>
                          <span className="text-[#f8b11c] font-black text-lg">${order.earnings.toFixed(2)}</span>
                        </div>
                        <div className="text-gray-400 text-sm space-y-1 mb-3">
                          <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {order.restaurantAddress}</div>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5" /> {order.distance}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {order.items} items</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => updateOrderState(order.id, 'ACCEPTED')}
                        className="w-full sm:w-auto bg-[#f8b11c] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-[#e0a019] transition-colors"
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Today's Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Earnings</p>
                <p className="text-3xl font-black text-[#f8b11c]">
                  ${completedOrders.reduce((sum, order) => sum + order.earnings, 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold">{completedOrders.length} deliveries</p>
              </div>
            </div>
          </div>
          
          {completedOrders.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Recent History</h3>
              <div className="space-y-3">
                {completedOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between text-sm pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{order.restaurant}</span>
                    </div>
                    <span className="font-bold text-[#f8b11c]">${order.earnings.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
