import React from 'react';
import { motion } from "framer-motion";
import heroImage from "../../assets/about.jpeg";

const AboutHero = () => {
  return (
    <section 
      className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] bg-cover bg-center" 
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          About MIV Word House
        </motion.h1>
      </div>
    </section>
  );
};

export default AboutHero;
