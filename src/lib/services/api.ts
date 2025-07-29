/**
 * @fileoverview This service handles all API communication with the PHP back-end.
 */

// IMPORTANT: Replace this with the actual base URL of your PHP server.
// If your PHP server runs in a subdirectory on localhost (e.g., /Silver_server), include it here.
const API_BASE_URL = 'http://localhost/Silver_server'; // Example for a local PHP server in a subdirectory

/**
 * A generic fetch function to handle requests to the PHP API.
 * It simplifies error handling and JSON parsing.
 * @param endpoint The specific API endpoint (e.g., '/rooms', '/bookings/123').
 * @param options The standard options for a fetch request (method, headers, body).
 * @returns A promise that resolves with the JSON response from the API.
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      // If the server response is not OK, throw an error with the status text.
      const errorBody = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    // If the response is successful, parse the JSON body.
    return await response.json() as T;
  } catch (error) {
    console.error('Failed to fetch from API:', error);
    // Re-throw the error so the calling component can handle it.
    throw error;
  }
}

// --- Example API Functions ---

// Define a type for the Room data we expect from the PHP API
// This should match the structure of your rooms table
export interface RoomFromApi {
    id: string;
    type: string;
    status: 'Available' | 'Booked' | 'Under Maintenance';
    price: string;
    occupancy: string;
}

/**
 * Fetches all rooms from the back-end.
 * Corresponds to a GET request to an endpoint like '/rooms'.
 */
export function getRooms(): Promise<RoomFromApi[]> {
    return apiFetch<RoomFromApi[]>('/rooms', { method: 'GET' });
}

/**
 * Creates a new room.
 * Corresponds to a POST request to an endpoint like '/rooms'.
 * @param roomData The data for the new room.
 */
export function createRoom(roomData: Omit<RoomFromApi, 'id'>): Promise<{ message: string; id: string }> {
    return apiFetch<{ message: string; id: string }>('/rooms', {
        method: 'POST',
        body: JSON.stringify(roomData),
    });
}
