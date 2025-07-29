/**
 * @fileoverview This file contains the functions for making API calls to the PHP back-end.
 * It uses the native fetch API for all requests.
 */

// The base URL of your PHP server's router script
const API_BASE_URL = 'http://localhost/Silver_server';

/**
 * Defines the structure of a Room object as returned by the API.
 */
export interface RoomFromApi {
  id: string; // e.g., "101"
  type: string; // e.g., "Deluxe Double Room"
  status: 'Available' | 'Booked' | 'Under Maintenance';
  pricePerNight: string; // e.g., "150.00"
  occupancy: string; // e.g., "2 Adults / 1 Child"
}


/**
 * A helper function to handle the response from the fetch API.
 * It checks for errors and parses the JSON response.
 * @param response The Response object from a fetch call.
 * @returns A promise that resolves with the JSON data.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }
  return response.json();
}

/**
 * Fetches all rooms from the back-end.
 * @returns A promise that resolves to an array of RoomFromApi objects.
 */
export async function getRooms(): Promise<RoomFromApi[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponse<RoomFromApi[]>(response);
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    // In a real app, you might want to handle this more gracefully
    throw error;
  }
}

/**
 * Creates a new room.
 * @param roomData The data for the new room.
 * @returns A promise that resolves with the newly created room data.
 */
export async function createRoom(roomData: Omit<RoomFromApi, 'id'>): Promise<RoomFromApi> {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData),
        });
        return handleResponse<RoomFromApi>(response);
    } catch (error) {
        console.error('Failed to create room:', error);
        throw error;
    }
}
