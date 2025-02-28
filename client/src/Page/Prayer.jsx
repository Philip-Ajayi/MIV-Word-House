import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Prayer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  // Update form values on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form data to the /prayer endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch('/contact/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('Your prayer request has been sent!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('There was an error sending your prayer request.');
      }
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      setStatus('There was an error sending your prayer request.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Section: Introduction Text (Justified) */}
          <div className="md:w-1/2 bg-purple-600 text-white p-8 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Prayer Request</h2>
              <p className="mb-4 text-base md:text-lg text-justify">
                At our church, we believe in the power of prayer and the comfort it brings.
                If you’re facing a challenging situation, seeking guidance, or simply need someone to pray with you,
                we are here to help.
              </p>
              <p className="text-base md:text-lg text-justify">
                Please share your prayer request below. Your request will be kept confidential and our dedicated prayer
                team will join you in lifting your needs to the Lord. Remember, you are never alone.
              </p>
            </motion.div>
          </div>

          {/* Right Section: Prayer Request Form */}
          <div className="md:w-1/2 p-8">
            <motion.form
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm md:text-base font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm md:text-base"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm md:text-base font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm md:text-base"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm md:text-base font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm md:text-base"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm md:text-base font-medium text-gray-700">
                  Prayer Request
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm md:text-base"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-sm md:text-base"
                >
                  Submit Request
                </button>
              </div>
              {status && (
                <p className="text-center text-sm md:text-base mt-2 text-gray-700">{status}</p>
              )}
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prayer;
