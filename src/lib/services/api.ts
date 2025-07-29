/**
 * @fileoverview This service handles all API communication with the PHP back-end using the Fetch API.
 */

// The base URL should point to your PHP application's entry script.
const API_ENDPOINT = 'http://localhost/Silver_server/index.php';

// --- Helper Functions ---

/**
 * Handles the response from the Fetch API.
 * It checks if the response was successful and parses the JSON.
 * @param response The response object from a fetch call.
 * @returns A promise that resolves with the JSON data.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }
  return response.json() as Promise<T>;
}


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
    // The request will be made to 'http://localhost/Silver_server/index.php/rooms'
    // This ensures it hits the router correctly without needing .htaccess rewrites.
    const response = await fetch(`${API_ENDPOINT}/rooms`);
    return handleResponse<RoomFromApi[]>(response);
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
    const response = await fetch(`${API_ENDPOINT}/rooms/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
    });
    return handleResponse<{ message: string; id: string }>(response);
  } catch (error) {
    console.error('Failed to create room:', error);
    throw error;
  }
}
