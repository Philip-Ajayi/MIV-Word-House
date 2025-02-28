import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import heroImage from '../../assets/shift.jpeg';

const Shiftings = () => {
  // Example event data (update these values as needed)
  const eventDate = new Date('2025-01-01T18:00:00');
  const eventVenue = 'Virtual Gathering Hall';
  const registrationLink = 'https://example.com/register'; // or null
  const televisedUrl = 'https://example.com/watch-live'; // or null

  // Helper function to compute the time left until event
  const getTimeLeft = () => {
    const now = new Date();
    const diff = eventDate - now;
    if (diff <= 0) return null;
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds, total: diff };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  // Update the countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      const t = getTimeLeft();
      setTimeLeft(t);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Only display the event session if an eventDate exists and it hasn't passed more than 15 hours
  const now = new Date();
  const displayEvent =
    eventDate &&
    now < new Date(eventDate.getTime() + 15 * 60 * 60 * 1000) &&
    timeLeft;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Hero Section */}
      <section
        className="w-full bg-cover bg-center h-[500px] md:h-[700px]"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="bg-black bg-opacity-50 w-full h-full flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-bold text-white text-center"
          >
            Shiftings and Turnings
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-2xl md:text-3xl text-white mt-4 text-center"
          >
            Praying Through, Breaking Through
          </motion.h2>
        </div>
      </section>

      {/* Text Section: Life Is Spiritual */}
      <section className="w-full py-16 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 md:px-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Life Is Spiritual</h2>
          </div>
          <div>
            <p className="mt-4 text-lg md:text-xl">
              Shiftings &amp; Turnings is a monthly virtual prayer gathering conducted by our church.
              In recognition of the shifting seasons of life and the need for God's guidance and intervention,
              we come together as an online faith community. Through the power of technology, we connect from
              different locations to seek God's wisdom and surrender our worries, fears, and desires to Him.
              During Shiftings and Turnings, we believe in the transformative power of prayer and trust that
              God will lead us through every turning point in our lives.
            </p>
          </div>
        </div>
      </section>

      {/* Text Section: Praying Together Virtually */}
      <section className="w-full py-16 bg-white px-4 md:px-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-purple-700">
              Praying Together Virtually
            </h2>
          </div>
          <div>
            <p className="mt-4 text-lg md:text-xl text-gray-800">
              Shiftings &amp; Turnings is a monthly virtual prayer gathering conducted by our church.
              In recognition of the shifting seasons of life and the need for God's guidance and intervention,
              we come together as an online faith community. Through the power of technology, we connect from
              different locations to seek God's wisdom and surrender our worries, fears, and desires to Him.
              During Shiftings and Turnings, we believe in the transformative power of prayer and trust that
              God will lead us through every turning point in our lives.
            </p>
          </div>
        </div>
      </section>

      {/* Text Section: Join Us */}
      <section className="w-full py-16 bg-gray-900 text-white px-4 md:px-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Join Us</h2>
          </div>
          <div>
            <p className="mt-4 text-lg md:text-xl">
              We invite you to join us for our monthly Shiftings &amp; Turnings virtual prayer gathering.
              Together, we will navigate the shifting seasons of life and seek God's guidance and intervention.
              To stay informed about upcoming Shiftings and Turnings gatherings, please visit our events page
              where you will find the details for our virtual meetings. We look forward to connecting with you online
              and joining our voices in prayer as we trust in God's transformative power.
            </p>
          </div>
        </div>
      </section>

      {/* Event Countdown Section */}
      {displayEvent && (
        <section className="w-full py-16 bg-gradient-to-br from-indigo-700 to-purple-600 text-white px-4 md:px-16">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <img
                src="https://i.ibb.co/6HYMSwh/IMG-2746.jpg"
                alt="Event Flier"
                className="rounded-lg shadow-lg max-w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Event</h2>
              <p className="mb-2">
                <span className="font-semibold">Venue:</span> {eventVenue}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Date &amp; Time:</span>{' '}
                {eventDate.toLocaleString()}
              </p>
              <div className="flex space-x-4 mt-4">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{timeLeft.days}</span>
                  <span>Days</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{timeLeft.hours}</span>
                  <span>Hrs</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{timeLeft.minutes}</span>
                  <span>Min</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{timeLeft.seconds}</span>
                  <span>Sec</span>
                </div>
              </div>
              {registrationLink && (
                <div className="mt-4">
                  <a
                    href={registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow hover:bg-gray-100 transition"
                  >
                    Register Now
                  </a>
                </div>
              )}
              {televisedUrl && (
                <div className="mt-4">
                  <a
                    href={televisedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow hover:bg-gray-100 transition"
                  >
                    Watch Live
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Coordinator Section */}
      <section className="w-full py-16 bg-white text-gray-900 px-4 md:px-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg">
            <img
              src="https://i.ibb.co/HTLwtfN0/pastormark-1-506x598.png"
              alt="Coordinator Mark Odock"
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            {/* Emphasized Name */}
            <h2 className="text-3xl md:text-4xl font-bold">Mark Odock</h2>
            {/* Subtle Title */}
            <p className="mt-2 text-sm md:text-base">Coordinator</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shiftings;
