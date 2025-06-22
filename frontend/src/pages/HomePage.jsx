import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../api/events';
import EventCard from '../components/EventCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('earliest');
  const [hideClosed, setHideClosed] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
        applyFiltersAndSort(data, searchQuery, sortOption, hideClosed);
      } catch (err) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);

  useEffect(() => {
    applyFiltersAndSort(events, searchQuery, sortOption, hideClosed);
  }, [searchQuery, sortOption, hideClosed, events]);

  const applyFiltersAndSort = (eventsData, query, sort, hide) => {
    let filtered = [...eventsData];

    // Filter by search query (title only, case-insensitive)
    if (query) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter out closed events if hideClosed is true
    if (hide) {
      const now = new Date();
      filtered = filtered.filter(event =>
        event.slots.length > 0 &&
        event.slots.some(slot => {
          const slotTime = new Date(slot.start_time + (slot.start_time.endsWith('Z') ? '' : 'Z'));
          return slotTime.getTime() >= now.getTime();
        })
      );
    }

    // Sort by earliest or latest slot start_time
    filtered.sort((a, b) => {
      // Get earliest or latest slot time for each event
      const getSlotTime = (event, useLatest) => {
        if (event.slots.length === 0) return Infinity; // Push events with no slots to end
        const slotTimes = event.slots.map(slot =>
          new Date(slot.start_time + (slot.start_time.endsWith('Z') ? '' : 'Z')).getTime()
        );
        return useLatest ? Math.max(...slotTimes) : Math.min(...slotTimes);
      };

      const timeA = getSlotTime(a, sort === 'latest');
      const timeB = getSlotTime(b, sort === 'latest');

      return sort === 'earliest' ? timeA - timeB : timeB - timeA;
    });

    setFilteredEvents(filtered);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchEvents()
      .then(data => {
        setEvents(data);
        applyFiltersAndSort(data, searchQuery, sortOption, hideClosed);
      })
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

      {/* Search, Sort, and Filter Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search events by title..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search events by title"
          />
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
              Sort by:
            </label>
            <select
              id="sort"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              aria-label="Sort events by date"
            >
              <option value="earliest">Earliest First</option>
              <option value="latest">Latest First</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              id="hide-closed"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={hideClosed}
              onChange={e => setHideClosed(e.target.checked)}
              aria-label="Hide closed events"
            />
            <label htmlFor="hide-closed" className="ml-2 text-sm font-medium text-gray-700">
              Hide Closed Events
            </label>
          </div>
        </div>
      </div>

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
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Be the first to create an exciting event!"
          ctaText="Create Event"
          ctaLink="/create-event"
        />
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
