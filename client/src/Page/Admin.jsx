// Admin.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Data for each admin panel card including their navigation link
const adminPanels = [
  {
    title: 'Radio',
    description: 'Manage your radio station settings and playlists.',
    bgColor: 'bg-blue-500',
    link: '/admin/radio',
  },
  {
    title: 'Calendar',
    description: 'Organize events, schedules, and community gatherings.',
    bgColor: 'bg-green-500',
    link: '/admin/calendar',
  },
  {
    title: 'Devotional',
    description: 'Update daily devotionals and inspirational messages.',
    bgColor: 'bg-yellow-500',
    link: '/admin/devotional',
  },
  {
    title: 'Sermon Audio',
    description: 'Upload and manage sermon audio files.',
    bgColor: 'bg-purple-500', // Primary color panel
    link: '/admin/sermon-audio',
  },
  {
    title: 'Contacts',
    description: 'Keep your contacts organized and up to date.',
    bgColor: 'bg-red-500',
    link: '/admin/contacts',
  },
  {
    title: 'Blog',
    description: 'Create and manage your blog posts.',
    bgColor: 'bg-indigo-500',
    link: '/admin/blog',
  },
];

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-700">
          Admin Panel
        </h1>
        {/* Responsive grid: 1 column on small screens, 2 on sm, and 3 on lg */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {adminPanels.map((panel, index) => (
            <motion.div
              key={index}
              className={`rounded-lg shadow-lg p-6 ${panel.bgColor} text-white flex flex-col justify-between`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">{panel.title}</h2>
                <p className="text-sm">{panel.description}</p>
              </div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link
                  to={panel.link}
                  className="mt-4 bg-white text-black font-semibold py-2 px-4 rounded inline-block text-center"
                >
                  Manage {panel.title}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
