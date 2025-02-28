import React from 'react';
import { motion } from "framer-motion";
import logo from "../assets/logo.png"; // Adjust path if needed

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Logo Animation */}
      <motion.img
        src={logo}
        alt="Loading Logo"
        className="w-32 h-32 md:w-40 md:h-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 1, 0], // Fades in and out
          scale: [0.8, 1, 1.2, 1], // Pulsates
          rotate: [0, 360], // Rotates
        }}
        transition={{
          duration: 2,
          repeat: Infinity, // Loops forever
          ease: "easeInOut",
        }}
      />

      {/* Spinning Loader */}
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mt-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />

      {/* Loading Text */}
      <motion.p
        className="mt-4 text-lg font-semibold tracking-wide text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loading;
