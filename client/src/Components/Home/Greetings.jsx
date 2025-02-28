import React from 'react';
import { motion } from 'framer-motion';
import greetingVideo from '../../assets/greetings.mp4';

const GreetingSection = () => {
  return (
    <section className="bg-purple-900">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 mb-10 md:mb-0 px-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Welcome to MIV Word House
          </h1>

          {/* Accent underline */}
          <div className="mt-3 w-20 sm:w-24 h-1 bg-purple-400 rounded-full" />

          {/* Pastor Greeting */}
          <div className="mt-6 border-l-4 border-purple-400 pl-4">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
              Greetings, I'm <span className="font-semibold">Ope Rowland</span>.
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-purple-300 mt-2">
              Lead Pastor
            </p>
          </div>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-200">
            Thank you for visiting our community. We are excited to have you join us in fellowship and spiritual growth.
          </p>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 flex justify-center px-4"
        >
          {/* Responsive container maintaining a 1:1 ratio, up to 1072px */}
          <div className="w-full max-w-[1072px] aspect-square rounded-lg shadow-lg overflow-hidden">
            <video
              controls
              preload="metadata"
              className="w-full h-full object-cover"
              src={greetingVideo}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GreetingSection;
