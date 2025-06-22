import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../api/events';
import EventCard from '../components/EventCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchEvents()
      .then(setEvents)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Discover Amazing Events
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
          Find and book your next unforgettable experience
        </p>
      </header>


      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-xl p-8 max-w-2xl mx-auto text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-colors duration-200 font-medium"
            aria-label="Retry loading events"
          >
            Try Again
          </button>
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Be the first to create an exciting event!"
          ctaText="Create Event"
          ctaLink="/create-event"
        />
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
