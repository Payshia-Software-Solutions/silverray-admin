
/**
 * @fileoverview Defines data models for Restaurant Management.
 */
import type { Guest } from './guest';

/**
 * Represents a dining venue within the hotel.
 */
export interface Restaurant {
  id: string; // e.g., "main-restaurant"
  name: string;
  description: string;
  capacity: number;
  status: 'Active' | 'Inactive' | 'Seasonal';
  // Operating hours could be a JSON object for more structure
  operatingHours: string; 
  images: {
    src: string;
    alt: string;
    hint: string;
    primary: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a single item on a restaurant's menu.
 */
export interface MenuItem {
  id: string; // e.g., "grilled-salmon"
  restaurantId: string; // Foreign key to Restaurants
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'LKR' | 'EUR';
  category: 'Starter' | 'Main Course' | 'Dessert' | 'Beverage';
  status: 'Available' | 'Unavailable' | 'Seasonal';
  dietaryInfo: ('Gluten-Free' | 'Vegetarian' | 'Vegan' | 'Keto-Friendly')[];
  spiceLevel?: 'Not Spicy' | 'Mild' | 'Medium' | 'Hot';
  image?: {
    src: string;
    alt: string;
    hint: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a reservation at a dining venue.
 */
export interface RestaurantReservation {
  id: string; // e.g., "RES-001"
  restaurantId: string; // Foreign key to Restaurants
  guestId: string; // Foreign key to Guests
  reservationDate: Date;
  reservationTime: string;
  numberOfGuests: number;
  tableNumber?: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Seated';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  restaurant?: Restaurant;
  guest?: Guest;
}
