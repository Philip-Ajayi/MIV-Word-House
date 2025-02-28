import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EventPage = () => {
  // State for events loaded from the API
  const [events, setEvents] = useState([]);
  // State for a selected date filter
  const [selectedDate, setSelectedDate] = useState(null);
  // Toggle for showing/hiding the calendar filter
  const [showCalendar, setShowCalendar] = useState(false);
  // Loading state while fetching data
  const [loading, setLoading] = useState(true);
  // State for modal image URL
  const [modalImage, setModalImage] = useState(null);

  // Helper: Convert a Date into a YYYY-MM-DD string according to UTC+1
  const formatUTCPlusOne = (date) => {
    // Get the UTC time (in ms) then add the offset for +1 hour (3600000 ms)
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const offsetTime = utcTime + 3600000;
    const offsetDate = new Date(offsetTime);
    const year = offsetDate.getUTCFullYear();
    const month = String(offsetDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(offsetDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch events from your API when the component mounts
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/event/events'); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Filter events based on the selected date (if any) in UTC+1
  const filteredEvents = selectedDate
    ? events.filter((event) => {
        // For each event, get start and end dates as strings (YYYY-MM-DD) in UTC+1
        const eventStart = formatUTCPlusOne(new Date(event.startDate));
        const eventEnd = formatUTCPlusOne(new Date(event.endDate ? event.endDate : event.startDate));
        const selectedStr = formatUTCPlusOne(new Date(selectedDate));
        return selectedStr >= eventStart && selectedStr <= eventEnd;
      })
    : events;

  // Use tileClassName to add a custom class to tiles that fall within an event's date range (UTC+1)
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const tileDateStr = formatUTCPlusOne(date);
      const isEventDate = events.some((event) => {
        const eventStart = formatUTCPlusOne(new Date(event.startDate));
        const eventEnd = formatUTCPlusOne(new Date(event.endDate ? event.endDate : event.startDate));
        return tileDateStr >= eventStart && tileDateStr <= eventEnd;
      });
      return isEventDate ? 'event-tile' : null;
    }
  };

  return (
    <div className="min-h-screen container mx-auto p-6 bg-white">
      {/* Custom CSS to create a deep, circled background around the date */}
      <style>{`
        /* Ensure the calendar tile is positioned relative */
        .react-calendar__tile.event-tile {
          position: relative;
        }
        /* Style the abbr element (which holds the day number) with a deep blue circle */
        .react-calendar__tile.event-tile abbr {
          background-color: rgba(30, 64, 175, 0.8);
          color: #fff;
          border-radius: 9999px;
          padding: 0.5rem;
          display: inline-block;
          width: 2rem;
          height: 2rem;
          line-height: 2rem;
          text-align: center;
        }
      `}</style>

      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 sm:mb-0">
          Events
        </h1>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition duration-300 focus:outline-none"
        >
          {showCalendar ? 'Close Calendar' : 'Filter by Date'}
        </button>
      </header>

      {/* Calendar Filter Section */}
      {showCalendar && (
        <div className="p-4 bg-gray-50 rounded-xl shadow-sm mb-8">
          <Calendar
            onChange={(date) => setSelectedDate(date)}
            value={selectedDate}
            tileClassName={tileClassName}
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="mt-2 text-blue-500 underline focus:outline-none"
            >
              Clear Date Filter
            </button>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-600">Loading events...</p>}

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <motion.div
            key={event._id || event.id}
            className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-56 object-contain cursor-pointer"
                onClick={() => setModalImage(event.image)}
              />
            )}
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 mb-1">{event.venue}</p>
              <p className="text-gray-600 mb-1">
                {new Date(event.startDate).toLocaleDateString('en-GB', {
                  timeZone: 'Europe/Paris',
                })}
                {event.endDate && (
                  <> - {new Date(event.endDate).toLocaleDateString('en-GB', {
                    timeZone: 'Europe/Paris',
                  })}</>
                )}
              </p>
              <p className="text-gray-600 mb-3">{event.time}</p>
              <p className="text-gray-700 mb-4 flex-grow">{event.description}</p>
              <div className="flex items-center space-x-4">
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline font-medium"
                  >
                    Register
                  </a>
                )}
                {event.televised && event.televisedLink && (
                  <a
                    href={event.televisedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 underline font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8m-8 4h8m-8 4h8"
                      />
                    </svg>
                    Livestream
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Enlarged Image */}
      {modalImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setModalImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImage}
              alt="Enlarged view"
              className="max-h-screen max-w-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-gray-300 focus:outline-none"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;
