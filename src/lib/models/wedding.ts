
/**
 * @fileoverview Defines the data models for Wedding Packages and Bookings.
 */

import type { Guest } from './guest';

/**
 * Represents a pre-defined wedding package.
 */
export interface WeddingPackage {
  id: string; // e.g., "silver-grandeur"
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'LKR' | 'EUR';
  maxGuests: number;
  inclusions: string[]; // List of what the package includes
  associatedHallIds: string[]; // List of hall IDs suitable for this package
  status: 'Active' | 'Inactive';
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
 * Represents a booking for a wedding.
 */
export interface WeddingBooking {
  id: string; // e.g., "WB2024001"
  guestId: string; // Foreign key to Guests
  packageId: string; // Foreign key to WeddingPackages
  hallId: string; // Could be a foreign key to a Halls table if halls have more detail
  weddingDate: Date;
  expectedGuests: number;
  totalPrice: number;
  amountPaid: number;
  paymentStatus: 'Deposit Paid' | 'Full Paid' | 'Pending';
  bookingStatus: 'Confirmed' | 'Pending' | 'Cancelled';
  additionalServices?: {
    serviceName: string;
    description: string;
    price: number;
  }[]; // Stored as JSON
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  guest?: Guest;
  package?: WeddingPackage;
}
