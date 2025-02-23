export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Image {
  id: string;
  property_id: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface Listing extends Property {
  images: Image[];
} 