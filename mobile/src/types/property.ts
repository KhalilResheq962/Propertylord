export interface Property {
  _id: string;
  address: string;
  description: string;
  price: number;
  type: string;
  status: 'for-sale' | 'for-rent';
  bedrooms: number;
  bathrooms: number;
  virtualTourUrl?: string;
  images: string[];
  location?: {
    type: string;
    coordinates: number[]; // [lng, lat]
  };
  createdAt?: string;
}