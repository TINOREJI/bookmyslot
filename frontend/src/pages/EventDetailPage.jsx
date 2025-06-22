import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventDetails } from '../api/events';
import { createBookingForEvent } from '../api/bookings';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    slot_id: '',
    user_name: '',
    user_email: '',
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await fetchEventDetails(eventId);
        setEvent(data);
        if (data.slots.length > 0) {
          setBookingData(prev => ({ ...prev, slot_id: data.slots[0].id }));
        }
      } catch (err) {
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');
    try {
      await createBookingForEvent(eventId, bookingData);
      setBookingSuccess('Booking created successfully!');
      setBookingData({ slot_id: event?.slots[0]?.id || '', user_name: '', user_email: '' });
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (err) {
      setBookingError(err.message || 'Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        <p className="mt-4 text-gray-600 text-lg">Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 rounded-xl p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Event Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Event Details
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {event.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {event.description || 'No description available'}
            </p>
            <div className="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                Created: {new Date(event.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 self-start">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {event.slots.length}
              </div>
              <div className="text-sm text-gray-600">
                Time Slot{event.slots.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Slots Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Time Slots</h2>
          <div className="text-sm text-gray-500">
            Select one to book
          </div>
        </div>

        {event.slots.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-800">No time slots available for this event.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.slots.map(slot => {
              const available = slot.max_bookings - slot.current_bookings;
              const isFullyBooked = available === 0;
              const bookingPercentage = Math.round((slot.current_bookings / slot.max_bookings) * 100);
              
              return (
                <div 
                  key={slot.id}
                  className={`border rounded-xl p-5 transition-all ${
                    bookingData.slot_id === slot.id 
                      ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  } ${isFullyBooked ? 'opacity-70' : 'cursor-pointer'}`}
                  onClick={() => !isFullyBooked && setBookingData({...bookingData, slot_id: slot.id})}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {new Date(slot.start_time).toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-gray-600 mb-3">
                        {new Date(slot.start_time).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    {isFullyBooked && (
                      <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                        FULL
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Availability</span>
                      <span className="font-medium">
                        {available}/{slot.max_bookings}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          bookingPercentage < 70 ? 'bg-green-500' : bookingPercentage < 90 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${bookingPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h2>
        
        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                id="user_name"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={bookingData.user_name}
                onChange={e => setBookingData({ ...bookingData, user_name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                id="user_email"
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={bookingData.user_email}
                onChange={e => setBookingData({ ...bookingData, user_email: e.target.value })}
                required
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none transition-colors font-medium"
              >
                Back to Events
              </button>
              
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!bookingData.slot_id}
              >
                {bookingSuccess ? (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Booked Successfully!
                  </span>
                ) : (
                  `Book Now ${bookingData.slot_id ? '' : ' (Select a slot)'}`
                )}
              </button>
            </div>
          </div>
          
          {bookingError && (
            <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-lg">
              <p className="font-medium">{bookingError}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EventDetailsPage;
