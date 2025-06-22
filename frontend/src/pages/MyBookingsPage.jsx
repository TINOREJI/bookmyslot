import { useState } from 'react';
import { fetchUserBookings } from '../api/bookings';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await fetchUserBookings(email);
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return 'Time not available';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          My Bookings
        </h1>
        <p className="mt-3 max-w-md mx-auto text-gray-600 text-lg">
          Enter your email to view all your booked events
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-4xl mx-auto">
        <div className="p-6 sm:p-8">
          <form onSubmit={handleEmailSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed whitespace-nowrap"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'View Bookings'
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {bookings.length === 0 && !error && !loading ? (
            <div className="text-center py-10">
              <div className="mx-auto flex justify-center text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">You haven't booked any events yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div 
                  key={booking.id}
                  className="p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 truncate">
                        {booking.event_title || 'Event Title'}
                      </h3>
                      <p className="mt-1 text-gray-600 line-clamp-2">
                        {booking.event_description || 'Event description not available'}
                      </p>
                      
                      <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {formatDate(booking.slot_start_time)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            {formatTime(booking.slot_start_time)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ml-4">
                      Booked
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Booked on:</span>{' '}
                      {new Date(booking.booked_at).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>
                    
                    <div className="text-sm text-gray-900 font-medium">
                      {booking.user_name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
