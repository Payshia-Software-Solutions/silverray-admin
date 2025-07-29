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
  const text = await response.text();
  if (!response.ok) {
    // Try to parse the error text as JSON, but fall back to the raw text if it fails
    let errorDetails = text;
    try {
        const jsonError = JSON.parse(text);
        errorDetails = jsonError.error || JSON.stringify(jsonError);
    } catch (e) {
        // Not a JSON error, use the raw text
    }
    throw new Error(`API request failed with status ${response.status}: ${errorDetails}`);
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new Error('Failed to parse JSON response from server.');
  }
}


// --- API Function Types ---

// This type should match the structure of your `Rooms` table from the PHP back-end.
export interface RoomFromApi {
    id: string;
    type: string;
    status: 'Available' | 'Booked' | 'Under Maintenance';
    price: string;
    occupancy?: string; // Made optional to match existing usage
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
    const response = await fetch(`${API_ENDPOINT}?route=/rooms`);
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
    const response = await fetch(`${API_ENDPOINT}?route=/rooms/new`, {
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
