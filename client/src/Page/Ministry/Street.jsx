import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import heroImage from '../../assets/sreetchurch.jpg';

const Street = () => {
  // Example event details; adjust as needed.
  const eventData = {
    flier: 'https://i.ibb.co/6HYMSwh/IMG-2746.jpg',
    venue: 'Downtown Convention Center',
    dateTime: '2025-01-01T18:00:00Z', // ISO string date
    registrationLink: 'https://example.com/register',
    televisedUrl: 'https://example.com/watch',
  };

  // State to track countdown values
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    if (!eventData.dateTime) return;
    const eventDate = new Date(eventData.dateTime);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = eventDate - now;

      // If the event has passed more than 15 hours, stop showing the countdown
      if (difference < -15 * 3600 * 1000) {
        clearInterval(interval);
        setTimeLeft(null);
        return;
      }

      if (difference <= 0) {
        // Optionally, show 0's once the event starts
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eventData.dateTime]);

  // Only display the event section if there's a valid date and time, and the event hasn’t passed 15 hours ago.
  const showEventSection = eventData.dateTime && timeLeft !== null;

  // Define text sections with alternating layout
  const textSections = [
    {
      header: "A Going Church",
      text: "We are passionate about sharing the life-transforming message of Jesus Christ with everyone in our community. Our ministry is dedicated to reaching out to people from all walks of life, regardless of their background. Through intentional acts of kindness, genuine relationships, and the proclamation of the gospel, we strive to make a positive impact and bring hope to those in our community.",
      bgColor: "bg-purple-100",
    },
    {
      header: "Our Mission and Vision",
      text: "Our mission in Community Outreach and Evangelism is to demonstrate the love of Christ through our actions and boldly proclaim His message of salvation. We believe that every person is valuable and deserving of God's grace and forgiveness. Our vision is to see lives transformed by the power of the gospel, bringing about spiritual renewal, reconciliation, and a thriving community where people experience the abundant life found in Jesus.",
      bgColor: "bg-white",
    },
    {
      header: "Reaching the Community",
      text: "In our Community Outreach and Evangelism efforts, we actively engage with our community to build meaningful connections and share the good news of Jesus Christ. We are committed to fostering a sense of belonging, acceptance, and love within our community, allowing the light of Christ to shine brightly through us.",
      bgColor: "bg-gray-100",
    },
    {
      header: "Empowered to Make a Difference",
      text: "Our Community Outreach and Evangelism ministry is driven by a team of passionate individuals who are empowered by the Holy Spirit to make a difference in the lives of others. We provide training, support, and resources to equip our team members to effectively communicate the gospel and engage in authentic conversations. We believe in the power of prayer and rely on God's guidance as we seek to impact our community. Join us as we strive to share God's love, bring hope to the hurting, and extend the invitation to experience the life-changing power of Jesus Christ. Together, let us be a beacon of light in our community!",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section
        className="w-full"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-black bg-opacity-50 p-8 md:p-16 flex flex-col justify-center" style={{ height: '400px' }}>
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Street Church
          </motion.h1>
          <motion.p
            className="mt-4 text-xl md:text-3xl text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Taking the Gospel to the Streets, One Soul at a Time.
          </motion.p>
        </div>
      </section>

      {/* Alternating Text Sections */}
      {textSections.map((section, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <section key={idx} className={`w-full py-12 ${section.bgColor}`}>
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
              {/* Even index: header left, text right; odd index: header right, text left */}
              <div className={`${isEven ? 'md:order-1' : 'md:order-2'} md:w-1/2`}>
                <motion.h2
                  className="text-3xl md:text-5xl font-bold text-purple-900"
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {section.header}
                </motion.h2>
              </div>
              <div className={`${isEven ? 'md:order-2' : 'md:order-1'} md:w-1/2`}>
                <motion.p
                  className="text-lg md:text-xl text-gray-800"
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {section.text}
                </motion.p>
              </div>
            </div>
          </section>
        );
      })}

      {/* Event Countdown Section */}
      {showEventSection && (
        <section className="w-full py-12 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid md:grid-cols-2 gap-8 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              {/* Flier Image */}
              <div>
                <img
                  src={eventData.flier}
                  alt="Event Flier"
                  className="rounded-lg shadow-lg"
                />
              </div>
              {/* Event Details and Countdown */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Upcoming Event</h2>
                <p className="mb-2">
                  <strong>Venue:</strong> {eventData.venue}
                </p>
                <p className="mb-2">
                  <strong>Date & Time:</strong> {new Date(eventData.dateTime).toLocaleString()}
                </p>
                {timeLeft && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <span className="block text-2xl font-bold">{timeLeft.days}</span>
                      <span className="block text-sm">Days</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold">{timeLeft.hours}</span>
                      <span className="block text-sm">Hrs</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold">{timeLeft.minutes}</span>
                      <span className="block text-sm">Min</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold">{timeLeft.seconds}</span>
                      <span className="block text-sm">Sec</span>
                    </div>
                  </div>
                )}
                {eventData.registrationLink && (
                  <a
                    href={eventData.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-white text-purple-600 px-4 py-2 rounded shadow hover:bg-gray-200 transition"
                  >
                    Register Now
                  </a>
                )}
                {eventData.televisedUrl && (
                  <a
                    href={eventData.televisedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 ml-4 inline-block bg-white text-purple-600 px-4 py-2 rounded shadow hover:bg-gray-200 transition"
                  >
                    Watch Live
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Coordinator Section */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
          <img
            src="https://i.ibb.co/NgV9qNYD/img-20230131-072810-334-506x675.png"
            alt="Coordinator Ayobami Adeagbo"
            className="w-48 h-48 rounded-full object-cover shadow-lg"
          />
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-purple-900"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            Ayobami Adeagbo
          </motion.h2>
          <p className="text-sm md:text-base text-gray-700">Coordinator</p>
        </div>
      </section>
    </div>
  );
};

export default Street;
