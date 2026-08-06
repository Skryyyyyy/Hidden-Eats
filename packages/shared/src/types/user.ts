export type UserRole = 'explorer' | 'partner' | 'admin';
export type PartnerStaffRole = 'owner' | 'manager' | 'chef';

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  badges: string[];
  role: UserRole;
  business_name?: string | null;
  phone_number?: string | null;
  created_at: string;
}

export interface RestaurantOwner {
  id: string;
  user_id: string;
  restaurant_id: string;
  role: PartnerStaffRole;
  created_at: string;
}
