
/**
 * @fileoverview Defines the data models for Experiences and their bookings.
 */

import type { Guest } from './guest';

/**
 * Represents a guest experience or activity offered by the hotel.
 */
export interface Experience {
  id: string; // e.g., "tea-factory-tour"
  name: string;
  shortDescription: string;
  detailedDescription: string;
  duration: string; // e.g., "3 hours"
  pricePerAdult: number;
  pricePerChild: number;
  currency: 'USD' | 'LKR' | 'EUR';
  maxParticipants: number;
  meetingPoint: string;
  inclusions: string[];
  whatToBring: string[];
  status: 'Active' | 'Inactive' | 'Seasonal';
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
 * Represents a single booking for an experience.
 */
export interface ExperienceBooking {
  id: string; // e.g., "EXPBK-001"
  experienceId: string; // Foreign key to Experiences
  guestId: string; // Foreign key to Guests
  experienceDate: Date;
  experienceTime: string;
  adults: number;
  children: number;
  totalPrice: number;
  paymentStatus: 'Paid' | 'Pending';
  bookingStatus: 'Confirmed' | 'Cancelled';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  experience?: Experience;
  guest?: Guest;
}
