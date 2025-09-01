

/**
 * @fileoverview This file contains the functions for making API calls to the PHP back-end.
 * It uses the native fetch API for all requests.
 */

// The base URL of your PHP server's router script
const API_BASE_URL = 'http://localhost/Silver_server';
export const CONTENT_PROVIDER_BASE_URL = 'https://content-provider.payshia.com/silver-ray';


/**
 * Defines the structure of a Room object as returned by the API.
 */
export interface RoomFromApi {
  id: number;
  room_number: string;
  descriptive_title: string;
  current_status: 'Available' | 'Booked' | 'Under Maintenance';
  price_per_night: string;
  currency: string;
  room_type_id: number;
  short_description: string;
  adults_capacity: number;
  children_capacity: number;
  room_width: string;
  room_height: string;
  amenities_id: string; // Comma-separated string of amenity IDs
  image_url: string;
  company_id: string;
  created_by: string;
  updated_by: string | null;
  is_active: number;
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
 * Defines the structure for a Booking object from the API.
 */
export interface BookingFromApi {
  id: number;
  booking_id: string;
  room_type_id: string;
  customer_id: string;
  room_number: string;
  company_id: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  numbers_of_night: number;
  total_amount: string;
  amount_paid: string;
  balance_due: string;
  payment_status: 'Paid' | 'Pending' | 'Due';
  payment_method: 'Credit Card' | 'Cash' | 'Bank Transfer' | 'Online';
  discount_code: string | null;
  booking_status: 'Confirmed' | 'Pending' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
  booking_source: 'Online' | 'Phone' | 'Walk-in';
  customer: {
    full_name: string;
    email: string;
  };
   roomType?: {
    type_name: string;
  };
}


/**
 * Defines the structure of a RoomType object as returned by the API.
 */
export interface RoomTypeFromApi {
  id: number;
  room_type_id: string;
  company_id: string;
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

export interface CustomerFromApi {
    id: number;
    customer_id: string;
    customer_type: 'individual' | 'corporate' | 'vip' | 'group';
    company_id: string;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    special_requests: string;
    account_status: 'active' | 'inactive' | 'suspended' | 'pending';
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
}

export interface RestaurantFeatureFromApi {
  id: number;
  feature_id: string;
  feature_name: string;
  company_id: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface ExperienceFromApi {
  id: number;
  name: string;
  company_id: string;
  meeting_Point: string;
  short_description: string;
  detailed_description: string;
  duration: string;
  Price: string;
  pricing_basis: string;
  min_participants: number;
  max_participants: number;
  advance_booking_required: number;
  walk_in_available: number;
  day_of_week: string;
  is_available: number;
  schedule_note: string;
  status: 'Active' | 'Inactive' | 'Seasonal';
  images_url: string;
  time_slot: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface ExperienceImageFromApi {
    id: number;
    experience_id: number;
    company_id: number;
    image_name: string;
    image_url: string;
    file_size: number;
    alt_text: string;
    is_primary: number;
    display_order: number;
    uploaded_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    is_active: number;
}


export interface HallFromApi {
  id: number;
  hall_id: string;
  hall_name: string;
  company_id: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface PackageInclusionFromApi {
  id: number;
  inclusion_id: string;
  inclusion_type: string;
  company_id: string;
  description: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface WeddingPackageFromApi {
    id: number;
    package_name: string;
    hall_id: string;
    company_id: string;
    inclusions: string; // Comma-separated IDs
    status: 'Active' | 'Inactive' | 'Seasonal';
    short_description: string;
    detailed_description: string;
    price: string;
    max_guests: number;
    image_urls: string | null;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
}

export interface RestaurantFromApi {
  id: number;
  venue_name: string;
  short_description: string;
  detailed_description: string;
  capacity: number;
  operating_hours_id: string;
  feature_id: string;
  images_url: string | null;
  status: 'Active' | 'Inactive' | 'Seasonal';
  status_notes: string;
  company_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface OperatingHoursFromApi {
    id: number;
    capacity: number;
    monday_open: number;
    monday_open_time: string;
    monday_close_time: string;
    tuesday_open: number;
    tuesday_open_time: string;
    tuesday_close_time: string;
    wednesday_open: number;
    wednesday_open_time: string;
    wednesday_close_time: string;
    thursday_open: number;
    thursday_open_time: string;
    thursday_close_time: string;
    friday_open: number;
    friday_open_time: string;
    friday_close_time: string;
    saturday_open: number;
    saturday_open_time: string;
    saturday_close_time: string;
    sunday_open: number;
    sunday_open_time: string;
    sunday_close_time: string;
    company_id: string;
}


export interface UserFromApi {
    id: string;
    full_name: string;
    email: string;
    role: string;
    company_id: string;
    avatar_url: string | null;
    last_login: string | null;
    status: 'Active' | 'Inactive';
    created_at: string;
    updated_at: string;
}

export interface RoleFromApi {
    id: string;
    name: string;
    description: string;
    permissions: string;
    is_active: number;
    company_id: string;
    created_at: string;
    updated_at: string;
}

export interface EventFromApi {
  id: number;
  event_name: string;
  event_type: 'Corporate' | 'Private Party' | 'Wedding' | 'Conference';
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  hall_id: string; // Comma-separated hall IDs
  guest_count: number;
  booking_status: 'Confirmed' | 'Pending' | 'Cancelled';
  company_id: string | null;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  images_url: string | null;
}


/**
 * A helper function to handle the response from the fetch API.
 * It checks for errors and parses the JSON response.
 * @param response The Response object from a fetch call.
 * @returns A promise that resolves with the JSON data.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!response.ok) {
    // If the response is not ok, it might contain a server-side error message.
    // We throw this as an error to be caught by the calling function.
    throw new Error(`API request failed with status ${response.status}: ${text}`);
  }
  
  // Find the start of the actual JSON content
  const firstBracket = text.indexOf('[');
  const firstBrace = text.indexOf('{');
  
  let startIndex = -1;

  if (firstBracket === -1 && firstBrace === -1) {
    // Neither bracket nor brace found, response is likely empty or not JSON
    if (text.trim() === '') return {} as T;
    throw new Error(`Invalid JSON response: ${text}`);
  } else if (firstBracket === -1) {
    startIndex = firstBrace;
  } else if (firstBrace === -1) {
    startIndex = firstBracket;
  } else {
    startIndex = Math.min(firstBracket, firstBrace);
  }
  
  const jsonText = text.substring(startIndex);
  
  try {
    if (jsonText.trim() === '') {
      return {} as T;
    }
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to parse JSON:", jsonText);
    throw new Error("Invalid JSON response from server.");
  }
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
 * Fetches a single room type by its ID.
 * @param id The ID of the room type to fetch.
 * @returns A promise that resolves to a RoomTypeFromApi object.
 */
export async function getRoomTypeById(id: number): Promise<RoomTypeFromApi> {
  try {
    const response = await fetch(`${API_BASE_URL}/room-types/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<RoomTypeFromApi>(response);
  } catch (error) {
    console.error(`Failed to fetch room type ${id}:`, error);
    throw error;
  }
}

/**
 * Creates a new room type.
 * @param roomTypeData The data for the new room type.
 * @returns A promise that resolves with the newly created room type data.
 */
export async function createRoomType(roomTypeData: Omit<RoomTypeFromApi, 'id' | 'created_at' | 'updated_at'>): Promise<RoomTypeFromApi> {
    try {
        const response = await fetch(`${API_BASE_URL}/room-types`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomTypeData),
        });
        return handleResponse<RoomTypeFromApi>(response);
    } catch (error) {
        console.error('Failed to create room type:', error);
        throw error;
    }
}

/**
 * Updates an existing room type.
 * @param id The ID of the room type to update.
 * @param roomTypeData The new data for the room type.
 * @returns A promise that resolves with the updated room type data.
 */
export async function updateRoomType(id: number, roomTypeData: Partial<Omit<RoomTypeFromApi, 'id' | 'created_at' | 'updated_at'>>): Promise<RoomTypeFromApi> {
  try {
    const response = await fetch(`${API_BASE_URL}/room-types/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomTypeData),
    });
    return handleResponse<RoomTypeFromApi>(response);
  } catch (error) {
    console.error(`Failed to update room type ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a room type by its ID.
 * @param id The ID of the room type to delete.
 * @returns A promise that resolves with a success message.
 */
export async function deleteRoomType(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/room-types/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<{ message: string }>(response);
  } catch (error) {
    console.error(`Failed to delete room type ${id}:`, error);
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
 * Fetches a single amenity by its ID.
 * @param id The ID of the amenity to fetch.
 * @returns A promise that resolves to an AmenityFromApi object.
 */
export async function getAmenityById(id: number): Promise<AmenityFromApi> {
  try {
    const response = await fetch(`${API_BASE_URL}/amenities/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<AmenityFromApi>(response);
  } catch (error) {
    console.error(`Failed to fetch amenity ${id}:`, error);
    throw error;
  }
}

/**
 * Creates a new amenity.
 * @param amenityData The data for the new amenity.
 * @returns A promise that resolves with the newly created amenity data.
 */
export async function createAmenity(amenityData: Omit<AmenityFromApi, 'id' | 'created_at' | 'updated_at'>): Promise<AmenityFromApi> {
    try {
        const response = await fetch(`${API_BASE_URL}/amenities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(amenityData),
        });
        return handleResponse<AmenityFromApi>(response);
    } catch (error) {
        console.error('Failed to create amenity:', error);
        throw error;
    }
}

/**
 * Updates an existing amenity.
 * @param id The ID of the amenity to update.
 * @param amenityData The new data for the amenity.
 * @returns A promise that resolves with the updated amenity data.
 */
export async function updateAmenity(id: number, amenityData: Partial<Omit<AmenityFromApi, 'id' | 'created_at' | 'updated_at'>>): Promise<AmenityFromApi> {
  try {
    const response = await fetch(`${API_BASE_URL}/amenities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...amenityData, company_id: 'com-001' }),
    });
    return handleResponse<AmenityFromApi>(response);
  } catch (error) {
    console.error(`Failed to update amenity ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes an amenity by its ID.
 * @param id The ID of the amenity to delete.
 * @returns A promise that resolves with a success message.
 */
export async function deleteAmenity(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/amenities/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<{ message: string }>(response);
  } catch (error) {
    console.error(`Failed to delete amenity ${id}:`, error);
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
export async function createRoom(roomData: any): Promise<RoomFromApi> {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms`, {
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

/**
 * Uploads an image for a specific room.
 * @param roomId The ID of the room to associate the image with.
 * @param imageFile The image file to upload.
 * @param isPrimary Whether this image should be the primary one.
 * @returns A promise that resolves with the API response.
 */
export async function uploadRoomImage(roomId: number, imageFile: File, isPrimary: boolean): Promise<any> {
    const formData = new FormData();
    formData.append('room_id', String(roomId));
    formData.append('company_id', 'com-001'); // Example static company_id
    formData.append('image_name', imageFile.name);
    formData.append('image', imageFile);
    formData.append('file_size', String(imageFile.size));
    formData.append('alt_text', 'Room image');
    formData.append('is_primary', isPrimary ? '1' : '0');
    formData.append('display_order', '1');
    formData.append('uploaded_by', '1001'); // Example static user ID
    
    const response = await fetch(`${API_BASE_URL}/room-images`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse<any>(response);
}

/**
 * Fetches a single room by its ID.
 * @param roomId The ID of the room to fetch.
 * @returns A promise that resolves to a RoomFromApi object.
 */
export async function getRoomById(roomId: number): Promise<RoomFromApi> {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        return handleResponse<RoomFromApi>(response);
    } catch (error) {
        console.error(`Failed to fetch room ${roomId}:`, error);
        throw error;
    }
}

/**
 * Updates an existing room.
 * @param roomId The ID of the room to update.
 * @param roomData The data to update.
 * @returns A promise that resolves with the updated room data.
 */
export async function updateRoom(roomId: number, roomData: Partial<RoomFromApi>): Promise<RoomFromApi> {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomData),
        });
        return handleResponse<RoomFromApi>(response);
    } catch (error) {
        console.error(`Failed to update room ${roomId}:`, error);
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
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
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

// Customer API functions
export async function getCustomers(): Promise<CustomerFromApi[]> {
    const response = await fetch(`${API_BASE_URL}/customers`);
    return handleResponse<CustomerFromApi[]>(response);
}

export async function getCustomerById(id: number): Promise<CustomerFromApi> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`);
    return handleResponse<CustomerFromApi>(response);
}

export async function createCustomer(customerData: Omit<CustomerFromApi, 'id' | 'created_at' | 'updated_at'>): Promise<CustomerFromApi> {
    const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
    });
    return handleResponse<CustomerFromApi>(response);
}

export async function updateCustomer(id: number, customerData: Partial<Omit<CustomerFromApi, 'id' | 'created_at' | 'updated_at'>>): Promise<CustomerFromApi> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
    });
    return handleResponse<CustomerFromApi>(response);
}

export async function deleteCustomer(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
}

// Booking API Functions
export async function getBookings(): Promise<BookingFromApi[]> {
  const response = await fetch(`${API_BASE_URL}/room-bookings`);
  return handleResponse<BookingFromApi[]>(response);
}

export async function getBookingById(id: number): Promise<BookingFromApi> {
    const response = await fetch(`${API_BASE_URL}/room-bookings/${id}`);
    return handleResponse<BookingFromApi>(response);
}

export async function createBooking(bookingData: any): Promise<BookingFromApi> {
    const response = await fetch(`${API_BASE_URL}/room-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
    });
    return handleResponse<BookingFromApi>(response);
}

export async function updateBooking(id: number, bookingData: Partial<BookingFromApi>): Promise<BookingFromApi> {
    const response = await fetch(`${API_BASE_URL}/room-bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
    });
    return handleResponse<BookingFromApi>(response);
}

export async function deleteBookingById(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/room-bookings/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
}

// Restaurant Features API
export async function getRestaurantFeatures(): Promise<RestaurantFeatureFromApi[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant-features`);
    return handleResponse<RestaurantFeatureFromApi[]>(response);
  } catch (error) {
    console.error('Failed to fetch restaurant features:', error);
    throw error;
  }
}

export async function getRestaurantFeatureById(id: number): Promise<RestaurantFeatureFromApi> {
  const response = await fetch(`${API_BASE_URL}/features/${id}`);
  return handleResponse<RestaurantFeatureFromApi>(response);
}

export async function createRestaurantFeature(featureData: Omit<RestaurantFeatureFromApi, 'id' | 'created_at' | 'updated_at'>): Promise<RestaurantFeatureFromApi> {
  const response = await fetch(`${API_BASE_URL}/features`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(featureData),
  });
  return handleResponse<RestaurantFeatureFromApi>(response);
}

