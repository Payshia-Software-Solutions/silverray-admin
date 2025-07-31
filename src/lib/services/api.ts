

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
  id: number;
  room_number: string;
  descriptive_title: string;
  current_status: 'available' | 'booked' | 'maintenance';
  price_per_night: string;
  currency: string;
}

/**
 * Defines the structure for a Reservation object from the API.
 */
export interface ReservationFromApi {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalAmount: string;
  paymentStatus: 'Paid' | 'Pending' | 'Due';
  bookingStatus: 'Confirmed' | 'Pending' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
  guest?: {
    fullName: string;
    email: string;
  };
  room?: {
    id: string; // Room number
    room_type_details: {
      name: string; // Room type name
    };
  };
}

/**
 * Defines the structure of a RoomType object as returned by the API.
 */
export interface RoomTypeFromApi {
  id: number;
  room_type_id: string;
  company_Id: string;
  type_name: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

/**
 * Defines the structure of an Amenity object as returned by the API.
 */
export interface AmenityFromApi {
  id: number;
  amenities_id: number;
  amenity_name: string;
  company_id: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
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
   // Check if the response has content before trying to parse it as JSON
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
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
 * Fetches all room types from the back-end.
 * @returns A promise that resolves to an array of RoomTypeFromApi objects.
 */
export async function getRoomTypes(): Promise<RoomTypeFromApi[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/room-types`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return handleResponse<RoomTypeFromApi[]>(response);
    } catch (error) {
        console.error('Failed to fetch room types:', error);
        throw error;
    }
}

/**
 * Fetches all amenities from the back-end.
 * @returns A promise that resolves to an array of AmenityFromApi objects.
 */
export async function getAmenities(): Promise<AmenityFromApi[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/amenities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<AmenityFromApi[]>(response);
  } catch (error) {
    console.error('Failed to fetch amenities:', error);
    throw error;
  }
}


/**
 * Fetches all reservations from the back-end.
 * @returns A promise that resolves to an array of ReservationFromApi objects.
 */
export async function getReservations(): Promise<ReservationFromApi[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/roombookings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponse<ReservationFromApi[]>(response);
  } catch (error) {
    console.error('Failed to fetch reservations:', error);
    throw error;
  }
}

/**
 * Creates a new room.
 * @param roomData The data for the new room.
 * @returns A promise that resolves with the newly created room data.
 */
export async function createRoom(roomData: any): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData),
        });
        return handleResponse<any>(response);
    } catch (error) {
        console.error('Failed to create room:', error);
        throw error;
    }
}

/**
 * Deletes a room by its ID.
 * @param roomId The ID of the room to delete.
 * @returns A promise that resolves with a success message.
 */
export async function deleteRoom(roomId: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<{ message: string }>(response);
  } catch (error) {
    console.error(`Failed to delete room ${roomId}:`, error);
    throw error;
  }
}

/**
 * Deletes a reservation by its ID.
 * @param bookingId The ID of the booking to delete.
 * @returns A promise that resolves with a success message.
 */
export async function deleteBooking(bookingId: string): Promise<{ message: string }> {
  try {
    // Note: The backend route might need to be adjusted to handle IDs with '#'
    const encodedBookingId = encodeURIComponent(bookingId);
    const response = await fetch(`${API_BASE_URL}/roombooking/${encodedBookingId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<{ message: string }>(response);
  } catch (error) {
    console.error(`Failed to delete booking ${bookingId}:`, error);
    throw error;
  }
}
