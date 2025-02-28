import React from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ministries = [
  { 
    name: "Signs & Wonders", 
    img: "https://i.ibb.co/gL4vK7Mm/mivwordhouse-350237575-618857976940268-1781508995232071681-n.jpg", 
    link: "/signs-and-wonders",
    description: "A nurturing and faith-filled children’s ministry focused on teaching kids about God’s love, power, and purpose for their lives."
  },
  { 
    name: "Metro Meet", 
    img: "https://i.ibb.co/tsqSRF5/IMG-2734.jpg", 
    link: "/metro-meet",
    description: "An engaging gathering where young minds discuss diverse topics relevant to their growth, challenges, and opportunities in today’s world."
  },
  { 
    name: "Street Church", 
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzng8yOdehq6LGrtD7wF4wS4fIUY4vD-xvQA&s", 
    link: "/street-church",
    description: "A vibrant evangelism outreach that takes the gospel beyond the church walls, bringing the message of Christ to the streets and communities."
  },
  { 
    name: "Acada Clinic", 
    img: "https://i.ibb.co/hRCjZG2R/9b4c0eee3f6f7d21c588eece93f70e02-high.webp", 
    link: "/acada-clinic",
    description: "A dynamic seminar and webinar series designed to equip students and professionals in the academic world with knowledge, faith, and practical insights for success."
  },
  { 
    name: "Shiftings and Turnings", 
    img: "https://i.ibb.co/KjSP6B3c/mivwordhouse-358042702-1763294970755458-1665773522832433563-n.jpg", 
    link: "/shiftings-and-turnings",
    description: "A powerful prayer meeting dedicated to seeking God’s direction, breakthrough, and transformation in every season of life."
  },
];

const MinistriesSection = () => {
  return (
    <section className="w-full bg-purple-800 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white">Our Ministries</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {ministries.map((ministry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl flex flex-col"
            >
              {/* Image */}
              <div className="w-full aspect-video overflow-hidden rounded-md">
                <img 
                  src={ministry.img} 
                  alt={ministry.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              {/* Content */}
              <div className="mt-2 flex flex-col flex-grow">
                <h3 className="font-bold text-purple-900">{ministry.name}</h3>
                <p className="text-purple-800 mt-2">{ministry.description}</p>
                <Link to={ministry.link} className="text-yellow-500 mt-2 self-start">
                  See More
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MinistriesSection;
