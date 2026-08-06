'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiddenEatsLogo } from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import {
  Compass,
  MapPin,
  Radio,
  Bookmark,
  Settings,
  Sun,
  Moon,
  Flame,
  Bell,
  ShoppingBag,
  ChevronDown,
  User,
  LogOut,
  Search,
  Check,
  Zap,
} from 'lucide-react';

export default function ExplorerNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  // Location State & Modal
  const [currentLocation, setCurrentLocation] = useState('Brigade Road, Bangalore');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationSearchInput, setLocationSearchInput] = useState('');

  // Dropdown Panels State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Mobile Bottom Discover Sub-menu State
  const [discoverSubmenuOpen, setDiscoverSubmenuOpen] = useState(false);

  const POPULAR_LOCATIONS = [
    'Brigade Road, Bangalore',
    'Indiranagar 100ft Road, Bangalore',
    'Koramangala 5th Block, Bangalore',
    'HSR Layout Sector 1, Bangalore',
    'Whitefield Main Road, Bangalore',
    'MG Road Metro Station, Bangalore',
  ];

  const explorerNavItems = [
    { href: '/explorer', label: 'Explore Spots', icon: Compass },
    { href: '/explorer/map', label: 'In-App Map', icon: MapPin },
    { href: '/explorer/radar', label: 'Live Radar', icon: Radio },
    { href: '/explorer/reels', label: 'Foodie Reels', icon: Flame },
    { href: '/explorer/collections', label: 'Collections', icon: Bookmark },
    { href: '/explorer/settings', label: 'Settings & Profile', icon: Settings },
  ];

  return (
    <>
      {/* 🔴 Glassmorphic Apple/Stripe-level Sticky Top Navigation Bar */}
      <nav className={`h-20 border-b px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-50 transition-colors ${
        isLight
          ? 'glass-header bg-[#FFF8F1]/90 border-black/5 text-[#1F2937]'
          : 'bg-[#05070D]/95 border-[#131A2C] text-white'
      }`}>
        {/* Left Section: Logo + Location Selector Pill */}
        <div className="flex items-center gap-3">
          <HiddenEatsLogo href="/explorer" />

          {/* Location Selector Pill */}
          <button
            onClick={() => {
              setLocationModalOpen(true);
              setNotificationsOpen(false);
              setOrdersOpen(false);
              setProfileDropdownOpen(false);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-label text-xs shadow-sm transition-all hover-lift ${
              isLight
                ? 'bg-white border-black/8 text-[#1F2937] hover:border-[#D62828] hover:text-[#D62828]'
                : 'bg-[#131A2C] border-[#23314a] text-white hover:border-[#FFB703] hover:text-[#FFB703]'
            }`}
          >
            <MapPin className={`w-3.5 h-3.5 ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`} />
            <span className="max-w-[130px] sm:max-w-[180px] truncate">{currentLocation.split(',')[0]}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* Desktop Nav Tabs Centered */}
        <div className={`hidden lg:flex items-center p-1.5 rounded-2xl border shadow-sm ${
          isLight ? 'bg-white border-black/8' : 'bg-[#131A2C] border-[#23314a]'
        }`}>
          {explorerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-label text-xs transition-all duration-200 ${
                  isActive
                    ? isLight
                      ? 'text-white bg-[#D62828] shadow-md shadow-[#D62828]/25'
                      : 'text-black font-bold bg-[#FFB703] shadow-md shadow-[#FFB703]/25'
                    : isLight
                    ? 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF3E8]'
                    : 'text-[#888888] hover:text-white hover:bg-[#05070D]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  isActive ? (isLight ? 'text-white' : 'text-black') : (isLight ? 'text-[#D62828]' : 'text-[#FFB703]')
                }`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Action Icons: Notification Bell, Active Orders, Theme Toggle & Profile Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Notification Bell Icon */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setOrdersOpen(false);
                setProfileDropdownOpen(false);
              }}
              className={`p-2.5 rounded-2xl border relative transition-all shadow-sm hover-lift ${
                isLight
                  ? 'bg-white border-black/8 text-[#1F2937] hover:border-[#D62828]'
                  : 'bg-[#131A2C] border-[#23314a] text-white hover:border-[#FFB703]'
              }`}
              title="Notifications"
            >
              <Bell className={`w-4 h-4 ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`} />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-ping ${isLight ? 'bg-[#D62828]' : 'bg-[#FFB703]'}`} />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${isLight ? 'bg-[#D62828]' : 'bg-[#FFB703]'}`} />
            </button>

            {/* Notification Dropdown Panel */}
            {notificationsOpen && (
              <div className={`absolute right-0 mt-3 w-80 rounded-2xl border p-4 z-50 shadow-2xl space-y-3 animate-scale-in ${
                isLight ? 'bg-white border-black/8 text-[#1F2937]' : 'bg-[#131A2C] border-[#23314a] text-white'
              }`}>
                <div className={`flex items-center justify-between border-b pb-2.5 ${isLight ? 'border-black/5' : 'border-[#23314a]'}`}>
                  <span className={`text-label text-xs ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`}>NOTIFICATIONS</span>
                  <span className="text-body text-[10px] opacity-70">2 Unread</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className={`p-3 rounded-xl border space-y-1 ${
                    isLight ? 'bg-[#FFF3E8] border-black/5' : 'bg-[#05070D] border-[#23314a]'
                  }`}>
                    <p className="text-card-title text-xs">🔥 Flash Secret Drop Live!</p>
                    <p className="text-body text-[11px] opacity-80">Grand Secret Kitchen released 6 plates of Smoked Biryani.</p>
                  </div>
                  <div className={`p-3 rounded-xl border space-y-1 ${
                    isLight ? 'bg-[#FFF3E8] border-black/5' : 'bg-[#05070D] border-[#23314a]'
                  }`}>
                    <p className="text-card-title text-xs">⭐ Review Liked</p>
                    <p className="text-body text-[11px] opacity-80">Café De Quietude liked your review on Truffle Pizza.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Orders Icon */}
          <div className="relative">
            <button
              onClick={() => {
                setOrdersOpen(!ordersOpen);
                setNotificationsOpen(false);
                setProfileDropdownOpen(false);
              }}
              className={`p-2.5 rounded-2xl border relative transition-all flex items-center gap-1.5 shadow-sm hover-lift ${
                isLight
                  ? 'bg-white border-black/8 text-[#1F2937] hover:border-[#16A34A]'
                  : 'bg-[#131A2C] border-[#23314a] text-white hover:border-[#10b981]'
              }`}
              title="Active Orders & Bookings"
            >
              <ShoppingBag className="w-4 h-4 text-[#16A34A] dark:text-[#10b981]" />
              <span className={`text-label text-[10px] border px-1.5 py-0.2 rounded-full ${
                isLight
                  ? 'bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]'
                  : 'bg-[#092615] text-[#10b981] border-[#0f4424]'
              }`}>
                1
              </span>
            </button>

            {/* Active Orders Dropdown Panel */}
            {ordersOpen && (
              <div className={`absolute right-0 mt-3 w-80 rounded-2xl border p-4 z-50 shadow-2xl space-y-3 animate-scale-in ${
                isLight ? 'bg-white border-black/8 text-[#1F2937]' : 'bg-[#131A2C] border-[#23314a] text-white'
              }`}>
                <div className={`flex items-center justify-between border-b pb-2.5 ${isLight ? 'border-black/5' : 'border-[#23314a]'}`}>
                  <span className="text-label text-xs text-[#16A34A] dark:text-[#10b981]">ACTIVE ORDERS & BOOKINGS</span>
                  <span className="text-label text-[10px] text-[#16A34A] dark:text-[#10b981]">1 In Progress</span>
                </div>
                <div className={`p-3 rounded-xl border space-y-1.5 ${
                  isLight ? 'bg-[#DCFCE7] border-[#86EFAC]' : 'bg-[#092615] border-[#0f4424]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-card-title text-xs">Smoked Mutton Biryani</span>
                    <span className="text-label text-[10px] text-[#16A34A] dark:text-[#10b981]">Kitchen Preparing</span>
                  </div>
                  <p className="text-body text-[11px] opacity-80">Grand Secret Kitchen • ETA 18 mins</p>
                </div>
              </div>
            )}
          </div>

          {/* Sun / Moon Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-2xl border transition-all shadow-sm hover-lift ${
              isLight
                ? 'bg-white border-black/8 text-[#1F2937] hover:bg-[#FFF8F1]'
                : 'bg-[#131A2C] border-[#23314a] text-white hover:bg-[#05070D]'
            }`}
            title="Toggle Light / Dark Theme"
          >
            {isLight ? <Moon className="w-4 h-4 text-[#D62828]" /> : <Sun className="w-4 h-4 text-[#FFB703]" />}
          </button>

          {/* Profile Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
                setOrdersOpen(false);
              }}
              className={`w-10 h-10 rounded-full overflow-hidden border shadow-md hover:scale-105 transition-all bg-white shrink-0 ${
                isLight ? 'border-[#D62828]/50 shadow-[#D62828]/15' : 'border-[#FFB703]/50 shadow-[#FFB703]/15'
              }`}
              title="Account Profile"
            >
              <img src="/logo.png" alt="Diner Profile Avatar" className="w-full h-full object-cover" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className={`absolute right-0 mt-3 w-56 rounded-2xl border p-2 z-50 shadow-2xl space-y-1 animate-scale-in ${
                isLight ? 'bg-white border-black/8 text-[#1F2937]' : 'bg-[#131A2C] border-[#23314a] text-white'
              }`}>
                <div className={`px-3 py-2 border-b ${isLight ? 'border-black/5' : 'border-[#23314a]'}`}>
                  <p className="text-card-title text-xs">Balamurugan</p>
                  <p className="text-body text-[10px] opacity-70">Gold Diner Explorer</p>
                </div>
                <Link
                  href="/explorer/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-label text-xs rounded-xl transition-colors ${
                    isLight ? 'hover:bg-[#FFF3E8] text-[#1F2937]' : 'hover:bg-[#05070D] text-white'
                  }`}
                >
                  <User className={`w-3.5 h-3.5 ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`} /> Diner Profile
                </Link>
                <Link
                  href="/explorer/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-label text-xs rounded-xl transition-colors ${
                    isLight ? 'hover:bg-[#FFF3E8] text-[#1F2937]' : 'hover:bg-[#05070D] text-white'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-[#2563EB]" /> Account Settings
                </Link>
                <Link
                  href="/login"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-label text-xs rounded-xl hover:bg-red-500/10 text-red-600 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" /> Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 📍 Location Search Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-scale-in">
          <div className={`w-full max-w-md border rounded-3xl p-6 space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-black/8 text-[#1F2937]' : 'bg-[#131A2C] border-[#23314a] text-white'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3.5 ${isLight ? 'border-black/5' : 'border-[#23314a]'}`}>
              <h3 className="text-card-title text-base flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`} /> Select Dining Location
              </h3>
              <button onClick={() => setLocationModalOpen(false)} className="text-body opacity-70 text-sm hover:opacity-100">
                ✕
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={locationSearchInput}
                onChange={(e) => setLocationSearchInput(e.target.value)}
                placeholder="Search city, area, or pin code..."
                className={`w-full border rounded-2xl pl-10 pr-3 py-3 text-body text-xs outline-none transition-all ${
                  isLight
                    ? 'bg-[#FFF8F1] border-black/8 text-[#1F2937] focus:border-[#D62828]'
                    : 'bg-[#05070D] border-[#23314a] text-white focus:border-[#FFB703]'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <span className={`text-label text-[10px] uppercase ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`}>POPULAR BANGALORE LOCATIONS</span>
              {POPULAR_LOCATIONS.filter((loc) =>
                !locationSearchInput || loc.toLowerCase().includes(locationSearchInput.toLowerCase())
              ).map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setCurrentLocation(loc);
                    setLocationModalOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-label text-xs flex items-center justify-between transition-colors ${
                    currentLocation === loc
                      ? isLight ? 'bg-[#D62828] text-white' : 'bg-[#FFB703] text-black font-bold'
                      : isLight ? 'hover:bg-[#FFF3E8] text-[#6B7280]' : 'hover:bg-[#05070D] text-[#aaaaaa]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{loc}</span>
                  </div>
                  {currentLocation === loc && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 📱 Mobile Bottom Navigation Bar (< 768px) */}
      <div className={`md:hidden fixed bottom-0 inset-x-0 z-50 h-16 border-t px-2 flex items-center justify-around backdrop-blur-xl transition-colors ${
        isLight
          ? 'bg-[#FFF8F1]/95 border-black/8 text-[#1F2937]'
          : 'bg-[#05070D]/95 border-[#131A2C] text-white'
      }`}>
        <Link
          href="/explorer"
          className={`flex flex-col items-center gap-0.5 text-label text-[10px] ${
            pathname === '/explorer' ? (isLight ? 'text-[#D62828]' : 'text-[#FFB703]') : 'opacity-60'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </Link>

        <Link
          href="/explorer/map"
          className={`flex flex-col items-center gap-0.5 text-label text-[10px] ${
            pathname === '/explorer/map' ? (isLight ? 'text-[#D62828]' : 'text-[#FFB703]') : 'opacity-60'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>Map</span>
        </Link>

        {/* Discover Sub-menu Trigger */}
        <div className="relative">
          <button
            onClick={() => setDiscoverSubmenuOpen(!discoverSubmenuOpen)}
            className={`flex flex-col items-center gap-0.5 text-label text-[10px] ${
              pathname === '/explorer/radar' || pathname === '/explorer/reels' ? (isLight ? 'text-[#D62828]' : 'text-[#FFB703]') : 'opacity-60'
            }`}
          >
            <Zap className={`w-5 h-5 animate-pulse ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`} />
            <span>Discover</span>
          </button>

          {discoverSubmenuOpen && (
            <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 w-40 rounded-2xl border p-2 space-y-1 shadow-2xl animate-scale-in ${
              isLight ? 'bg-white border-black/8 text-[#1F2937]' : 'bg-[#131A2C] border-[#23314a] text-white'
            }`}>
              <Link
                href="/explorer/radar"
                onClick={() => setDiscoverSubmenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-label text-xs rounded-xl ${
                  isLight ? 'hover:bg-[#FFF3E8]' : 'hover:bg-[#05070D]'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#10b981]" /> Live Radar
              </Link>
              <Link
                href="/explorer/reels"
                onClick={() => setDiscoverSubmenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-label text-xs rounded-xl ${
                  isLight ? 'hover:bg-[#FFF3E8]' : 'hover:bg-[#05070D]'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`} /> Foodie Reels
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/explorer/collections"
          className={`flex flex-col items-center gap-0.5 text-label text-[10px] ${
            pathname === '/explorer/collections' ? (isLight ? 'text-[#D62828]' : 'text-[#FFB703]') : 'opacity-60'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span>Collections</span>
        </Link>

        <Link
          href="/explorer/settings"
          className={`flex flex-col items-center gap-0.5 text-label text-[10px] ${
            pathname === '/explorer/settings' ? (isLight ? 'text-[#D62828]' : 'text-[#FFB703]') : 'opacity-60'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Account</span>
        </Link>
      </div>
    </>
  );
}
