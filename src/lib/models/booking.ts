
/**
 * @fileoverview Defines the data models for room bookings, payments,
 * and related guest information.
 */

import type { Guest } from './guest';
import type { Room } from './room';

/**
 * Represents a single payment transaction associated with a booking.
 */
export interface Payment {
  id: string; // e.g., "PAY_12345"
  bookingId: string; // Foreign key to the Booking
  amount: number;
  method: 'Credit Card' | 'Cash' | 'Bank Transfer';
  status: 'Completed' | 'Pending' | 'Failed';
  transactionDate: Date;
}

/**
 * Represents a log entry for an activity on a booking.
 */
export interface BookingActivityLog {
  id: string;
  bookingId: string; // Foreign key to the Booking
  text: string;
  timestamp: Date;
  userId?: string; // Optional: links to the admin user who performed the action
}

/**
 * Represents a booking for a hotel room.
 * This is the central table linking guests to rooms for a specific duration.
 */
export interface RoomBooking {
  id: string; // e.g., "BK001"
  guestId: string; // Foreign key to the Guests table
  roomId: string; // Foreign key to the Rooms table
  checkInDate: Date;
  checkOutDate: Date;
  adults: number;
  children: number;
  totalAmount: number;
  amountPaid: number;
  currency: 'USD' | 'LKR' | 'EUR';
  paymentStatus: 'Paid' | 'Pending' | 'Due';
  bookingStatus: 'Confirmed' | 'Pending' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
  bookingSource: 'Web' | 'Phone' | 'Walk-in';
  specialRequests?: string;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  guest?: Guest;
  room?: Room;
  payments?: Payment[];
  activityLog?: BookingActivityLog[];
}
