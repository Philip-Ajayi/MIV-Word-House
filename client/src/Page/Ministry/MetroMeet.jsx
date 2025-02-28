import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import heroImage from '../../assets/metro.jpg';

const sections = [
  {
    header: "Empowering Young Minds",
    text: "Metro Meet is a dynamic gathering designed to engage, educate, and empower young people through meaningful discussions on various topics affecting their lives. From career growth to mental health, relationships, and social impact, we create a space where young minds can connect, learn, and inspire each other.",
    image: "https://i.ibb.co/6HYMSwh/IMG-2742.jpg",
    bgColor: "bg-purple-100",
    textColor: "text-purple-900"
  },
  {
    header: "What is Metro Meet?",
    text: "Metro Meet is more than just an event; it’s a movement dedicated to addressing real-life challenges and opportunities that young people face. Through interactive sessions, expert insights, and open conversations, we provide a platform for growth, networking, and transformation.",
    image: "https://i.ibb.co/rGHRKP3/IMG-2727.jpg",
    bgColor: "bg-blue-100",
    textColor: "text-blue-900"
  },
  {
    header: "Our Mission",
    text: "Our mission is to create a safe, engaging, and impactful space where young people can explore ideas, challenge norms, and develop solutions to the issues that shape their world. We believe in equipping youth with knowledge, confidence, and connections to help them thrive in all aspects of life.",
    image: "https://i.ibb.co/6HYMSwh/IMG-2742.jpg",
    bgColor: "bg-green-100",
    textColor: "text-green-900"
  },
  {
    header: "Be Part of the Conversation!",
    text: "Metro Meet is your space to share, learn, and grow. Whether you're looking for guidance, inspiration, or a community that understands your journey, we invite you to join us for the next gathering. Let’s discuss, connect, and make an impact together!",
    image: "https://i.ibb.co/Yp5DCxn/IMG-2520.jpg",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-900"
  }
];

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calculateTimeLeft();
      if (tl) {
        setTimeLeft(tl);
      } else {
        setTimeLeft(null);
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-lg">Event Started!</span>;

  return (
    <div className="flex space-x-6">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <p className="text-3xl font-extrabold">{value}</p>
          <p className="uppercase text-xs">{unit}</p>
        </div>
      ))}
    </div>
  );
};

const Metro = () => {
  // Example event data – adjust as needed.
  const event = {
    dateTime: "2025-01-01T12:00:00Z", // ISO date format
    venue: "Futuristic Convention Center, Metropolis",
    registrationLink: "https://example.com/register", // Set to null if not available
    televisedUrl: "https://example.com/live", // Set to null if not available
    flyer: "https://i.ibb.co/6HYMSwh/IMG-2746.jpg"
  };

  const eventDate = new Date(event.dateTime);
  const now = new Date();
  // Hide the event section if no date is provided or if the event is more than 15 hours past.
  const displayEvent =
    event.dateTime && now - eventDate < 15 * 60 * 60 * 1000;

  return (
    <div className="font-sans antialiased">
      {/* Hero Section with Background Image & Overlay Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[60vh] md:h-screen"
        style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold">Metro Meet</h1>
          <p className="text-white text-lg md:text-2xl mt-4">
            Empowering Young Minds for a Futuristic Tomorrow
          </p>
        </div>
      </motion.div>

      {/* Alternating Text & Image Sections */}
      {sections.map((section, index) => (
        <motion.section
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          className={`${section.bgColor} py-12 px-4 md:px-16`}
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            {index % 2 === 0 ? (
              <>
                {/* Text on Left */}
                <div>
                  <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${section.textColor}`}>
                    {section.header}
                  </h2>
                  <p className={`text-base md:text-lg ${section.textColor}`}>
                    {section.text}
                  </p>
                </div>
                {/* Image on Right */}
                <div>
                  <img 
                    src={section.image} 
                    alt={section.header} 
                    className="w-full rounded-lg shadow-lg" 
                  />
                </div>
              </>
            ) : (
              <>
                {/* Image on Left */}
                <div>
                  <img 
                    src={section.image} 
                    alt={section.header} 
                    className="w-full rounded-lg shadow-lg" 
                  />
                </div>
                {/* Text on Right */}
                <div>
                  <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${section.textColor}`}>
                    {section.header}
                  </h2>
                  <p className={`text-base md:text-lg ${section.textColor}`}>
                    {section.text}
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.section>
      ))}

      {/* Event Countdown Section */}
      {displayEvent && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-gray-900 text-white py-12 px-4 md:px-16"
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src={event.flyer} 
                alt="Event Flyer" 
                className="w-full rounded-lg shadow-lg" 
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Event</h2>
              <p className="mb-2">
                <span className="font-semibold">Venue:</span> {event.venue}
              </p>
              <p className="mb-4">
                <span className="font-semibold">Date & Time:</span> {new Date(event.dateTime).toLocaleString()}
              </p>
              <CountdownTimer targetDate={event.dateTime} />
              <div className="mt-4 flex flex-col space-y-3">
                {event.registrationLink && (
                  <a 
                    href={event.registrationLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition"
                  >
                    Register Now
                  </a>
                )}
                {event.televisedUrl && (
                  <a 
                    href={event.televisedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition"
                  >
                    Watch Live
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Coordinator Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-12 px-4 md:px-16"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-4">
          <img 
            src="https://i.ibb.co/Fqgqr77N/pgs18200618485544-409x416.png" 
            alt="Coordinator" 
            className="w-48 h-48 rounded-full border-4 border-white shadow-lg" 
          />
          {/* Emphasized Name */}
          <h2 className="text-3xl md:text-4xl font-bold">Philip Ajayi</h2>
          {/* Subtle Title */}
          <p className="text-sm md:text-base">Coordinator</p>
        </div>
      </motion.section>
    </div>
  );
};

export default Metro;
