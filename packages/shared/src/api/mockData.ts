import { Restaurant, GooglePlaceLiveDetails } from '../types/restaurant.js';
import { MenuItem } from '../types/menu.js';

export const MOCK_RESTAURANTS: any[] = [
  { id: '1', name: 'Sangeetha Veg Restaurant', rating: 4.8, time: '20-25 mins', cuisines: 'South Indian, Pure Veg', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2000&q=100', location: 'T. Nagar, Chennai', offer: '20% OFF' },
  { id: '2', name: 'A2B - Adyar Ananda Bhavan', rating: 4.6, time: '15-20 mins', cuisines: 'Sweets, South Indian', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=2000&q=100', location: 'Adyar, Chennai', offer: 'FREE DELIVERY' },
  { id: '3', name: 'Murugan Idli Shop', rating: 4.9, time: '30-35 mins', cuisines: 'South Indian, Breakfast', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=2000&q=100', location: 'Besant Nagar, Chennai', offer: '10% OFF' },
  { id: '4', name: 'Dindigul Thalappakatti', rating: 4.7, time: '40-45 mins', cuisines: 'Biryani, South Indian', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=2000&q=100', location: 'Nungambakkam', offer: '20% OFF above ₹400' },
  { id: '5', name: 'Buhari Hotel', rating: 4.5, time: '25-30 mins', cuisines: 'Mughlai, Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=2000&q=100', location: 'Mount Road, Chennai', offer: '60% OFF' },
  { id: '6', name: 'Junior Kuppanna', rating: 4.4, time: '10-15 mins', cuisines: 'Kongunadu, South Indian', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=2000&q=100', location: 'Velachery', offer: 'Buy 1 Get 1' },
  { id: '7', name: 'Ambur Star Briyani', rating: 4.3, time: '15-25 mins', cuisines: 'Biryani, Fast Food', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=2000&q=100', location: 'Anna Nagar', offer: '20% OFF' },
  { id: '8', name: 'Saravana Bhavan', rating: 4.8, time: '30-40 mins', cuisines: 'South Indian, Pure Veg', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=2000&q=100', location: 'Mylapore, Chennai', offer: 'FREE DESSERT' },
];

export const MOCK_MENU = [
  { id: 'm1', name: 'Ghee Roast Dosa', description: 'Crispy dosa cooked with pure ghee, served with 3 types of chutney and sambar.', price: 120, isVeg: true, image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=300&q=80' },
  { id: 'm2', name: 'Chicken Biryani', description: 'Classic seeraga samba biryani cooked with tender chicken pieces and aromatic spices.', price: 280, isVeg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80' },
  { id: 'm3', name: 'Paneer Butter Masala', description: 'Soft paneer cubes in a rich, creamy tomato gravy.', price: 220, isVeg: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=300&q=80' },
  { id: 'm4', name: 'Idli (2 Pcs)', description: 'Soft and fluffy steamed rice cakes.', price: 40, isVeg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=300&q=80' },
  { id: 'm5', name: 'Filter Coffee', description: 'Authentic South Indian filter coffee.', price: 60, isVeg: true, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80' },
];