export async function updateRestaurantFeature(id: number, featureData: Partial<Omit<RestaurantFeatureFromApi, 'id' | 'created_at' | 'updated_at' | 'feature_id'>>): Promise<RestaurantFeatureFromApi> {
  const response = await fetch(`${API_BASE_URL}/features/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(featureData),
  });
  return handleResponse<RestaurantFeatureFromApi>(response);
}

export async function deleteRestaurantFeature(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/features/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<{ message: string }>(response);
}

// Experiences API Functions
export async function getExperiences(): Promise<ExperienceFromApi[]> {
  const response = await fetch(`${API_BASE_URL}/experiences`);
  return handleResponse<ExperienceFromApi[]>(response);
}

export async function getExperienceById(id: number): Promise<ExperienceFromApi> {
    const response = await fetch(`${API_BASE_URL}/experiences/${id}`);
    return handleResponse<ExperienceFromApi>(response);
}

export async function createExperience(experienceData: any): Promise<ExperienceFromApi> {
  const response = await fetch(`${API_BASE_URL}/experiences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(experienceData),
  });
  return handleResponse<ExperienceFromApi>(response);
}

export async function updateExperience(id: number, experienceData: Partial<ExperienceFromApi>): Promise<ExperienceFromApi> {
    const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experienceData),
    });
    return handleResponse<ExperienceFromApi>(response);
}

