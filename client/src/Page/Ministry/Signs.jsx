import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroImage from '../../assets/signs.jpg';

const eventDetails = {
  dateTime: '2025-01-15T10:00:00', // ISO string for the event start time
  venue: 'Awesome Venue, City',
  registrationLink: 'https://example.com/register',
  televisedUrl: 'https://example.com/live'
};

const textSections = [
  {
    header: 'Signs & Wonders is a children community',
    text: `Our church is committed to providing a safe and nurturing environment where children can learn about God's love and grow in their faith. From engaging Bible lessons to exciting activities, we have designed our Kids Ministry to be both educational and fun for children of all ages. We believe that every child is a valuable part of God's family, and we are dedicated to helping them discover their unique gifts and purpose in Him.`,
    // Updated image URL for the first text session
    image: 'https://i.ibb.co/GQwjmN3p/20241110-083527-1.jpg',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-900'
  },
  {
    header: 'Our Vision',
    text: `Our vision is to create a foundation of faith in children's lives that will last a lifetime. We strive to cultivate an atmosphere where children feel loved, accepted, and encouraged to develop a personal relationship with Jesus Christ. Through age-appropriate teachings, interactive worship, and meaningful friendships, we aim to equip children with biblical knowledge and values that they can apply in their daily lives. We believe that investing in children's spiritual growth is an essential part of building a strong and thriving church community.`,
    image: null,
    bgColor: 'bg-gradient-to-r from-purple-200 to-pink-100',
    textColor: 'text-gray-800'
  },
  {
    header: 'Engaging Programs and Activities',
    text: `The Ministry offers a range of engaging programs and activities that cater to children's diverse interests and learning styles. Each week, children gather for dynamic Sunday School classes where they explore the Bible through creative storytelling, interactive lessons, and hands-on crafts. Additionally, these activities not only allow children to have a blast but also deepen their understanding of God's Word and foster lasting friendships with other children in our church family.`,
    image: 'https://i.ibb.co/S4DWyScv/IMG-0853.jpg',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900'
  },
  {
    header: 'Dedicated and Caring Team',
    text: `The Ministry is led by a dedicated team of passionate volunteers who are committed to the spiritual growth and well-being of every child. Each team member has undergone thorough background checks and training to ensure the safety and security of your children. We believe in the power of positive role models and strive to create a nurturing environment where children feel valued and supported. Our team is here to walk alongside your child, providing guidance, encouragement, and prayer as they navigate their faith journey. We invite you to join us and experience the love and joy that our Kids Ministry has to offer!`,
    image: null,
    bgColor: 'bg-green-50',
    textColor: 'text-green-900'
  }
];

const Signs = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isEventVisible, setIsEventVisible] = useState(true);

  // Calculates time left until the event starts
  const calculateTimeLeft = () => {
    const difference = new Date(eventDetails.dateTime) - new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hrs: Math.floor((difference / (1000 * 60 * 60)) % 24),
        min: Math.floor((difference / 1000 / 60) % 60),
        sec: Math.floor((difference / 1000) % 60)
      };
    }
    return null;
  };

  useEffect(() => {
    // Hide event section if no dateTime is provided
    if (!eventDetails.dateTime) {
      setIsEventVisible(false);
      return;
    }

    const updateTimer = () => {
      const remaining = calculateTimeLeft();
      if (remaining) {
        setTimeLeft(remaining);
      } else {
        setIsEventVisible(false);
      }
    };

    updateTimer();
    const timer = setInterval(() => {
      updateTimer();
    }, 1000);

    // Hide the event if it has passed 15 hours after the start time
    const eventTime = new Date(eventDetails.dateTime).getTime();
    const fifteenHoursLater = eventTime + 15 * 60 * 60 * 1000;
    if (new Date().getTime() > fifteenHoursLater) {
      setIsEventVisible(false);
    }

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center font-sans">
      {/* Hero Section */}
      <section className="w-full relative">
        <img 
          src={HeroImage} 
          alt="Hero" 
          className="w-full object-cover h-[600px] md:h-[900px]" // Increased fixed height
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
          <motion.h1
            className="text-white text-5xl md:text-7xl font-bold mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Signs and Wonders
          </motion.h1>
          <motion.h2
            className="text-white text-2xl md:text-4xl font-light"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Raising Kingdom Champions.
          </motion.h2>
        </div>
      </section>

      {/* Multiple Text Sections */}
      {textSections.map((section, index) => (
        <section
          key={index}
          className={`w-full py-16 px-4 md:px-20 ${section.bgColor} ${section.textColor}`}
        >
          {section.image ? (
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <img 
                  src={section.image} 
                  alt={section.header} 
                  className="rounded-lg shadow-lg w-full max-w-lg" // Slightly reduced size
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.header}</h2>
                <p className="text-lg md:text-xl leading-relaxed">{section.text}</p>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold">{section.header}</h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <p className="text-lg md:text-xl leading-relaxed">{section.text}</p>
              </motion.div>
            </div>
          )}
        </section>
      ))}

      {/* Countdown / Event Section */}
      {isEventVisible && eventDetails.dateTime && (
        <section className="w-full py-16 px-4 md:px-20 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="https://i.ibb.co/6HYMSwh/IMG-2746.jpg" 
                alt="Event Flier" 
                className="rounded-lg shadow-2xl w-full max-w-lg"  
              />
            </motion.div>
            <motion.div
              className="flex flex-col items-start"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-4">Upcoming Event</h2>
              <p className="mb-2">Venue: {eventDetails.venue}</p>
              <p className="mb-2">
                Date & Time: {new Date(eventDetails.dateTime).toLocaleString()}
              </p>
              <div className="flex space-x-4 my-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{timeLeft.days ?? 0}</p>
                  <p>Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{timeLeft.hrs ?? 0}</p>
                  <p>Hrs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{timeLeft.min ?? 0}</p>
                  <p>Min</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{timeLeft.sec ?? 0}</p>
                  <p>Sec</p>
                </div>
              </div>
              {eventDetails.registrationLink && (
                <a
                  href={eventDetails.registrationLink}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register Now
                </a>
              )}
              {eventDetails.televisedUrl && (
                <a
                  href={eventDetails.televisedUrl}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Live
                </a>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Coordinator Section */}
      <section className="w-full py-16 px-4 md:px-20 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center">
          <motion.div
            className="mb-8 md:mb-0 md:mr-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="https://i.ibb.co/bZYXNWB/img-20230727-wa0067-506x764.png" 
              alt="Coordinator Cecilia Adediran" 
              className="rounded-full w-64 h-64 object-cover shadow-xl"
            />
          </motion.div>
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Emphasized Name */}
            <h2 className="text-4xl font-bold mb-4">Cecilia Adediran</h2>
            {/* Subtle Title */}
            <p className="text-sm md:text-base">Coordinator</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Signs;
