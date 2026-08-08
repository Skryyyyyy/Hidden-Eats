export declare const RestaurantService: {
    /**
     * Fetch all restaurants
     * BACKEND TODO: Replace this mock implementation with actual Supabase/Fetch call
     */
    getRestaurants(): Promise<any[]>;
    /**
     * Fetch a single restaurant by ID
     * BACKEND TODO: Replace with real query
     */
    getRestaurantById(id: string): Promise<any | null>;
    /**
     * Fetch menu items for a specific restaurant
     * BACKEND TODO: Replace with real query fetching from menu_items table
     */
    getMenu(restaurantId: string): Promise<any[]>;
};
export declare const OrderService: {
    /**
     * Place a new order
     * BACKEND TODO: Implement order creation logic in database
     */
    placeOrder(cart: any, total: number): Promise<{
        success: boolean;
        orderId: string;
    }>;
};