export async function deleteExperience(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/experiences/${id}?cascade=true`, {
        method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
}

export async function uploadExperienceImage(experienceId: number, imageFile: File): Promise<any> {
    const formData = new FormData();
    formData.append('experience_id', String(experienceId));
    formData.append('image', imageFile);
    formData.append('company_id', 'com-001');
    formData.append('is_primary', '1');
    formData.append('uploaded_by', 'admin_user');
    formData.append('alt_text', 'Experience Image');
    formData.append('display_order', '1');

    const response = await fetch(`${API_BASE_URL}/experience-images`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse<any>(response);
}

export async function getExperienceImages(companyId: string, experienceId: number): Promise<ExperienceImageFromApi[]> {
  const response = await fetch(`${API_BASE_URL}/experience-images/company/${companyId}/experience/${experienceId}`);
  return handleResponse<ExperienceImageFromApi[]>(response);
}



// Hall API Functions
export async function getHalls(): Promise<HallFromApi[]> {
  const response = await fetch(`${API_BASE_URL}/hallbookings`);
  return handleResponse<HallFromApi[]>(response);
}

export async function getHallById(id: number): Promise<HallFromApi> {
    const response = await fetch(`${API_BASE_URL}/hallbookings/${id}`);
    return handleResponse<HallFromApi>(response);
}

export async function createHall(hallData: any): Promise<HallFromApi> {
    const response = await fetch(`${API_BASE_URL}/hallbookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hallData),
    });
    return handleResponse<HallFromApi>(response);
}

