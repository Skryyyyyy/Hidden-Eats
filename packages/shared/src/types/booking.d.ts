export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export interface Booking {
    id: string;
    restaurant_id: string;
    user_id: string;
    party_size: number;
    booking_time: string;
    status: BookingStatus;
    special_requests: string | null;
    created_at: string;
}
