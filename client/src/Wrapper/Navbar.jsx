import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react"; // Import ChevronDown for arrow icons
import Logo from "../assets/logo.png"; // Import the logo

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const menuItems = [
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
        { name: "Sermon Video", path: "/sermon-video" }, // New item added here
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
    { name: "Fellowship", path: "/fellowship" },
    {
      name: "Contact",
      dropdown: [
        { name: "Contact us", path: "/contact" },
        { name: "Pray for me", path: "/prayer" },
      ],
    },
    { name: "Store", path: "/store" },
    { name: "Give", path: "/give" },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Container */}
          <div className="flex-shrink-0">
            <a href="/">
              <img src={Logo} alt="Logo" className="h-10 w-auto" />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-end items-center space-x-4 lg:space-x-8 text-lg">
            {menuItems.map((item, index) =>
              item.dropdown ? (
                <div key={index} className="relative">
                  <button
                    className="hover:text-blue-600 transition flex items-center"
                    onClick={() => toggleDropdown(item.name)}
                  >
                    {item.name}
                    <ChevronDown
                      size={16}
                      className={`ml-1 transition-transform duration-200 ${
                        openDropdown === item.name ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg w-56 p-2"
                      >
                        {item.dropdown.map((subItem, i) => (
                          <a
                            key={i}
                            href={subItem.path}
                            className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  key={index}
                  href={item.path}
                  className="hover:text-blue-600 transition"
                >
                  {item.name}
                </a>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white shadow-md"
          >
            <div className="p-4 space-y-2">
              {menuItems.map((item, index) =>
                item.dropdown ? (
                  <div key={index}>
                    <button
                      className="w-full text-left font-medium flex items-center justify-between"
                      onClick={() => toggleDropdown(item.name)}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openDropdown === item.name ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="ml-4 space-y-1"
                        >
                          {item.dropdown.map((subItem, i) => (
                            <a
                              key={i}
                              href={subItem.path}
                              className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a key={index} href={item.path} className="block py-2">
                    {item.name}
                  </a>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
