export interface Review {
  id: string;
  restaurant_id: string;
  user_id: string;
  rating: number; // 1-5
  food_quality: number; // 1-5
  price_worth: number; // 1-5
  service: number; // 1-5
  ambience: number; // 1-5
  consistency: number; // 1-5
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
