import React from 'react';
import { motion } from 'framer-motion';
import { FaChurch, FaHeadphones } from 'react-icons/fa';

const WorshipTimes = () => {
  return (
    <section className="bg-gradient-to-r from-purple-800 to-purple-600 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl shadow-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10">
            <FaChurch className="mx-auto text-yellow-300 mb-4" />
            Weekly Worship Times
          </h2>

          {/* Worship Times Cards */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {/* Wednesday Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-full md:w-1/2 bg-purple-100 rounded-xl p-6 text-center transition-transform duration-300 ease-in-out"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-purple-900 mb-3">
                Wednesday
              </h3>
              <p className="text-xl md:text-2xl text-purple-800">
                06:00 PM WAT
              </p>
            </motion.div>

            {/* Sunday Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-full md:w-1/2 bg-purple-200 rounded-xl p-6 text-center transition-transform duration-300 ease-in-out"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-purple-900 mb-3">
                Sunday
              </h3>
              <p className="text-xl md:text-2xl text-purple-800">
                08:30 AM WAT
              </p>
            </motion.div>
          </div>

          {/* Radio Link Card */}
          <div className="mt-10">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/radio"  // Replace with your radio URL
              className="block bg-purple-300 rounded-xl p-6 text-center transition-transform duration-300 ease-in-out"
            >
              <FaHeadphones className="mx-auto text-yellow-300 mb-4" size={40} />
              <h3 className="text-2xl md:text-3xl font-semibold text-purple-900 mb-3">
                Listen to Our Radio
              </h3>
              <p className="text-xl md:text-2xl text-purple-800">
                Tune in now!
              </p>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorshipTimes;
