/**
 * @fileoverview Defines the data models for Room and RoomType entities.
 * These interfaces provide a structured blueprint for database tables
 * and for handling room-related data throughout the application.
 */

/**
 * Represents a category of room, like "Deluxe Double" or "King Suite".
 * This allows for managing common properties for a type of room.
 */
export interface RoomType {
  id: string; // e.g., "deluxe-double"
  name: string; // e.g., "Deluxe Double Room"
  descriptiveTitle: string; // e.g., "Deluxe Double Room with Balcony"
  shortDescription: string;
  adults: number;
  children: number;
  roomSize: {
    width: number;
    height: number;
    unit: 'sqft' | 'm²';
  };
  pricePerNight: number;
  currency: 'USD' | 'LKR' | 'EUR';
  amenities: string[]; // List of amenity keys, e.g., ["king-bed", "wifi"]
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
 * Represents an individual, physical room in the hotel.
 */
export interface Room {
  id: string; // The physical room number, e.g., "101", "205A"
  roomTypeId: string; // Foreign key linking to the RoomType table
  status: 'Available' | 'Booked' | 'Under Maintenance' | 'Cleaning';
  notes?: string; // Internal notes for staff
  createdAt: Date;
  updatedAt: Date;
}
