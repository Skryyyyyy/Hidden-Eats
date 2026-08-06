export interface Restaurant {
    id: string;
    google_place_id: string;
    cached_lat: number | null;
    cached_lng: number | null;
    lat_lng_cached_at: string | null;
    hidden_gem_score: number | null;
    curated_tags: string[];
    is_bookable: boolean;
    added_by_admin_id?: string | null;
    created_at: string;
}
export interface GooglePlaceLiveDetails {
    place_id: string;
    name: string;
    formatted_address: string;
    rating: number | null;
    user_rating_count: number | null;
    photos: Array<{
        photo_reference: string;
        height: number;
        width: number;
    }>;
    opening_hours?: {
        open_now: boolean;
        weekday_text: string[];
    };
    price_level?: number;
    location?: {
        lat: number;
        lng: number;
    };
}
export interface Tag {
    id: string;
    name: string;
    category: 'mood' | 'budget' | 'occasion' | 'amenity';
}
export type RestaurantWithDetails = Restaurant & {
    liveDetails?: GooglePlaceLiveDetails;
    distanceKm?: number;
};