export async function updateHall(id: number, hallData: Partial<HallFromApi>): Promise<HallFromApi> {
    const response = await fetch(`${API_BASE_URL}/hallbookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hallData),
    });
    return handleResponse<HallFromApi>(response);
}

export async function deleteHall(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/hallbookings/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
}

// Package Inclusions API
export async function getPackageInclusions(): Promise<PackageInclusionFromApi[]> {
  const response = await fetch(`${API_BASE_URL}/package-inclusions`, { cache: 'no-store' });
  return handleResponse<PackageInclusionFromApi[]>(response);
}

export async function getPackageInclusionById(id: number): Promise<PackageInclusionFromApi> {
  const response = await fetch(`${API_BASE_URL}/package-inclusions/${id}`, { cache: 'no-store' });
  return handleResponse<PackageInclusionFromApi>(response);
}

export async function createPackageInclusion(data: Omit<PackageInclusionFromApi, 'id' | 'created_at' | 'updated_at'>): Promise<PackageInclusionFromApi> {
  const response = await fetch(`${API_BASE_URL}/package-inclusions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<PackageInclusionFromApi>(response);
}

export async function updatePackageInclusion(id: number, data: Partial<Omit<PackageInclusionFromApi, 'id' | 'created_at' | 'updated_at'>>): Promise<PackageInclusionFromApi> {
  const response = await fetch(`${API_BASE_URL}/package-inclusions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<PackageInclusionFromApi>(response);
}

export async function deletePackageInclusion(id: number): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/package-inclusions/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<{ message: string }>(response);
}

// Wedding Packages API
export async function getWeddingPackages(): Promise<WeddingPackageFromApi[]> {
    const response = await fetch(`${API_BASE_URL}/weddingpackages`);
    return handleResponse<WeddingPackageFromApi[]>(response);
}

export async function getWeddingPackageById(id: number): Promise<WeddingPackageFromApi> {
    const response = await fetch(`${API_BASE_URL}/weddingpackages/${id}`);
    return handleResponse<WeddingPackageFromApi>(response);
}

export async function createWeddingPackage(data: any): Promise<WeddingPackageFromApi> {
    const response = await fetch(`${API_BASE_URL}/weddingpackages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<WeddingPackageFromApi>(response);
}

export async function uploadWeddingPackageImage(weddingId: number, imageFile: File, isPrimary: boolean): Promise<any> {
    const formData = new FormData();
    formData.append('wedding_id', String(weddingId));
    formData.append('company_id', '201'); // Example static company_id
    formData.append('image_name', imageFile.name);
    formData.append('image', imageFile);
    formData.append('file_size', String(imageFile.size));
    formData.append('alt_text', 'Wedding package image');
    formData.append('is_primary', isPrimary ? '1' : '0');
    formData.append('display_order', '1');
    formData.append('uploaded_by', '3'); // Example static user ID
    
    const response = await fetch(`${API_BASE_URL}/wedding-images`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse<any>(response);
}


export async function updateWeddingPackage(id: number, data: any): Promise<WeddingPackageFromApi> {
    const response = await fetch(`${API_BASE_URL}/weddingpackages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<WeddingPackageFromApi>(response);
}

export async function deleteWeddingPackage(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/weddingpackages/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
}

// Restaurant Venues API
export async function getRestaurants(): Promise<RestaurantFromApi[]> {
  const response = await fetch(`${API_BASE_URL}/restaurant`);
  const data = await handleResponse<RestaurantFromApi[]>(response);
  return Array.isArray(data) ? data : [];
}

export async function getRestaurantById(id: number): Promise<RestaurantFromApi> {
    const response = await fetch(`${API_BASE_URL}/restaurant/${id}`);
    return handleResponse<RestaurantFromApi>(response);
}

export async function createRestaurant(restaurantData: any): Promise<RestaurantFromApi> {
    const response = await fetch(`${API_BASE_URL}/restaurant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurantData),
    });
    return handleResponse<RestaurantFromApi>(response);
}

export async function uploadRestaurantImage(restaurantId: number, imageFile: File, isPrimary: boolean): Promise<any> {
    const formData = new FormData();
    formData.append('restaurant_id', String(restaurantId));
    formData.append('company_id', '101');
    formData.append('image_name', imageFile.name);
    formData.append('image', imageFile);
    formData.append('file_size', String(imageFile.size));
    formData.append('alt_text', 'Restaurant view');
    formData.append('is_primary', isPrimary ? '1' : '0');
    formData.append('display_order', '1');
    formData.append('uploaded_by', '5');
    formData.append('updated_by', '5');
    formData.append('is_active', '1');
    
    const response = await fetch(`${API_BASE_URL}/restaurant-images`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse<any>(response);
}

export async function updateRestaurant(id: number, restaurantData: Partial<RestaurantFromApi>): Promise<RestaurantFromApi> {
    const response = await fetch(`${API_BASE_URL}/restaurant/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurantData),
    });
    return handleResponse<RestaurantFromApi>(response);
}

export async function deleteRestaurant(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/restaurant/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
}

// User Management API Functions
export async function getUsers(): Promise<UserFromApi[]> {
    const response = await fetch(`${API_BASE_URL}/user`);
    return handleResponse<UserFromApi[]>(response);
}

export async function getUserById(id: string): Promise<UserFromApi> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`);
    return handleResponse<UserFromApi>(response);
}

export async function createUser(userData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse<any>(response);
}

export async function uploadUserImage(userId: string, imageFile: File): Promise<any> {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('company_id', '1'); // Example static company_id
    formData.append('image', imageFile);
    formData.append('image_name', imageFile.name);
    formData.append('file_size', String(imageFile.size));
    formData.append('alt_text', 'User profile picture');
    formData.append('is_primary', '1');
    formData.append('display_order', '1');
    formData.append('uploaded_by', 'admin_user'); // Or dynamically set
    formData.append('updated_by', 'admin_user');
    formData.append('is_active', '1');

    const response = await fetch(`${API_BASE_URL}/user-images`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse<any>(response);
}


export async function updateUser(id: string, userData: Partial<UserFromApi>): Promise<UserFromApi> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse<UserFromApi>(response);
}

export async function deleteUser(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
}

// Role Management API Functions
export async function getRoles(): Promise<RoleFromApi[]> {
    const response = await fetch(`${API_BASE_URL}/role`);
    return handleResponse<RoleFromApi[]>(response);
}

export async function getRoleById(id: string): Promise<RoleFromApi> {
    const response = await fetch(`${API_BASE_URL}/role/${id}`);
    return handleResponse<RoleFromApi>(response);
}

export async function createRole(roleData: any): Promise<RoleFromApi> {
    const response = await fetch(`${API_BASE_URL}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData),
    });
    return handleResponse<RoleFromApi>(response);
}

export async function updateRole(id: string, roleData: Partial<RoleFromApi>): Promise<RoleFromApi> {
    const response = await fetch(`${API_BASE_URL}/role/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData),
    });
    return handleResponse<RoleFromApi>(response);
}

