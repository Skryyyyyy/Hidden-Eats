export interface Menu {
  id: string;
  restaurant_id: string;
  created_at: string;
}

export interface MenuItem {
  id: string;
  menu_id: string;
  name: string;
  description: string | null;
  price: number;
  photo_url: string | null;
  is_off_menu_secret: boolean;
  is_available: boolean;
  category: string;
}
