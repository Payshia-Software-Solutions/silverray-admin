/**
 * @fileoverview This service handles all API communication with the PHP back-end using axios.
 */
import axios from 'axios';

// Create a central axios instance for API requests.
// This is a best practice for managing API configurations.
const apiClient = axios.create({
  // This is a placeholder. Replace it with your actual PHP server URL.
  // Make sure this URL is accessible from your front-end environment.
  // Example: 'http://localhost/my-hotel-app/api'
  baseURL: 'http://localhost/Silver_server', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- API Function Types ---

// This type should match the structure of your `Rooms` table from the PHP back-end.
export interface RoomFromApi {
    id: string;
    type: string;
    status: 'Available' | 'Booked' | 'Under Maintenance';
    price: string;
    occupancy: string;
}

// --- API Functions ---

/**
 * Fetches all rooms from the back-end.
 * Corresponds to a GET request to the '/rooms' endpoint in your PHP router.
 * @returns A promise that resolves with an array of rooms.
 */
export async function getRooms(): Promise<RoomFromApi[]> {
  try {
    // The request will be made to 'http://localhost/Silver_server/index.php?route=/rooms'
    // This ensures it hits the router correctly without needing .htaccess rewrites.
    const response = await apiClient.get<RoomFromApi[]>('/index.php?route=/rooms');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    // Re-throw the error so the calling component's error state can be updated.
    throw error;
  }
}

/**
 * Creates a new room.
 * Corresponds to a POST request to the '/rooms/new' endpoint.
 * @param roomData The data for the new room.
 * @returns A promise that resolves with the server's confirmation message and new ID.
 */
export async function createRoom(roomData: Omit<RoomFromApi, 'id'>): Promise<{ message: string; id: string }> {
  try {
    const response = await apiClient.post<{ message: string; id: string }>('/index.php?route=/rooms/new', roomData);
    return response.data;
  } catch (error) {
    console.error('Failed to create room:', error);
    throw error;
  }
}

// You can add more functions here for other endpoints, for example:
/*
export async function getGuest(guestId: string): Promise<Guest> {
  try {
    const response = await apiClient.get(`/guests/${guestId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch guest ${guestId}:`, error);
    throw error;
  }
}
*/
