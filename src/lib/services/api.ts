/**
 * @fileoverview This service handles all API communication with the PHP back-end using axios.
 */
import axios from 'axios';

// Create a central axios instance for API requests.
// This is a best practice for managing API configurations.
const apiClient = axios.create({
  // This base URL should point to the root of your local server.
  baseURL: 'http://localhost', 
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
    const response = await apiClient.get<RoomFromApi[]>('/Silver_server/index.php?route=/rooms');
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
    const response = await apiClient.post<{ message: string; id: string }>('/Silver_server/index.php?route=/rooms/new', roomData);
    return response.data;
  } catch (error) {
    console.error('Failed to create room:', error);
    throw error;
  }
}
