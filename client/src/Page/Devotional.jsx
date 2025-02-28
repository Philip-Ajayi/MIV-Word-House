import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGooglePlay, FaApple } from 'react-icons/fa';

// Helper: Format a Date object as 'YYYY-MM-DD' using local time
const formatLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  // getMonth() is zero-indexed so we add 1
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Devotional = () => {
  const [currentDate, setCurrentDate] = useState(formatLocalDate());
  const [devotionals, setDevotionals] = useState([]);

  // Fetch devotionals from API
  useEffect(() => {
    fetch('/devotional/contents')
      .then((res) => res.json())
      .then((data) => setDevotionals(data))
      .catch((err) => console.error('Error fetching devotionals:', err));
  }, []);

  // Handlers to navigate days using local time
  const handlePrev = () => {
    const current = new Date(currentDate);
    current.setDate(current.getDate() - 1);
    setCurrentDate(formatLocalDate(current));
  };

  const handleNext = () => {
    const current = new Date(currentDate);
    current.setDate(current.getDate() + 1);
    setCurrentDate(formatLocalDate(current));
  };

  // Check if devotional content exists for the current date
  const currentDevotional = devotionals.find(
    (item) => item.date.slice(0, 10) === currentDate
  );

  // Framer Motion animation variants
  const variants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  // Display label: show "Today" if currentDate matches today's local date.
  const today = formatLocalDate();
  const dateLabel = currentDate === today ? 'Today' : currentDate;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* General Header */}
      <header className="bg-purple-600 text-white p-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold">The Awakening Word</h1>
        <p className="text-lg md:text-2xl">The Men of Issachar Vision Inc.</p>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mt-8">
          {/* Navigation Header */}
          <div className="flex justify-between items-center mb-4">
            <motion.button
              onClick={handlePrev}
              whileTap={{ scale: 0.9 }}
              className="text-blue-500 hover:text-blue-700 focus:outline-none text-2xl"
            >
              &larr;
            </motion.button>
            <div className="text-gray-600 text-sm md:text-base">{dateLabel}</div>
            <motion.button
              onClick={handleNext}
              whileTap={{ scale: 0.9 }}
              className="text-blue-500 hover:text-blue-700 focus:outline-none text-2xl"
            >
              &rarr;
            </motion.button>
          </div>

          {/* Devotional Content or Fallback Message */}
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={currentDate}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              {currentDevotional ? (
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">
                    {currentDevotional.topic}
                  </h2>
                  <p className="text-gray-800 text-base md:text-lg mb-4">
                    Anchor Scripture: {currentDevotional.speaker}
                  </p>
                  {/* Render HTML content from React Quill */}
                  <div
                    className="text-gray-600 leading-relaxed text-base md:text-lg"
                    dangerouslySetInnerHTML={{ __html: currentDevotional.content }}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">
                    No Devotional Uploaded
                  </h2>
                  <p className="text-gray-600 text-base md:text-lg">
                    Devotional content for{' '}
                    <span className="font-medium">{currentDate}</span> is not uploaded yet.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* App Download Section */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <a
            href="https://play.google.com/store/apps/details?id=com.miv.devotional"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            <FaGooglePlay size={24} />
            <span>Download Android App</span>
          </a>
          <a
            href="https://apps.apple.com/us/app/miv-devotional/id6502105645"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            <FaApple size={24} />
            <span>Download iOS App</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Devotional;
