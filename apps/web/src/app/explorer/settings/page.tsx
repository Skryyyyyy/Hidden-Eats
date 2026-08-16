'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ExplorerNav from '@/components/ExplorerNav';
import { useTheme } from '@/context/ThemeContext';
import MultiLangSwitcher from '@/components/MultiLangSwitcher';
import GoogleTranslateWidget from '@/components/GoogleTranslateWidget';
import BitmojiAvatarStudio, { BitmojiConfig } from '@/components/BitmojiAvatarStudio';
import { useLanguage } from '@/context/LanguageContext';
import {
  User,
  MapPin,
  Globe,
  Bell,
  Palette,
  Map,
  CreditCard,
  Gift,
  Users,
  Lock,
  MessageSquare,
  FileText,
  Info,
  Check,
  ChevronRight,
  LogOut,
  Trash2,
  Moon,
  Sun,
  ShieldCheck,
  Sparkles,
  Download,
  Share2,
  ExternalLink,
  HelpCircle,
  AlertTriangle,
  Camera,
  Upload,
} from 'lucide-react';

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${
        checked ? 'bg-[#f59e0b]' : 'bg-[#262626]'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-black shadow-md transform transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function ComprehensiveUserSettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<
    | 'account'
    | 'language'
    | 'location'
    | 'notifications'
    | 'appearance'
    | 'maps'
    | 'payments'
    | 'rewards'
    | 'social'
    | 'privacy'
    | 'support'
    | 'legal'
    | 'about'
  >('account');

  // Language & Regional State
  const [preferredCurrency, setPreferredCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');

  // Account State & Profile Avatar
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [username, setUsername] = useState('foodie_explorer');
  const [email, setEmail] = useState('explorer@hiddeneats.com');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [bitmojiConfig, setBitmojiConfig] = useState<BitmojiConfig | undefined>(undefined);
  const [showBitmojiStudio, setShowBitmojiStudio] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Location State
  const [searchRadius, setSearchRadius] = useState<'2km' | '5km' | '10km' | '20km'>('5km');
  const [preferredCity, setPreferredCity] = useState('Bangalore');

  // Notification Toggle States
  const [notifyGems, setNotifyGems] = useState(true);
  const [notifyOffers, setNotifyOffers] = useState(true);
  const [notifyReservations, setNotifyReservations] = useState(true);
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyNewSpots, setNotifyNewSpots] = useState(true);
  const [notifyFriends, setNotifyFriends] = useState(false);
  const [notifyLikes, setNotifyLikes] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(true);

  // Appearance State
  const [accentColor, setAccentColor] = useState<'gold' | 'emerald' | 'blue' | 'purple'>('gold');
  const [fontSize, setFontSize] = useState<'compact' | 'normal' | 'large'>('normal');

  // Maps State
  const [defaultNavApp, setDefaultNavApp] = useState<'google' | 'apple' | 'waze'>('google');
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'bike'>('driving');
  const [avoidTolls, setAvoidTolls] = useState(false);

  // Privacy & Social Toggles
  const [privateAccount, setPrivateAccount] = useState(false);
  const [hideActivity, setHideActivity] = useState(false);
  const [hideSavedSpots, setHideSavedSpots] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const navCategories = [
    { id: 'account', label: t('accountProfile'), icon: User, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'language', label: t('langRegional'), icon: Globe, color: 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20' },
    { id: 'location', label: t('locRadius'), icon: MapPin, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'notifications', label: t('pushNotifications'), icon: Bell, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'appearance', label: t('appearanceTheme'), icon: Palette, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'maps', label: t('mapsNav'), icon: Map, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { id: 'payments', label: t('paymentsHist'), icon: CreditCard, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { id: 'rewards', label: t('rewardsPassport'), icon: Gift, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { id: 'social', label: t('socialFriends'), icon: Users, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 'privacy', label: t('privacySecurity'), icon: Lock, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { id: 'support', label: t('supportFeedback'), icon: MessageSquare, color: 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20' },
    { id: 'legal', label: t('legalNorms'), icon: FileText, color: 'text-slate-300 bg-slate-500/10 border-slate-500/20' },
    { id: 'about', label: t('aboutEats'), icon: Info, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#000000] text-[#e1e1e1]'}`}>
      <ExplorerNav />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b] block mb-1">
            {t('settingsSub')}
          </span>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {t('settingsTitle')}
          </h1>
        </div>

        {savedSuccess && (
          <div className="p-3.5 bg-[#092615] border border-[#0f4424] rounded-xl text-xs text-[#10b981] flex items-center gap-2">
            <Check className="w-4 h-4" /> Preferences updated and saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Category Menu Sidebar */}
          <div className={`border rounded-2xl p-3 space-y-1.5 h-fit ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
            {navCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#f59e0b] text-black font-bold shadow-md shadow-[#f59e0b]/20 scale-102'
                      : isLight
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-[#999999] hover:text-white hover:bg-[#141414]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${isActive ? 'bg-black text-[#f59e0b] border-black' : cat.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{cat.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-0.5 text-black' : 'opacity-40'}`} />
                </button>
              );
            })}
          </div>

          {/* Active Settings Content Panel */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSave} className="space-y-6">
              {/* 1. Account & Profile */}
              {activeTab === 'account' && (
                <div className="space-y-4">
                  <div className={`border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="relative group">
                        {profileAvatar ? (
                          <img
                            src={profileAvatar}
                            alt="Profile Avatar"
                            className="w-20 h-20 rounded-full object-cover border-2 border-[#f59e0b] shadow-xl shadow-[#f59e0b]/20"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#f59e0b] to-[#d97706] text-black font-extrabold text-2xl flex items-center justify-center shadow-xl shadow-[#f59e0b]/20 border-2 border-[#f59e0b]">
                            FE
                          </div>
                        )}
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 p-1.5 rounded-full bg-black border border-white/20 text-white hover:bg-[#f59e0b] hover:text-black transition-colors cursor-pointer shadow-md"
                          title="Upload Custom Photo"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>

                      <div className="text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>@{username}</h2>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 font-bold">
                            🧭 Food Explorer Profile
                          </span>
                        </div>
                        <p className="text-xs text-[#777777] mt-1">{email} • 12 Reviews Posted</p>
                      </div>
                    </div>

                    {/* Avatar Creation Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <label
                        htmlFor="avatar-upload-btn"
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#f59e0b]" /> Upload Photo
                      </label>
                      <input
                        id="avatar-upload-btn"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => setShowBitmojiStudio(true)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] text-black font-bold text-xs shadow-lg shadow-[#f59e0b]/20 flex items-center gap-1.5 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> 3D Bitmoji Studio
                      </button>
                    </div>
                  </div>

                  <div className={`border rounded-2xl p-6 space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                    <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      👤 Edit Profile Credentials
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-[#777777] uppercase mb-1">Display Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none ${isLight ? 'bg-slate-50 border border-slate-200 text-slate-900' : 'bg-[#121212] border border-[#222222] text-white'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#777777] uppercase mb-1">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none ${isLight ? 'bg-slate-50 border border-slate-200 text-slate-900' : 'bg-[#121212] border border-[#222222] text-white'}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-[#777777] uppercase mb-1">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none ${isLight ? 'bg-slate-50 border border-slate-200 text-slate-900' : 'bg-[#121212] border border-[#222222] text-white'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#777777] uppercase mb-1">Mobile Number</label>
                        <input
                          type="text"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none ${isLight ? 'bg-slate-50 border border-slate-200 text-slate-900' : 'bg-[#121212] border border-[#222222] text-white'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Language & Regional Preferences */}
              {activeTab === 'language' && (
                <div className={`border rounded-2xl p-6 space-y-6 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    🌐 {t('langRegional')}
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-xl border-[#222222] bg-[#121212] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-white block">{t('primaryLangLabel')}</span>
                        <span className="text-[11px] text-[#777777]">{t('primaryLangSub')}</span>
                      </div>
                      <MultiLangSwitcher />
                    </div>

                    <div className="p-4 border rounded-xl border-[#222222] bg-[#121212] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-white block">{t('autoGoogleLabel')}</span>
                        <span className="text-[11px] text-[#777777]">{t('autoGoogleSub')}</span>
                      </div>
                      <GoogleTranslateWidget />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#777777] uppercase mb-2">{t('currencyDisplay')}</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'INR', label: 'Indian Rupee (₹ INR)', symbol: '₹' },
                          { id: 'USD', label: 'US Dollar ($ USD)', symbol: '$' },
                          { id: 'EUR', label: 'Euro (€ EUR)', symbol: '€' },
                        ].map((curr) => (
                          <button
                            key={curr.id}
                            type="button"
                            onClick={() => setPreferredCurrency(curr.id as any)}
                            className={`py-3 rounded-xl text-xs font-bold border transition-colors ${
                              preferredCurrency === curr.id
                                ? 'bg-[#f59e0b] text-black border-[#f59e0b]'
                                : 'bg-[#121212] border-[#222222] text-[#888888]'
                            }`}
                          >
                            {curr.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Location */}
              {activeTab === 'location' && (
                <div className={`border rounded-2xl p-6 space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    📍 Location & Proximity Radius
                  </h2>

                  <div>
                    <label className="block text-[11px] font-medium text-[#777777] uppercase mb-1.5">
                      Default Search Radius
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['2km', '5km', '10km', '20km'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSearchRadius(r)}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                            searchRadius === r
                              ? 'bg-[#f59e0b] text-black border-[#f59e0b]'
                              : 'bg-[#121212] border-[#222222] text-[#888888]'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#777777] uppercase mb-1">Preferred City</label>
                    <input
                      type="text"
                      value={preferredCity}
                      onChange={(e) => setPreferredCity(e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none ${isLight ? 'bg-slate-50 border border-slate-200 text-slate-900' : 'bg-[#121212] border border-[#222222] text-white'}`}
                    />
                  </div>
                </div>
              )}

              {/* 3. Notifications */}
              {activeTab === 'notifications' && (
                <div className={`border rounded-2xl p-6 space-y-3 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    🔔 Push & Alert Toggle Switches
                  </h2>

                  {[
                    { label: 'Nearby Hidden Gem Drops', desc: 'Alerts when new secret spots are discovered nearby.', state: notifyGems, setState: setNotifyGems },
                    { label: 'Restaurant Partner Offers', desc: 'Discounts and secret dish invitations.', state: notifyOffers, setState: setNotifyOffers },
                    { label: 'Reservation Reminders', desc: 'Push reminders 1 hour before booked slots.', state: notifyReservations, setState: setNotifyReservations },
                    { label: 'Order Status Updates', desc: 'Real-time kitchen prep notifications.', state: notifyOrders, setState: setNotifyOrders },
                    { label: 'New Restaurant Openings', desc: 'Be the first to know about new secret kitchens.', state: notifyNewSpots, setState: setNotifyNewSpots },
                    { label: 'Friend Activity & Reviews', desc: 'When friends in your network review a dish.', state: notifyFriends, setState: setNotifyFriends },
                    { label: 'Review Likes & Votes', desc: 'When diners upvote your review.', state: notifyLikes, setState: setNotifyLikes },
                    { label: 'Weekly Food Newsletter', desc: 'Curated weekend dining recommendations.', state: notifyWeekly, setState: setNotifyWeekly },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 border rounded-xl border-[#1e1e1e] hover:border-[#333333] transition-colors">
                      <div className="pr-4">
                        <span className="text-xs font-semibold text-white block">{item.label}</span>
                        <span className="text-[11px] text-[#777777]">{item.desc}</span>
                      </div>
                      <ToggleSwitch checked={item.state} onChange={item.setState} />
                    </div>
                  ))}
                </div>
              )}

              {/* 4. Appearance & Theme Controls */}
              {activeTab === 'appearance' && (
                <div className={`border rounded-2xl p-6 space-y-6 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    🎨 Visual Theme & Appearance Controls
                  </h2>

                  <div className="flex items-center justify-between p-4 border rounded-xl border-[#222222]">
                    <div>
                      <span className="text-xs font-semibold text-white block">Theme Mode Selection</span>
                      <span className="text-[11px] text-[#777777]">Switch between Notion pitch-black and crisp light mode.</span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="px-4 py-2 bg-[#f59e0b] text-black font-bold text-xs rounded-xl shadow-md"
                    >
                      {isLight ? 'Switch to Dark Mode 🌙' : 'Switch to Light Mode ☀️'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#777777] uppercase mb-2">Accent Highlight Color</label>
                    <div className="flex gap-3">
                      {[
                        { id: 'gold', label: 'Gold Amber', color: 'bg-[#f59e0b]' },
                        { id: 'emerald', label: 'Emerald Green', color: 'bg-[#10b981]' },
                        { id: 'blue', label: 'Cyber Blue', color: 'bg-[#3b82f6]' },
                        { id: 'purple', label: 'Royal Purple', color: 'bg-[#a855f7]' },
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setAccentColor(c.id as any)}
                          className={`flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            accentColor === c.id ? 'border-white text-white font-bold ring-2 ring-[#f59e0b]/50' : 'border-[#222222] text-[#888888]'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${c.color}`} />
                          <span>{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#777777] uppercase mb-2">Typography & Font Density</label>
                    <div className="flex gap-2">
                      {(['compact', 'normal', 'large'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFontSize(s)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase border transition-colors ${
                            fontSize === s ? 'bg-[#f59e0b] text-black border-[#f59e0b]' : 'bg-[#121212] border-[#222222] text-[#888888]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Maps & Navigation */}
              {activeTab === 'maps' && (
                <div className={`border rounded-2xl p-6 space-y-6 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    🗺️ Turn-by-Turn Map Navigation Preferences
                  </h2>

                  <div>
                    <label className="block text-[11px] font-medium text-[#777777] uppercase mb-2">Default External Navigation App</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['google', 'apple', 'waze'] as const).map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setDefaultNavApp(app)}
                          className={`py-2.5 rounded-xl text-xs font-bold uppercase border transition-colors ${
                            defaultNavApp === app ? 'bg-[#f59e0b] text-black border-[#f59e0b]' : 'bg-[#121212] border-[#222222] text-[#888888]'
                          }`}
                        >
                          {app} Maps
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 border rounded-xl border-[#1e1e1e]">
                    <div>
                      <span className="text-xs font-semibold text-white block">Avoid Toll Roads</span>
                      <span className="text-[11px] text-[#777777]">Automatically calculate non-toll driving routes.</span>
                    </div>
                    <ToggleSwitch checked={avoidTolls} onChange={setAvoidTolls} />
                  </div>
                </div>
              )}

              {/* 6. Payments & History */}
              {activeTab === 'payments' && (
                <div className={`border rounded-2xl p-6 space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    💳 Saved Payment Methods & Wallet Balance
                  </h2>

                  <div className="p-4 border rounded-xl border-[#222222] bg-[#121212] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#f59e0b] block">Hidden Eats Credits Wallet</span>
                      <span className="text-xl font-bold text-white mt-0.5 block">₹450.00</span>
                      <span className="text-[10px] text-[#777777]">Usable for secret dish pre-orders</span>
                    </div>
                    <button type="button" className="px-3.5 py-1.5 bg-[#f59e0b] text-black font-bold text-xs rounded-xl shadow-md">
                      + Top Up Wallet
                    </button>
                  </div>

                  <div className="p-4 border rounded-xl border-[#222222] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Primary UPI Account</span>
                      <span className="text-[11px] text-[#777777]">rahul@upi • Instant checkout</span>
                    </div>
                    <button type="button" className="text-xs text-[#f59e0b] font-bold hover:underline">Edit UPI</button>
                  </div>
                </div>
              )}

              {/* 7. Rewards & Passport */}
              {activeTab === 'rewards' && (
                <div className={`border rounded-2xl p-6 space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    🎁 Explorer Rewards & Food Passport
                  </h2>

                  <div className="p-5 border rounded-2xl bg-gradient-to-r from-[#241a08] via-[#0d0a04] to-[#0a0a0a] border-[#382607] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Food Passport Progress</span>
                      <span className="text-xs font-extrabold text-[#f59e0b]">12 / 20 Gems Unlocked</span>
                    </div>
                    <div className="w-full bg-[#161616] h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: '60%' }} />
                    </div>
                    <p className="text-[11px] text-[#888888]">Discover 8 more secret spots to unlock the Gold Explorer Badge!</p>
                  </div>
                </div>
              )}

              {/* 8. Friends & Social */}
              {activeTab === 'social' && (
                <div className={`border rounded-2xl p-6 space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    👥 Social & Dining Network
                  </h2>

                  <div className="flex items-center justify-between p-3.5 border rounded-xl border-[#1e1e1e]">
                    <div>
                      <span className="text-xs font-semibold text-white block">Private Explorer Account</span>
                      <span className="text-[11px] text-[#777777]">Only approved friends can view your saved food lists.</span>
                    </div>
                    <ToggleSwitch checked={privateAccount} onChange={setPrivateAccount} />
                  </div>

                  <div className="flex items-center justify-between p-3.5 border rounded-xl border-[#1e1e1e]">
                    <div>
                      <span className="text-xs font-semibold text-white block">Hide Activity Feed</span>
                      <span className="text-[11px] text-[#777777]">Do not display my check-ins on friends' feeds.</span>
                    </div>
                    <ToggleSwitch checked={hideActivity} onChange={setHideActivity} />
                  </div>
                </div>
              )}

              {/* 9. Privacy & Security */}
              {activeTab === 'privacy' && (
                <div className={`border rounded-2xl p-6 space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    🔒 Privacy, Security & Data Rights
                  </h2>

                  <div className="flex items-center justify-between p-3.5 border rounded-xl border-[#1e1e1e]">
                    <div>
                      <span className="text-xs font-semibold text-white block">Two-Factor Authentication (2FA)</span>
                      <span className="text-[11px] text-[#777777]">Require SMS / Authenticator verification at login.</span>
                    </div>
                    <ToggleSwitch checked={enable2FA} onChange={setEnable2FA} />
                  </div>

                  <div className="pt-3 border-t border-[#1e1e1e] flex items-center justify-between">
                    <button type="button" className="px-4 py-2 bg-[#141414] hover:bg-[#1e1e1e] text-white font-semibold text-xs rounded-xl border border-[#2a2a2a] flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-[#f59e0b]" /> Download My Data (DPDP Act)
                    </button>
                    <button type="button" className="px-4 py-2 bg-[#240a0a] hover:bg-[#380e0e] text-red-400 font-semibold text-xs rounded-xl border border-[#441010] flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" /> Delete My Data
                    </button>
                  </div>
                </div>
              )}

              {/* 10. Support & Feedback */}
              {activeTab === 'support' && (
                <div className={`border rounded-2xl p-6 space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    💬 24/7 Support & Quality Reports
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button type="button" className="p-4 border rounded-xl border-[#222222] bg-[#121212] text-left hover:border-[#f59e0b] transition-colors">
                      <HelpCircle className="w-5 h-5 text-[#f59e0b] mb-1" />
                      <span className="text-xs font-bold text-white block">Help Center & FAQs</span>
                      <span className="text-[10px] text-[#777777]">Guides on table bookings & secret passes.</span>
                    </button>
                    <button type="button" className="p-4 border rounded-xl border-[#222222] bg-[#121212] text-left hover:border-[#f59e0b] transition-colors">
                      <AlertTriangle className="w-5 h-5 text-red-400 mb-1" />
                      <span className="text-xs font-bold text-white block">Report a Venue Problem</span>
                      <span className="text-[10px] text-[#777777]">Report wrong location or quality issues.</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 11. Legal (Govt Norms) */}
              {activeTab === 'legal' && (
                <div className={`border rounded-2xl p-6 space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    📜 Legal & Government Compliance Norms
                  </h2>

                  <div className="space-y-2">
                    <Link href="/legal/terms" className="block p-4 border rounded-xl border-[#222222] hover:border-[#f59e0b] transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Terms & Conditions (FSSAI & IT Act Compliant)</span>
                        <ChevronRight className="w-4 h-4 text-[#f59e0b]" />
                      </div>
                      <span className="text-[10px] text-[#777777]">Official regulatory compliance details and diner rights.</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* 12. About Hidden Eats */}
              {activeTab === 'about' && (
                <div className={`border rounded-2xl p-6 space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0a0a0a] border-[#1c1c1c]'}`}>
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    ℹ️ About Hidden Eats Platform
                  </h2>

                  <div className="flex items-center justify-between p-4 border rounded-xl border-[#222222] bg-[#121212]">
                    <div>
                      <span className="text-xs font-bold text-white block">Hidden Eats Web & Mobile</span>
                      <span className="text-[10px] text-[#777777]">Version 2.4.0 (Build 2026.08.05) • Up to Date</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#10b981] bg-[#092615] px-2 py-0.5 rounded border border-[#0f4424]">
                      STABLE
                    </span>
                  </div>
                </div>
              )}

              {/* Save Settings Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#f59e0b]/20 transition-all"
              >
                {t('saveSettings')}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Bitmoji SVG 3D Avatar Creator Studio Modal */}
      {showBitmojiStudio && (
        <BitmojiAvatarStudio
          initialConfig={bitmojiConfig}
          onClose={() => setShowBitmojiStudio(false)}
          onSave={(avatarSvg, config) => {
            setProfileAvatar(avatarSvg);
            setBitmojiConfig(config);
            setShowBitmojiStudio(false);
          }}
        />
      )}
    </div>
  );
}
