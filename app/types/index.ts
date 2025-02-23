export interface User {
  id: string;
  email: string;
  name: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  property_id: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  updated_at: string;
}

export interface Listing extends Property {
  images: Image[];
} 