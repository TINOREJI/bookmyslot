import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  // Calculate total booking capacity for the event
  const totalCapacity = event.slots.reduce(
    (sum, slot) => sum + slot.max_bookings,
    0
  );
  const availableBookings = event.available_slots;

  // Calculate booking percentage
  const bookingPercentage = totalCapacity > 0
    ? Math.round(((totalCapacity - availableBookings) / totalCapacity) * 100)
    : 0;

  // --- Date & Time Logic for Closing Event ---
  const now = new Date();

  // Check if all slots are in the past
  const isPastEvent = event.slots.length > 0 && event.slots.every(slot => {
    // Parse start_time as UTC to avoid timezone issues
    const slotTime = new Date(slot.start_time + (slot.start_time.endsWith('Z') ? '' : 'Z'));
    return slotTime.getTime() < now.getTime();
  });

  // Get earliest slot time for display
  const earliestSlotTime = event.slots.length > 0
    ? new Date(
        Math.min(
          ...event.slots.map(slot =>
            new Date(slot.start_time + (slot.start_time.endsWith('Z') ? '' : 'Z')).getTime()
          )
        )
      )
    : null;

  const isFullyBooked = availableBookings === 0;
  const isDisabled = isFullyBooked || isPastEvent;

  return (
    <div
      className="relative h-full flex flex-col bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
      aria-labelledby={`event-title-${event.id}`}
    >
      {/* Overlay if event is closed */}
      {isPastEvent && (
        <div className="absolute inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-10">
          <span className="text-xl text-white font-bold">Event Closed</span>
        </div>
      )}

      {/* Header */}
      <div className={`p-6 flex-1 ${isPastEvent ? 'opacity-60' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <span
            className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold
            ${isFullyBooked ? 'bg-red-100 text-red-800' : isPastEvent ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-800'}`}
          >
            {isPastEvent ? 'Closed' : isFullyBooked ? 'Full' : 'Open'}
          </span>
          <span className="text-xs text-gray-400">
            {earliestSlotTime
              ? earliestSlotTime.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
              : 'No slots available'}
          </span>
        </div>
        <h3
          id={`event-title-${event.id}`}
          className="text-xl font-bold text-gray-900 mb-2 line-clamp-1"
        >
          {event.title}
        </h3>
        <p className="text-gray-600 line-clamp-2 mb-4">
          {event.description || 'No description available'}
        </p>

        {/* Availability Section */}
        <div className="mb-2">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Availability</span>
            <span>
              <span className={isFullyBooked ? 'text-red-600 font-bold' : 'text-green-700 font-bold'}>
                {availableBookings}
              </span>
              <span> / {totalCapacity} bookings</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                bookingPercentage < 70
                  ? 'bg-green-500'
                  : bookingPercentage < 90
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${bookingPercentage}%` }}
              aria-label={`${bookingPercentage}% booked`}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer Part of Card */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {event.slots.length} slot{event.slots.length !== 1 ? 's' : ''}
        </div>
        {isDisabled ? (
          <button
            className="flex items-center justify-center px-4 py-2.5 border border-transparent text-base font-medium rounded-md text-gray-500 bg-gray-200 cursor-not-allowed"
            disabled
            aria-label={isPastEvent ? 'Event Closed' : 'No available bookings'}
          >
            {isPastEvent ? 'Event Closed' : 'Fully Booked'}
          </button>
        ) : (
          <Link
            to={`/events/${event.id}`}
            className="flex items-center justify-center px-4 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            aria-label={`View details for ${event.title}`}
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default EventCard;
