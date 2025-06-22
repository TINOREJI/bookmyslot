import { useState, useMemo } from "react";
import { createEvent } from "../api/events";
import { useNavigate } from "react-router-dom";

function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slots, setSlots] = useState([{ start_time: "", max_bookings: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get current datetime in local format (YYYY-MM-DDTHH:mm)
  const minDateTime = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, []);

  const handleSlotChange = (idx, field, value) => {
    setSlots(slots =>
      slots.map((slot, i) =>
        i === idx ? { ...slot, [field]: value } : slot
      )
    );
  };

  const addSlot = () => {
    setSlots([...slots, { start_time: "", max_bookings: 1 }]);
  };

  const removeSlot = idx => {
    setSlots(slots => slots.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Validate slot times
      const now = new Date();
      for (const slot of slots) {
        const slotTime = new Date(slot.start_time);
        if (slotTime < now) {
          throw new Error("Cannot create event with past time slots");
        }
      }

      await createEvent({
        title,
        description,
        slots: slots.map(s => ({
          start_time: new Date(s.start_time).toISOString(),
          max_bookings: Number(s.max_bookings)
        }))
      });
      navigate("/"); // Go to home page after creation
    } catch (err) {
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
          Create New Event
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Schedule Your Event
        </h1>
        <p className="text-lg text-gray-600">
          Set up time slots for people to book and join your event
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event Info Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Event Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  placeholder="Team Meeting, Workshop, etc."
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y min-h-[120px]"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your event, include any important details attendees should know..."
                />
              </div>
            </div>
          </div>

          {/* Time Slots Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Time Slots
            </h2>
            
            <div className="space-y-4">
              {slots.map((slot, idx) => (
                <div 
                  key={idx} 
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_auto] gap-4 items-center">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={slot.start_time}
                        onChange={e => handleSlotChange(idx, "start_time", e.target.value)}
                        min={minDateTime}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Bookings
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={slot.max_bookings}
                        onChange={e => handleSlotChange(idx, "max_bookings", e.target.value)}
                        required
                      />
                    </div>
                    
                    {slots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlot(idx)}
                        className="self-end text-red-600 hover:text-red-800 font-medium text-sm transition-colors flex flex-col items-center mt-6"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addSlot}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Time Slot
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none transition-colors font-medium"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
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
                    Creating Event...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Event
                  </span>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-lg">
              <p className="font-medium">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateEventPage;
