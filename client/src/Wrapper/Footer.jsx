import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaTiktok, 
  FaSpotify, 
  FaTelegramPlane,
  FaYoutube
} from 'react-icons/fa';
import { SiThreads } from 'react-icons/si';

const sitemaps = [
  { name: "I’m New", path: "/new" },
  { name: "About", path: "/about" },
  {
    name: "Ministries",
    dropdown: [
      { name: "Signs and Wonders", path: "/signs-and-wonders" },
      { name: "Metro Meet", path: "/metro-meet" },
      { name: "Street Church", path: "/street-church" },
      { name: "Acada Clinic", path: "/acada-clinic" },
      { name: "Shiftings and Turnings", path: "/shiftings-and-turnings" },
    ],
  },
  {
    name: "Resources",
    dropdown: [
      { name: "Sermon", path: "/sermons" },
      { name: "Sermon Video", path: "/sermon-video" },  // New item added here
      { name: "Blog", path: "/blog" },
      { name: "Event", path: "/events" },
      { name: "Devotional", path: "/devotional" },
    ],
  },
  {
    name: "Stream",
    dropdown: [
      { name: "Radio", path: "/radio" },
      { name: "Tv", path: "/tv" },
    ],
  },
  { name: "Store", path: "/store" },
  { name: "Fellowship", path: "/fellowship" },
  {
    name: "Contact",
    dropdown: [
      { name: "Contact Us", path: "/contact" },
      { name: "Pray for Me", path: "/prayer" },
    ],
  },
  { name: "Give", path: "/give" },
];

const socialLinks = [
  { icon: <FaFacebookF size={20} />, href: "https://facebook.com/mivwordhouse" },
  { icon: <FaInstagram size={20} />, href: "https://instagram.com/mivwordhouse" },
  { icon: <FaTwitter size={20} />, href: "https://x.com/mivwordhouse?lang=en" },
  { icon: <SiThreads size={20} />, href: "https://www.threads.net/@mivwordhouse" },
  { icon: <FaTiktok size={20} />, href: "https://www.tiktok.com/@mivwordhouse" },
  { icon: <FaSpotify size={20} />, href: "https://creators.spotify.com/pod/show/mivwordhouse/" },
  { icon: <FaTelegramPlane size={20} />, href: "https://t.me/mivwordhouse" },
  { icon: <FaYoutube size={20} />, href: "https://www.youtube.com/@mivwordhouse" },
];

const Footer = () => {
  // Newsletter form state
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Newsletter submission handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!newsletterName.trim() || !newsletterEmail.trim()) {
      setError("Name and Email are required");
      return;
    }

    try {
      const response = await fetch('/contact/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newsletterName,
          email: newsletterEmail,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Submission failed');
      } else {
        setSuccess('Thank you for subscribing!');
        setNewsletterName('');
        setNewsletterEmail('');
      }
    } catch (err) {
      console.error('Error submitting newsletter:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Church Information & Newsletter */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Church Details */}
            <h2 className="text-2xl font-bold text-white">MIV Word House</h2>
            <p>
              Behind Accord Building, Obadeyi Estate<br />
              Samonda Ibadan
            </p>
            <p>
              Email:{" "}
              <a href="mailto:mivwordhouse.com@gmail.com" className="hover:text-white transition">
                contact@mivwordhouse.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+2348163047854" className="hover:text-white transition">
                +234 (816) 3047-854
              </a>
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-white">Newsletter</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={newsletterName}
                  onChange={(e) => setNewsletterName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-white"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-white"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Subscribe
              </button>
            </form>
          </motion.div>

          {/* Sitemap Links */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {sitemaps.map((item, index) => (
              <div key={index}>
                {item.path ? (
                  <a href={item.path} className="hover:text-white transition">
                    {item.name}
                  </a>
                ) : (
                  <div>
                    <span className="font-semibold">{item.name}</span>
                    <ul className="mt-1 space-y-1">
                      {item.dropdown.map((subitem, subindex) => (
                        <li key={subindex}>
                          <a href={subitem.path} className="hover:text-white transition">
                            {subitem.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            className="flex flex-col items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} MIV Word House. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
