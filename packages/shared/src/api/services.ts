import { MOCK_RESTAURANTS, MOCK_MENU } from './mockData.js';

// Simulated delay to mimic network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const RestaurantService = {
  /**
   * Fetch all restaurants
   * BACKEND TODO: Replace this mock implementation with actual Supabase/Fetch call
   */
  async getRestaurants(): Promise<any[]> {
    await delay(800); // Simulate network latency
    return MOCK_RESTAURANTS;
  },

  /**
   * Fetch a single restaurant by ID
   * BACKEND TODO: Replace with real query
   */
  async getRestaurantById(id: string): Promise<any | null> {
    await delay(500);
    const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
    return restaurant || MOCK_RESTAURANTS[0]; // fallback for demo
  },

  /**
   * Fetch menu items for a specific restaurant
   * BACKEND TODO: Replace with real query fetching from menu_items table
   */
  async getMenu(restaurantId: string): Promise<any[]> {
    await delay(600);
    return MOCK_MENU;
  }
};

export const OrderService = {
  /**
   * Place a new order
   * BACKEND TODO: Implement order creation logic in database
   */
  async placeOrder(cart: any, total: number): Promise<{ success: boolean; orderId: string }> {
    await delay(1500);
    return { success: true, orderId: `ORD-${Math.floor(Math.random() * 10000)}` };
  }
};