export async function deleteRole(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/role/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
}

// Operating Hours API Functions
export async function getOperatingHoursById(id: string): Promise<OperatingHoursFromApi> {
  const response = await fetch(`${API_BASE_URL}/operating-hours/${id}`);
  return handleResponse<OperatingHoursFromApi>(response);
}

export async function createOperatingHours(hoursData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/operating-hours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hoursData),
    });
    return handleResponse<any>(response);
}

export async function updateOperatingHours(id: string, hoursData: any): Promise<OperatingHoursFromApi> {
    const response = await fetch(`${API_BASE_URL}/operating-hours/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hoursData),
    });
    return handleResponse<OperatingHoursFromApi>(response);
}

// Event API Functions
export async function getEvents(): Promise<EventFromApi[]> {
  const response = await fetch(`${API_BASE_URL}/events`);
  return handleResponse<EventFromApi[]>(response);
}

export async function getEventById(id: number): Promise<EventFromApi> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return handleResponse<EventFromApi>(response);
}

export async function createEvent(eventData: any): Promise<EventFromApi> {
    const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
    });
    return handleResponse<EventFromApi>(response);
}

export async function updateEvent(id: number, eventData: Partial<EventFromApi>): Promise<EventFromApi> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
    });
    return handleResponse<EventFromApi>(response);
}

export async function deleteEvent(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
}

export async function uploadEventImage(eventId: number, imageFile: File, isPrimary: boolean): Promise<any> {
    const formData = new FormData();
    formData.append('event_id', String(eventId));
    formData.append('image', imageFile);
    formData.append('company_id', 'com-001');
    formData.append('is_primary', isPrimary ? '1' : '0');
    formData.append('uploaded_by', 'admin_user');
    formData.append('alt_text', 'Event Image');
    formData.append('display_order', '1');
    formData.append('image_name', imageFile.name);
    formData.append('file_size', String(imageFile.size));

    const response = await fetch(`${API_BASE_URL}/event-images`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse<any>(response);
}
    

    








