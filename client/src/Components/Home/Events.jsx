import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: Format a date string to a locale string for UTC+1 using the Europe/Paris time zone.
  const formatUTCPlusOne = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-GB', { timeZone: 'Europe/Paris' });

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/event/events'); // Adjust as needed
        if (!response.ok) throw new Error('Failed to fetch events');
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

  // Group events into slices using a pattern [3, 4, 3]
  const pattern = [3, 4, 3];
  const slices = [];
  let startIndex = 0;
  let patternIndex = 0;
  while (startIndex < events.length) {
    const currentSliceSize = pattern[patternIndex % pattern.length];
    slices.push(events.slice(startIndex, startIndex + currentSliceSize));
    startIndex += currentSliceSize;
    patternIndex++;
  }

  return (
    <section className="w-full bg-purple-200 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-900">Upcoming Events</h2>
          <a
            href="/events"
            className="mt-2 sm:mt-0 inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-200"
          >
            See More
          </a>
        </div>

        {loading && <p>Loading events...</p>}

        {/* Events Grid */}
        {!loading &&
          slices.map((group, index) => {
            const gridColsClass =
              group.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
            return (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-6 mb-6`}
              >
                {group.map((event) => (
                  <motion.div
                    key={event._id || event.id}
                    className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-56 object-contain"
                      />
                    )}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold mb-2 text-purple-900">
                        {event.title}
                      </h3>
                      <p className="text-purple-800 mb-1">{event.venue}</p>
                      <p className="text-purple-800 mb-1">
                        {formatUTCPlusOne(event.startDate)}
                        {event.endDate &&
                          ` - ${formatUTCPlusOne(event.endDate)}`}
                      </p>
                      <p className="text-purple-800 mb-2">{event.time}</p>
                      <p className="text-purple-700 mb-4 flex-grow">
                        {event.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        {event.registrationLink && (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 underline"
                          >
                            Register
                          </a>
                        )}
                        {event.televised && event.televisedLink && (
                          <a
                            href={event.televisedLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-purple-600 underline"
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
                            Watch Live
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default EventSection;
