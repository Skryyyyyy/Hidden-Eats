export interface Collection {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  restaurant_id: string;
  note: string | null;
  sort_order: number;
}
