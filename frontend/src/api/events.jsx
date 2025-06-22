const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Fetch all events from the backend.
 * @returns {Promise<Array>} List of events.
 * @throws {Error} If the request fails.
 */
export const fetchEvents = async () => {
  const response = await fetch(`${API_URL}/events/`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to fetch events');
  }
  return response.json();
};

/**
 * Fetch details for a specific event by ID.
 * @param {string} eventId - The UUID of the event.
 * @returns {Promise<Object>} Event details.
 * @throws {Error} If the event is not found.
 */
export const fetchEventDetails = async (eventId) => {
  const response = await fetch(`${API_URL}/events/${eventId}`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Event not found');
  }
  return response.json();
};

/**
 * Create a new event with time slots.
 * @param {Object} eventData - Event data including title, description, and slots.
 * @returns {Promise<Object>} Created event details.
 * @throws {Error} If the creation fails.
 */
export const createEvent = async (eventData) => {
  const response = await fetch(`${API_URL}/events/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to create event');
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
