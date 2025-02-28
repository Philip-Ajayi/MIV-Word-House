import React from 'react';
import { motion } from "framer-motion";

const leadershipData = [
  {
    name: "Samson & Stella Ajetomobi",
    role: "Oversight",
    imgSrc:
      "https://i.ibb.co/NgRqsBTW/whatsapp-image-2023-07-19-at-5-26-20-pm-1.jpg",
    delay: 0.2,
  },
  {
    name: "Ope Rowland",
    role: "Lead Pastor",
    imgSrc: "https://i.ibb.co/Q7DJ4kTC/pastorope-1-506x764.png",
    delay: 0.3,
  },
  {
    name: "Atinuke Rowland",
    role: "Care Pastor",
    imgSrc: "https://i.ibb.co/DHx5T5J7/pastoratinuke-1-506x337.png",
    delay: 0.4,
  },
  {
    name: "Mark Odock",
    role: "Outreach Pastor",
    imgSrc: "https://i.ibb.co/HTLwtfN0/pastormark-1-506x598.png",
    delay: 0.5,
  },
  {
    name: "Philip Olaniyi",
    role: "Admin Pastor",
    imgSrc: "https://i.ibb.co/N6NqS2gx/mg-6752-506x759.jpg",
    delay: 0.6,
  },
  {
    name: "Olawumi Olalowo",
    role: "Service Team Pastor",
    imgSrc: "https://i.ibb.co/5hvdvr7S/dsc-7455-506x633.png",
    delay: 0.7,
  },
  {
    name: "Thompson Azuu",
    role: "Pastor",
    imgSrc: "https://i.ibb.co/1YN6Zws1/dsc-2471-1-506x449.png",
    delay: 0.8,
  },
  {
    name: "Zephaniah Adediran",
    role: "Digital Compliance Pastor",
    imgSrc: "https://i.ibb.co/4n545Y9m/pastorzeph-506x764.jpg",
    delay: 0.9,
  },
];

const Leadership = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Leadership
        </motion.h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {leadershipData.map((leader, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 h-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: leader.delay }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Circular container for the image */}
              <div className="w-48 h-48 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src={leader.imgSrc}
                  alt={leader.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{leader.name}</h3>
              <p className="mt-1 text-gray-600">{leader.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;
