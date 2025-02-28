import React from 'react';
import { motion } from "framer-motion";

const AnchorScripture = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 text-center">
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        We are Strong, We are Vigorous and We are Victorious
      </motion.h2>
      <motion.p
        className="mt-4 text-xl sm:text-2xl lg:text-3xl italic text-gray-600"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        "...I have written to you, young men, because you are strong and vigorous,
        and the word of God remains [always] in you, and you have been victorious over
        the evil one [by accepting Jesus as Savior]" — 1John 2:14 (AMP)
      </motion.p>
    </section>
  );
};

export default AnchorScripture;
