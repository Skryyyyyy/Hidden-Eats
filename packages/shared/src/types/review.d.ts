export interface Review {
    id: string;
    restaurant_id: string;
    user_id: string;
    rating: number;
    food_quality: number;
    price_worth: number;
    service: number;
    ambience: number;
    consistency: number;
    text_review: string | null;
    photo_urls: string[];
    created_at: string;
}
export interface HiddenGemBreakdown {
    overallScore: number;
    foodQuality: number;
    priceWorth: number;
    service: number;
    ambience: number;
    consistency: number;
    reviewCount: number;
}
