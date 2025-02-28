import React, { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';
import heroImg from '../../assets/acada.jpg';

const Acada = () => {
  // Example event details – replace or fetch these as needed.
  const eventDetails = {
    flier: 'https://i.ibb.co/6HYMSwh/IMG-2746.jpg',
    venue: 'Innovation Hall, Academic Campus',
    dateTime: '2025-02-11T18:00:00', // ISO format date string for a future event
    registrationUrl: 'https://example.com/register', // set to null if not available
    televisedUrl: 'https://example.com/watch', // set to null if not available
  };

  // Countdown logic
  const [timeLeft, setTimeLeft] = useState({});
  const calculateTimeLeft = () => {
    const eventTime = new Date(eventDetails.dateTime);
    const difference = eventTime - new Date();
    let timeLeftObj = {};
    if (difference > 0) {
      timeLeftObj = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeftObj;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if the event section should display.
  // If no dateTime is provided or if the event has passed by more than 15 hours, don't show it.
  const eventDateTime = new Date(eventDetails.dateTime);
  const now = new Date();
  const diffInMs = eventDateTime - now;
  const showEvent = eventDetails.dateTime && diffInMs > -15 * 60 * 60 * 1000;

  return (
    <div className="font-sans text-gray-100 bg-gray-900">
      {/* Hero Section */}
      <section
        className="relative"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative flex flex-col justify-center items-center h-full">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg"
          >
            Acada Clinic
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-3xl mt-4 text-purple-300 drop-shadow-lg"
          >
            Equipping Minds, Transforming Lives
          </motion.h2>
        </div>
      </section>

      {/* Text Section 1 */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-purple-800 to-indigo-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Your Hub for Academic Excellence
          </h2>
          <p className="text-lg md:text-xl">
            At Academic Clinic, we are committed to fostering intellectual growth
            and professional development. Whether you're a student, educator, or
            researcher, our platform offers a wide range of gatherings, webinars, and
            seminars designed to enrich your academic journey.
          </p>
        </div>
      </section>

      {/* Text Section 2 */}
      <section className="py-16 px-6 md:px-12 bg-gray-800">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              What is Academic Clinic?
            </h2>
          </div>
          <div>
            <p className="text-lg md:text-xl">
              Academic Clinic is a dedicated space for individuals passionate about
              learning, teaching, and research. We bring together experts and learners
              in various academic disciplines to engage in meaningful discussions, gain
              insights, and stay updated on the latest trends in the academic world.
            </p>
          </div>
        </div>
      </section>

      {/* Text Section 3 */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-indigo-800 to-purple-800">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Our Mission</h2>
          </div>
          <div>
            <p className="text-lg md:text-xl">
              Our mission is to provide high-quality academic support through interactive
              sessions, expert-led discussions, and collaborative learning. We aim to bridge
              knowledge gaps, inspire innovation, and create a thriving academic community.
            </p>
          </div>
        </div>
      </section>

      {/* Text Section 4 */}
      <section className="py-16 px-6 md:px-12 bg-gray-700">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Join Us Today!</h2>
          <p className="text-lg md:text-xl">
            Whether you're looking to enhance your knowledge, develop new skills, or
            connect with academic professionals, Academic Clinic is the perfect place
            for you. Explore our upcoming events and be part of a thriving learning
            environment!
          </p>
        </div>
      </section>

      {/* Event Countdown Section */}
      {showEvent && Object.keys(timeLeft).length > 0 && (
        <section className="py-16 px-6 md:px-12 bg-gradient-to-br from-purple-900 to-black">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            {/* Event Flier */}
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <img
                src={eventDetails.flier}
                alt="Event Flier"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
            {/* Event Details */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Event</h2>
              <p className="mb-2 text-lg">
                <strong>Venue:</strong> {eventDetails.venue}
              </p>
              <p className="mb-6 text-lg">
                <strong>Date & Time:</strong>{' '}
                {new Date(eventDetails.dateTime).toLocaleString()}
              </p>
              <div className="flex justify-center md:justify-start space-x-4 text-2xl mb-6">
                <div className="flex flex-col items-center">
                  <span className="font-bold">{timeLeft.days}</span>
                  <span className="text-sm">Days</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold">{timeLeft.hours}</span>
                  <span className="text-sm">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold">{timeLeft.minutes}</span>
                  <span className="text-sm">Minutes</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold">{timeLeft.seconds}</span>
                  <span className="text-sm">Seconds</span>
                </div>
              </div>
              {eventDetails.registrationUrl && (
                <a
                  href={eventDetails.registrationUrl}
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded mr-4"
                >
                  Register Now
                </a>
              )}
              {eventDetails.televisedUrl && (
                <a
                  href={eventDetails.televisedUrl}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Watch Live
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Coordinator Section */}
      <section className="py-16 px-6 md:px-12 bg-indigo-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center">
            <img
              src="https://i.ibb.co/zWRNXjmn/Whats-App-Image-2025-02-13-at-10-38-47-PM.jpg"
              alt="Coordinator Agagwu Onyiyechukwu"
              className="w-40 h-40 rounded-full mb-4 object-cover"
            />
            <h3 className="text-2xl md:text-3xl font-bold">Agagwu Onyiyechukwu</h3>
            <p className="text-sm md:text-base">Coordinator</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Acada;
