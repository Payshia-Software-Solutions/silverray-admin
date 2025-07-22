
/**
 * @fileoverview Defines the data model for a Guest.
 * This centralizes guest information to avoid redundancy across different
 * booking and reservation tables (3NF).
 */

/**
 * Represents a single guest entity.
 * This table can be referenced by RoomBookings, ExperienceBookings, etc.
 */
export interface Guest {
  id: string; // e.g., "GUEST_12345"
  fullName: string;
  email: string; // Should be unique
  phone: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
