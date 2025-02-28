import React from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Floating 404 Animation */}
        <motion.h1
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-7xl md:text-9xl font-bold text-blue-600"
        >
          404
        </motion.h1>

        {/* Fade-in Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-2xl text-gray-600"
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>

        {/* Animated Button */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PageNotFound;
