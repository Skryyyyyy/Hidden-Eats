"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = exports.RestaurantService = void 0;
const mockData_js_1 = require("./mockData.js");
// Simulated delay to mimic network request
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.RestaurantService = {
    /**
     * Fetch all restaurants
     * BACKEND TODO: Replace this mock implementation with actual Supabase/Fetch call
     */
    async getRestaurants() {
        await delay(800); // Simulate network latency
        return mockData_js_1.MOCK_RESTAURANTS;
    },
    /**
     * Fetch a single restaurant by ID
     * BACKEND TODO: Replace with real query
     */
    async getRestaurantById(id) {
        await delay(500);
        const restaurant = mockData_js_1.MOCK_RESTAURANTS.find(r => r.id === id);
        return restaurant || mockData_js_1.MOCK_RESTAURANTS[0]; // fallback for demo
    },
    /**
     * Fetch menu items for a specific restaurant
     * BACKEND TODO: Replace with real query fetching from menu_items table
     */
    async getMenu(restaurantId) {
        await delay(600);
        return mockData_js_1.MOCK_MENU;
    }
};
exports.OrderService = {
    /**
     * Place a new order
     * BACKEND TODO: Implement order creation logic in database
     */
    async placeOrder(cart, total) {
        await delay(1500);
        return { success: true, orderId: `ORD-${Math.floor(Math.random() * 10000)}` };
    }
};
