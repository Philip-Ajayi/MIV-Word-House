import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../../assets/home.jpeg';

const words = ['Strong', 'Vigorous', 'Victorious'];

const Hero = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Cycle through the words every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Framer Motion variants for the animated word
  const wordVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <section
      className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${Logo})` }}
    >
      {/* Overlay to improve text readability */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10 text-center px-4">
        {/* Introductory Text */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-4">
          Welcome to our Church. Experience faith, hope, and community.
        </p>

        {/* Animated Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
          We are{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={currentWordIndex}
              variants={wordVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="inline-block ml-2"
            >
              {words[currentWordIndex]}
            </motion.span>
          </AnimatePresence>
        </h1>

        {/* Action Buttons with Paths */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* Internal Link to "Plan a Visit" Page */}
          <Link to="/new">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base md:text-lg py-2 px-6 md:py-3 md:px-8 lg:py-4 lg:px-10 xl:py-5 xl:px-12 rounded">
              Plan a Visit
            </button>
          </Link>

          {/* Internal Link to "Latest Sermon" Page */}
          <Link to="/sermons">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold text-base md:text-lg py-2 px-6 md:py-3 md:px-8 lg:py-4 lg:px-10 xl:py-5 xl:px-12 rounded">
              Sermon
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
