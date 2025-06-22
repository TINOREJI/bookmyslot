const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Create a booking for a time slot.
 * @param {Object} bookingData - Booking data including slot_id, user_name, user_email.
 * @returns {Promise<Object>} Created booking details.
 * @throws {Error} If the booking fails.
 */
export const createBooking = async (bookingData) => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to create booking');
  }
  return response.json();
};

/**
 * Create a booking for a specific event's time slot.
 * @param {string} eventId - The UUID of the event.
 * @param {Object} bookingData - Booking data including slot_id, user_name, user_email.
 * @returns {Promise<Object>} Created booking details.
 * @throws {Error} If the booking fails.
 */
export const createBookingForEvent = async (eventId, bookingData) => {
  const response = await fetch(`${API_URL}/events/${eventId}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to create booking');
  }
  return response.json();
};

/**
 * Fetch all bookings for a user by email.
 * @param {string} email - The user's email address.
 * @returns {Promise<Array>} List of user bookings.
 * @throws {Error} If no bookings are found or the request fails.
 */
export const fetchUserBookings = async (email) => {
  const response = await fetch(`${API_URL}/bookings/users/${email}/bookings`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to fetch bookings');
  }
  return response.json();
};

/**
 * Fetch all bookings (for debugging).
 * @returns {Promise<Array>} List of all bookings.
 * @throws {Error} If the request fails.
 */
export const fetchAllBookings = async () => {
  const response = await fetch(`${API_URL}/bookings/all`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to fetch all bookings');
  }
  return response.json();
};
