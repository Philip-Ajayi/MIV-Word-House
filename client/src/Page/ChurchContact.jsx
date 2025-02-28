import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ChurchContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  // Update form values on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form data to the /contact endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch('/contact/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('Your message has been sent!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('There was an error sending your message.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus('There was an error sending your message.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Section: Church Contact Info */}
          <div className="md:w-1/2 bg-purple-700 text-white p-8 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
              <p className="mb-6 text-base md:text-lg">
                We are here to serve you. Reach out anytime!
              </p>
              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zM12 13c-2.667 0-8 1.333-8 4v2h16v-2c0-2.667-5.333-4-8-4z"
                    />
                  </svg>
                  <span className="text-base md:text-lg">
                    Behind Accord Building, Obadeyi Estate Samonda Ibadan
                  </span>
                </div>
                {/* Phone */}
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.37l1.11 3.33a2 2 0 01-.43 2.1l-2.2 2.2a11.042 11.042 0 005.516 5.516l2.2-2.2a2 2 0 012.1-.43l3.33 1.11A2 2 0 0121 16.72V20a2 2 0 01-2 2h-1C9.163 22 2 14.837 2 6V5z"
                    />
                  </svg>
                  <span className="text-base md:text-lg">+234 (816) 3047-854</span>
                </div>
                {/* Email */}
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12H8m8 0a4 4 0 01-8 0m8 0a4 4 0 01-8 0m8 0V8a4 4 0 00-8 0v4"
                    />
                  </svg>
                  <span className="text-base md:text-lg">contact@mivwordhouse.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Section: Contact Form */}
          <div className="md:w-1/2 p-8">
            <motion.form
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm md:text-base font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm md:text-base font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm md:text-base font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-purple-700 text-white font-semibold rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm md:text-base"
                >
                  Send Message
                </button>
              </div>
              {status && (
                <p className="text-center text-sm md:text-base mt-2 text-gray-700">
                  {status}
                </p>
              )}
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurchContact;
