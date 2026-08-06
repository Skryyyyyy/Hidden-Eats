'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import ExplorerNav from '@/components/ExplorerNav';
import {
  Compass,
  Search,
  Flame,
  Star,
  MapPin,
  Calendar,
  Navigation,
  Check,
  Mic,
  Clock,
  Users,
  Copy,
  ShoppingBag,
  UtensilsCrossed,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const CRAVING_CHIPS = [
  'All',
  'Biryani',
  'Pizza',
  'Burger',
  'Dosa',
  'Street Food',
  'Budget Meals',
  'Date Night',
  'Midnight Cravings',
  'Hidden Gems',
];

interface FoodDish {
  dishName: string;
  price: number;
  description: string;
  isSecret: boolean;
  prepTime: string;
  category: string;
}

interface RestaurantSpot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  gemScore: number;
  tags: string[];
  priceLevel: number;
  image: string;
  hasSecretMenu: boolean;
  dishes: FoodDish[];
}

const MOCK_EXPLORER_SPOTS: RestaurantSpot[] = [
  {
    id: 'res-1',
    name: 'Grand Secret Kitchen',
    address: '12-A Secret Alley, Off Brigade Road',
    lat: 12.9716,
    lng: 77.5946,
    rating: 4.8,
    gemScore: 9.4,
    tags: ['Biryani', 'Hidden Gems', 'Midnight Cravings', 'Mutton', 'Pizza'],
    priceLevel: 2,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop',
    hasSecretMenu: true,
    dishes: [
      {
        dishName: "Chef's Secret Smoked Mutton Biryani",
        price: 340,
        description: 'Slow-cooked wood-smoked mutton biryani with secret spices.',
        isSecret: true,
        prepTime: '20 mins',
        category: 'Biryani',
      },
      {
        dishName: 'Midnight Chili Garlic Wings',
        price: 220,
        description: 'Crispy fried wings tossed in secret chili garlic sauce.',
        isSecret: true,
        prepTime: '15 mins',
        category: 'Wings',
      },
      {
        dishName: 'Woodfired Secret Peperoni Pizza',
        price: 380,
        description: 'Crispy sourdough woodfired pizza with secret smoked cheese.',
        isSecret: true,
        prepTime: '18 mins',
        category: 'Pizza',
      },
    ],
  },
  {
    id: 'res-2',
    name: 'Alleyway Street Bakes',
    address: '44 Corner Lane, Indiranagar',
    lat: 12.978,
    lng: 77.605,
    rating: 4.6,
    gemScore: 8.9,
    tags: ['Street Food', 'Budget Meals', 'Burger', 'Dosa', 'Pizza'],
    priceLevel: 1,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop',
    hasSecretMenu: true,
    dishes: [
      {
        dishName: 'Secret Cheese Smash Burger',
        price: 180,
        description: 'Double smashed patty with melted secret cheese sauce.',
        isSecret: true,
        prepTime: '12 mins',
        category: 'Burger',
      },
      {
        dishName: 'Crispy Mysore Masala Dosa',
        price: 110,
        description: 'Golden crispy butter dosa served with red spicy chutney.',
        isSecret: false,
        prepTime: '10 mins',
        category: 'Dosa',
      },
      {
        dishName: 'Mini Cheese Burst Pocket Pizza',
        price: 160,
        description: 'Stuffed street-style mini pizza bursting with molten cheese.',
        isSecret: true,
        prepTime: '10 mins',
        category: 'Pizza',
      },
    ],
  },
  {
    id: 'res-3',
    name: 'Café De Quietude',
    address: '88 Peace Haven, Koramangala',
    lat: 12.965,
    lng: 77.588,
    rating: 4.9,
    gemScore: 9.1,
    tags: ['Date Night', 'Cafe to Work', 'Coffee', 'Pizza'],
    priceLevel: 2,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop',
    hasSecretMenu: false,
    dishes: [
      {
        dishName: 'Truffle Mushroom Artisan Pizza',
        price: 390,
        description: 'Hand-tossed sourdough pizza topped with truffle oil.',
        isSecret: false,
        prepTime: '18 mins',
        category: 'Pizza',
      },
      {
        dishName: 'Hazelnut Cold Brew Espresso',
        price: 190,
        description: '18-hour cold steeped coffee with hazelnut cream.',
        isSecret: true,
        prepTime: '5 mins',
        category: 'Coffee',
      },
    ],
  },
];

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function ExplorerWorkspacePage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Pre-Order Modal State
  const [preOrderDish, setPreOrderDish] = useState<{ spotName: string; dish: FoodDish } | null>(null);
  const [preOrderSuccess, setPreOrderSuccess] = useState(false);

  // Squad Voting Modal
  const [squadModal, setSquadModal] = useState(false);
  const [squadCopied, setSquadCopied] = useState(false);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('Detecting Live Location...');
  const [bookingModalSpot, setBookingModalSpot] = useState<RestaurantSpot | null>(null);
  const [partySize, setPartySize] = useState('2');
  const [bookingTime, setBookingTime] = useState('Tonight at 8:30 PM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationName(`Live GPS (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`);
        },
        () => {
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
          setLocationName('Brigade Road, Bangalore');
        }
      );
    }
  }, []);

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setSearchQuery('Pizza');
        setIsListening(false);
      }, 1500);
    }
  };

  const handleConfirmPreOrder = () => {
    setPreOrderSuccess(true);
    setTimeout(() => {
      setPreOrderSuccess(false);
      setPreOrderDish(null);
    }, 2000);
  };

  const handleBookTable = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalSpot(null);
    }, 2000);
  };

  const spotsWithDistance = MOCK_EXPLORER_SPOTS.map((spot) => {
    const distanceKm = userLocation
      ? getDistanceKm(userLocation.lat, userLocation.lng, spot.lat, spot.lng)
      : 1.2;
    return { ...spot, distanceKm };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const query = searchQuery.toLowerCase().trim();

  const filteredSpots = spotsWithDistance.filter((spot) => {
    const matchesTag =
      selectedTag === 'All' ||
      spot.tags.includes(selectedTag) ||
      (selectedTag === 'Hidden Gems' && spot.gemScore >= 8.0);

    const matchesSearch =
      !query ||
      spot.name.toLowerCase().includes(query) ||
      spot.tags.some((t) => t.toLowerCase().includes(query)) ||
      spot.dishes.some(
        (d) =>
          d.dishName.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.category.toLowerCase().includes(query)
      );

    return matchesTag && matchesSearch;
  });

  const popularTopics = ['Pizza', 'Biryani', 'Burger', 'Dosa', 'Secret Wings', 'Cold Brew Coffee'];
  const matchingTopics = popularTopics.filter((t) => !query || t.toLowerCase().includes(query));

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased text-body transition-colors ${
      isLight ? 'bg-[#FFF8F1] text-[#1F2937]' : 'bg-[#05070D] text-white'
    }`}>
      <ExplorerNav />

      <main className="max-w-7xl mx-auto w-full p-6 sm:p-10 space-y-8 flex-1 animate-fade-in">
        {/* Header & Instant Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-label text-[10px] uppercase tracking-widest ${
                  isLight ? 'text-[#D62828]' : 'text-[#FFB703]'
                }`}>
                  FOOD & HOTEL SEARCH ENGINE
                </span>
                <span className={`text-label text-[10px] px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  isLight
                    ? 'bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]'
                    : 'bg-[#092615] text-[#10b981] border-[#0f4424]'
                }`}>
                  <Navigation className="w-3 h-3 animate-pulse" /> {locationName}
                </span>
              </div>
              <h1 className={`text-section-heading text-3xl ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
                Nearby Hotels & Secret Dish Results
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSquadModal(true)}
                className={`px-4 py-2.5 rounded-2xl border text-label text-xs shadow-sm transition-colors flex items-center gap-1.5 hover-lift ${
                  isLight
                    ? 'bg-white border-black/8 text-[#1F2937] hover:bg-[#FFF3E8]'
                    : 'bg-[#131A2C] border-[#23314a] text-white hover:bg-[#05070D]'
                }`}
              >
                <Users className={`w-3.5 h-3.5 ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`} /> Squad Vote
              </button>

              <Link
                href="/explorer/map"
                className={`px-4 py-2.5 rounded-2xl text-label text-xs shadow-lg transition-all flex items-center gap-1.5 hover-lift ${
                  isLight
                    ? 'bg-[#D62828] hover:bg-[#B91C1C] text-white shadow-[#D62828]/25'
                    : 'bg-[#FFB703] hover:bg-[#d97706] text-black font-bold shadow-[#FFB703]/25'
                }`}
              >
                <span>🗺️</span> In-App Map
              </Link>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative max-w-2xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 opacity-50 absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                placeholder={isListening ? 'Listening for dish name...' : 'Search food (e.g. Pizza, Biryani, Burger, Dosa) or Voice Search 🎙️'}
                className={`w-full rounded-2xl border pl-11 pr-12 py-3.5 text-body text-xs outline-none transition-all shadow-sm ${
                  isListening
                    ? 'bg-red-500/10 border-red-500 text-red-500 font-bold placeholder-red-400 animate-pulse'
                    : isLight
                    ? 'bg-white border-black/8 text-[#1F2937] placeholder-[#6B7280] focus:border-[#D62828]'
                    : 'bg-[#131A2C] border-[#23314a] text-white placeholder-[#888888] focus:border-[#FFB703]'
                }`}
              />
              <button
                onClick={handleVoiceSearch}
                className={`absolute right-2.5 p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-bounce'
                    : isLight
                    ? 'bg-[#FFF3E8] text-[#D62828] hover:bg-[#FFEBE0]'
                    : 'bg-[#05070D] text-[#FFB703] hover:bg-[#131A2C]'
                }`}
                title="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Instant Craving Topics Dropdown Popup */}
            {showSearchDropdown && query && (
              <div className={`absolute top-full left-0 right-0 mt-2 border rounded-2xl p-3.5 z-30 shadow-2xl space-y-2 animate-scale-in ${
                isLight ? 'bg-white border-black/8 text-[#1F2937]' : 'bg-[#131A2C] border-[#23314a] text-white'
              }`}>
                <div className={`flex items-center justify-between px-2 pb-1 border-b ${isLight ? 'border-black/5' : 'border-[#23314a]'}`}>
                  <span className={`text-label text-[10px] uppercase flex items-center gap-1 ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`}>
                    <Sparkles className="w-3 h-3" /> Instant Craving Topics
                  </span>
                  <button
                    onClick={() => setShowSearchDropdown(false)}
                    className="text-body text-[10px] opacity-70 hover:opacity-100"
                  >
                    Close ✕
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {matchingTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setSearchQuery(topic);
                        setShowSearchDropdown(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-label text-xs flex items-center gap-1 transition-colors ${
                        isLight
                          ? 'bg-[#FFF3E8] border-black/5 text-[#1F2937] hover:border-[#D62828] hover:text-[#D62828]'
                          : 'bg-[#05070D] border-[#23314a] text-white hover:border-[#FFB703] hover:text-[#FFB703]'
                      }`}
                    >
                      <span>🍕 {topic}</span>
                      <ChevronRight className={`w-3 h-3 ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Craving Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CRAVING_CHIPS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-2xl text-label text-xs whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? isLight
                      ? 'bg-[#D62828] text-white shadow-md shadow-[#D62828]/25 scale-105'
                      : 'bg-[#FFB703] text-black font-bold shadow-md shadow-[#FFB703]/25 scale-105'
                    : isLight
                    ? 'bg-white border border-black/8 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF3E8]'
                    : 'bg-[#131A2C] border border-[#23314a] text-[#888888] hover:text-white hover:bg-[#05070D]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant & Dish Listing Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={`text-card-title text-lg ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
              Nearby Hotels & Secret Dish Results {query && `for "${query}"`} ({filteredSpots.length})
            </h2>
            <span className="text-body text-xs opacity-60">Sorted dynamically by live GPS proximity</span>
          </div>

          <div className="space-y-6">
            {filteredSpots.map((spot) => {
              const matchingDishes = query
                ? spot.dishes.filter(
                    (d) =>
                      d.dishName.toLowerCase().includes(query) ||
                      d.description.toLowerCase().includes(query) ||
                      d.category.toLowerCase().includes(query)
                  )
                : spot.dishes;

              const displayDishes = matchingDishes.length > 0 ? matchingDishes : spot.dishes;

              return (
                <div
                  key={spot.id}
                  className={`border rounded-3xl p-6 transition-all shadow-sm hover:shadow-md ${
                    isLight ? 'bg-white border-black/8' : 'bg-[#131A2C] border-[#23314a]'
                  }`}
                >
                  {/* Hotel Header Info */}
                  <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b ${
                    isLight ? 'border-black/5' : 'border-[#23314a]'
                  }`}>
                    <div className="flex items-center gap-4">
                      <Link href={`/explorer/restaurant/${spot.id}`}>
                        <img
                          src={spot.image}
                          alt={spot.name}
                          className="w-16 h-16 rounded-2xl object-cover hover:scale-105 transition-transform border border-black/8"
                        />
                      </Link>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link href={`/explorer/restaurant/${spot.id}`}>
                            <h3 className={`text-card-title text-base hover:text-[#D62828] dark:hover:text-[#FFB703] transition-colors ${
                              isLight ? 'text-[#1F2937]' : 'text-white'
                            }`}>
                              {spot.name}
                            </h3>
                          </Link>
                          <span className={`text-label text-[10px] px-2.5 py-0.5 rounded-full border ${
                            isLight
                              ? 'bg-[#FFF3E8] text-[#D62828] border-[#D62828]/20'
                              : 'bg-[#261c07] text-[#FFB703] border-[#3a2c0c]'
                          }`}>
                            💎 {spot.gemScore} GEM
                          </span>
                        </div>
                        <p className="text-body text-xs text-[#6B7280] dark:text-[#aaaaaa] mt-0.5">{spot.address}</p>
                        <div className="flex items-center gap-3 text-xs mt-1">
                          <span className="text-[#FFB703] text-label">★ {spot.rating} Google</span>
                          <span className="text-[#2563EB] text-label flex items-center gap-1">
                            <Navigation className="w-3 h-3" /> {spot.distanceKm} km away
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setBookingModalSpot(spot)}
                        className={`px-4 py-2.5 text-label text-xs rounded-2xl transition-colors flex items-center gap-1.5 shadow-sm hover-lift ${
                          isLight
                            ? 'bg-[#D62828] hover:bg-[#B91C1C] text-white shadow-[#D62828]/20'
                            : 'bg-[#FFB703] hover:bg-[#d97706] text-black font-bold shadow-[#FFB703]/20'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" /> Book Table
                      </button>
                      <Link
                        href={`/explorer/map?spot=${spot.id}`}
                        className={`px-4 py-2.5 rounded-2xl border text-label text-xs transition-colors hover-lift ${
                          isLight
                            ? 'bg-[#FFF8F1] border-black/8 text-[#1F2937] hover:bg-[#FFF3E8]'
                            : 'bg-[#05070D] border-[#23314a] text-white hover:bg-[#131A2C]'
                        }`}
                      >
                        📍 In-App Map
                      </Link>
                    </div>
                  </div>

                  {/* Dish Items Grid under Hotel */}
                  <div className="pt-4 space-y-3">
                    <span className="text-label text-[10px] uppercase tracking-wider opacity-70 flex items-center gap-1">
                      <UtensilsCrossed className={`w-3 h-3 ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`} /> Available Dishes & Secret Specials ({displayDishes.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {displayDishes.map((dish, dIdx) => (
                        <div
                          key={dIdx}
                          className={`p-4 rounded-2xl border flex justify-between items-start transition-all ${
                            dish.isSecret
                              ? isLight
                                ? 'bg-[#FFF3E8] border-[#D62828]/20'
                                : 'bg-[#1e1708] border-[#382607]'
                              : isLight
                              ? 'bg-[#FFF8F1] border-black/5'
                              : 'bg-[#05070D] border-[#23314a]'
                          }`}
                        >
                          <div>
                            {dish.isSecret && (
                              <span className={`text-label text-[9px] uppercase flex items-center gap-1 mb-1 ${
                                isLight ? 'text-[#D62828]' : 'text-[#FFB703]'
                              }`}>
                                <Flame className="w-3 h-3 fill-current" /> SECRET OFF-MENU ITEM
                              </span>
                            )}
                            <h4 className={`text-card-title text-xs ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>{dish.dishName}</h4>
                            <p className="text-body text-[11px] opacity-70 mt-1">{dish.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-price text-xs text-[#16A34A] dark:text-[#10b981]">₹{dish.price}</span>
                              <span className="text-body text-[10px] opacity-70 flex items-center gap-1">
                                <Clock className={`w-3 h-3 ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`} /> Prep: {dish.prepTime}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => setPreOrderDish({ spotName: spot.name, dish })}
                            className={`px-3.5 py-2 text-label text-[11px] rounded-xl transition-colors flex items-center gap-1 shrink-0 shadow-sm hover-lift ${
                              isLight
                                ? 'bg-[#D62828] hover:bg-[#B91C1C] text-white'
                                : 'bg-[#FFB703] hover:bg-[#d97706] text-black font-bold'
                            }`}
                          >
                            <ShoppingBag className="w-3 h-3" /> Pre-Order
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Pre-Order Modal */}
      {preOrderDish && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-scale-in">
          <div className={`w-full max-w-md border rounded-3xl p-6 space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-black/8 text-[#1F2937]' : 'bg-[#131A2C] border-[#23314a] text-white'
          }`}>
            {preOrderSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto text-xl text-label ${
                  isLight ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#16A34A]' : 'bg-[#092615] border-[#0f4424] text-[#10b981]'
                }`}>
                  ✓
                </div>
                <h3 className="text-card-title text-lg">Dish Pre-Ordered Successfully! 🛒</h3>
                <p className="text-body text-xs opacity-70">
                  Your order for {preOrderDish.dish.dishName} (₹{preOrderDish.dish.price}) at {preOrderDish.spotName} has been sent to the kitchen.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`flex items-center justify-between border-b pb-3.5 ${isLight ? 'border-black/5' : 'border-[#23314a]'}`}>
                  <div>
                    <span className={`text-label text-[10px] uppercase ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`}>PRE-ORDER DISH</span>
                    <h3 className="text-card-title text-base">{preOrderDish.dish.dishName}</h3>
                  </div>
                  <button onClick={() => setPreOrderDish(null)} className="text-body text-sm opacity-70">
                    ✕
                  </button>
                </div>

                <div className={`p-3.5 border rounded-2xl flex items-center justify-between ${
                  isLight ? 'bg-[#FFF8F1] border-black/5' : 'bg-[#05070D] border-[#23314a]'
                }`}>
                  <span className="text-body text-xs opacity-70">Total Amount</span>
                  <span className="text-price text-base text-[#16A34A] dark:text-[#10b981]">₹{preOrderDish.dish.price}</span>
                </div>

                <button
                  onClick={handleConfirmPreOrder}
                  className={`w-full py-3.5 text-label text-xs rounded-2xl shadow-lg hover-lift ${
                    isLight
                      ? 'bg-[#D62828] hover:bg-[#B91C1C] text-white shadow-[#D62828]/20'
                      : 'bg-[#FFB703] hover:bg-[#d97706] text-black font-bold shadow-[#FFB703]/20'
                  }`}
                >
                  Confirm Pre-Order Dish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table Booking Modal */}
      {bookingModalSpot && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-scale-in">
          <div className={`w-full max-w-md border rounded-3xl p-6 space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-black/8 text-[#1F2937]' : 'bg-[#131A2C] border-[#23314a] text-white'
          }`}>
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto text-xl text-label ${
                  isLight ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#16A34A]' : 'bg-[#092615] border-[#0f4424] text-[#10b981]'
                }`}>
                  ✓
                </div>
                <h3 className="text-card-title text-lg">Table Reservation Requested! 🎉</h3>
                <p className="text-body text-xs opacity-70">
                  Your request for {partySize} guests at {bookingModalSpot.name} is pending confirmation from the restaurant.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`flex items-center justify-between border-b pb-3.5 ${isLight ? 'border-black/5' : 'border-[#23314a]'}`}>
                  <div>
                    <span className={`text-label text-[10px] uppercase ${isLight ? 'text-[#D62828]' : 'text-[#FFB703]'}`}>TABLE RESERVATION</span>
                    <h3 className="text-card-title text-base">{bookingModalSpot.name}</h3>
                  </div>
                  <button onClick={() => setBookingModalSpot(null)} className="text-body text-sm opacity-70">
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-label text-[11px] opacity-70 uppercase mb-1.5">
                    Party Size (Guests)
                  </label>
                  <div className="flex gap-2">
                    {['1', '2', '4', '6', '8+'].map((num) => (
                      <button
                        key={num}
                        onClick={() => setPartySize(num)}
                        className={`flex-1 py-2 rounded.xl text-label text-xs border transition-colors ${
                          partySize === num
                            ? isLight
                              ? 'bg-[#D62828] text-white border-[#D62828]'
                              : 'bg-[#FFB703] text-black border-[#FFB703] font-bold'
                            : isLight
                            ? 'bg-[#FFF8F1] border-black/8 text-[#6B7280]'
                            : 'bg-[#05070D] border-[#23314a] text-[#aaaaaa]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-label text-[11px] opacity-70 uppercase mb-1">
                    Preferred Time Slot
                  </label>
                  <input
                    type="text"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className={`w-full border rounded-2xl px-3.5 py-2.5 text-body text-xs outline-none ${
                      isLight
                        ? 'bg-[#FFF8F1] border-black/8 text-[#1F2937]'
                        : 'bg-[#05070D] border-[#23314a] text-white'
                    }`}
                  />
                </div>

                <button
                  onClick={handleBookTable}
                  className={`w-full py-3.5 text-label text-xs rounded-2xl shadow-lg hover-lift ${
                    isLight
                      ? 'bg-[#D62828] hover:bg-[#B91C1C] text-white shadow-[#D62828]/20'
                      : 'bg-[#FFB703] hover:bg-[#d97706] text-black font-bold shadow-[#FFB703]/20'
                  }`}
                >
                  Confirm Reservation Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
