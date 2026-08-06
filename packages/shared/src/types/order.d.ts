export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export interface Order {
    id: string;
    restaurant_id: string;
    user_id: string;
    total_amount: number;
    status: OrderStatus;
    payment_id: string | null;
    created_at: string;
}
export interface OrderItem {
    id: string;
    order_id: string;
    menu_item_id: string;
    quantity: number;
    price_per_item: number;
}
