
/**
 * @fileoverview Defines data models for User and Role management.
 */

/**
 * Represents a user role within the system, defining permissions.
 */
export interface Role {
  id: string; // e.g., "super-admin", "booking-manager"
  name: string;
  // Permissions can be a JSON object or a separate table for more granularity
  permissions: string[]; 
}

/**
 * Represents an admin user of the hotel management system.
 */
export interface User {
  id: string;
  email: string; // Unique identifier
  fullName: string;
  passwordHash: string; // Never store plain text passwords
  roleId: string; // Foreign key to the Roles table
  status: 'Active' | 'Inactive';
  lastLogin: Date;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relationship
  role?: Role;
}
