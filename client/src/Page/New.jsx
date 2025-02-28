import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import heroImage from '../assets/images.jpg'; // Ensure the path is correct

// Sample FAQs
const faqs = [
  { question: "What time are the services?", answer: "Our Sunday services start at 08:30AM. We also have gatherings and special events throughout the week." },
  { question: "Where is the church located?", answer: "We are located behind Accord Building, Obadeyi Estate, Samonda Ibadan." },
  { question: "What should I wear?", answer: "Whatever makes you feel comfortable! Most people dress casually, but you’re welcome to wear what feels right for you." },
  { question: "Is there parking available?", answer: "Yes! There’s plenty of parking on-site, and our team will be happy to guide you when you arrive." },
  { question: "How long is the service?", answer: "Our services typically last about one to two hours, including worship, a message, and time for connection." },
  { question: "Do I need to register before visiting?", answer: "No registration is needed—just show up! Our team will be happy to welcome you and help you get settled." },
  { question: "What kind of music do you play?", answer: "Our worship is energetic and passionate, with a mix of contemporary Christian music and original songs." },
  { question: "Do you have small groups?", answer: "Yes! We have small groups that meet regularly for deeper discussions, community, and encouragement. These groups are open to everyone, no matter your background or experience." },
  { question: "What do you believe as a church?", answer: "We are a Bible-centered church focused on following Jesus and building a community where faith is lived out authentically." },
  { question: "Do you offer online services?", answer: "Yes! If you can’t make it in person, you can join us live online or watch past messages anytime." },
  { question: "Can I bring my friends?", answer: "Absolutely! We encourage you to invite your friends to experience church with you. The more, the better!" },
  { question: "Is there a way to meet people before or after the service?", answer: "Yes! We'd love for you to meet people before or after the service! We encourage you to arrive a little early or stay after the service to connect with others. Our friendly welcome team is always available to greet you and answer any questions." },
  { question: "Do I need to know a lot about the Bible to attend?", answer: "Not at all! Whether you’ve been in church for years or are just starting to explore faith, you are welcome here." },
  { question: "Can I meet the pastor or leaders?", answer: "Definitely! Our leaders love connecting with new people. Feel free to introduce yourself after service or reach out to set up a time to chat." },
  { question: "How can I get involved?", answer: "There are so many ways to get involved! From serving on a team to joining a small group, we’d love to help you find your place. Just ask a leader when you visit!" },
];

// Sample images for the gallery slider
const images = [
  "https://i.ibb.co/VY0SSW3Z/IMG-4746.jpg",
  "https://i.ibb.co/wFkJWzQf/mivwordhouse-358218449-831915665185849-2329697857118861792-n-1067x1067.jpg",
  "https://i.ibb.co/7d2L9Vd5/IMG-4744.jpg",
  "https://i.ibb.co/JFFGZN5T/IMG-0807.jpg",
];

// FAQ Accordion Item component with external state control
const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-200 py-4">
    <button 
      onClick={onClick} 
      className="w-full text-left flex justify-between items-center focus:outline-none"
    >
      {/* Increase text size for larger screens */}
      <span className="text-lg md:text-xl lg:text-2xl font-medium">{question}</span>
      <span className="ml-2 text-2xl">{isOpen ? '-' : '+'}</span>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="content"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 text-gray-600 overflow-hidden"
        >
          <p className="text-base md:text-lg lg:text-xl">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const PlanVisit = () => {
  // Manage the currently open FAQ item's index
  const [activeIndex, setActiveIndex] = useState(null);

  // Toggle the FAQ item; if another is open, close it first with a delay
  const handleToggle = (index) => {
    if (activeIndex === index) {
      // Close the currently open item
      setActiveIndex(null);
    } else {
      if (activeIndex !== null) {
        // Close the open item, then open the new one after the exit animation (0.3s)
        setActiveIndex(null);
        setTimeout(() => {
          setActiveIndex(index);
        }, 300);
      } else {
        setActiveIndex(index);
      }
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header (Hero) Section */}
      <header
        className="relative py-12 text-white text-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Plan Your Visit
          </motion.h1>
          <motion.p
            className="mt-4 text-lg md:text-xl lg:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            We’re so excited that you’re thinking about visiting our church. Below, you'll find answers to some common questions to help you prepare for your visit.
          </motion.p>
        </div>
      </header>
      
      {/* Image Slider Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-center mb-8 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Explore Our Gallery
          </motion.h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <motion.div 
                  className="overflow-hidden rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={img} 
                    alt={`Gallery ${index + 1}`} 
                    className="w-full h-64 object-cover" 
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-center mb-8 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="max-w-2xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                question={faq.question} 
                answer={faq.answer} 
                isOpen={activeIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlanVisit;
