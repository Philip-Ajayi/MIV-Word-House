import React from 'react';
import { motion } from 'framer-motion';

const Fellowship = () => {
  // Sample data for families and communities
  const families = [
    { name: "Agape Family" },
    { name: "Zoe Family" },
    { name: "Cornerstone Family" },
    { name: "Annointed Family" },
    { name: "Mercy Family" },
    { name: "Zion Family" },
    { name: "The Issachar Vision Student Fellowship" },
  ];

  const communities = [
    { name: "Sango Community", address: "" },
    { name: "Agbowo Community", address: "" },
    { name: "Apete Community", address: "" },
    { name: "Mokola Community", address: "" },
    { name: "Ojoo Community", address: "" },
    { name: "UI Community", address: "" },
    { name: "Eleyele Community", address: "" },
  ];

  // Fellowship groups data
  const fellowshipGroups = [
    {
      name: "Brothers Fellowship",
      description:
        "A dynamic group for unmarried men focused on spiritual growth, character development, and purpose-driven living. Through Bible study, mentorship, and fellowship, members prepare for their future roles in marriage, ministry, and leadership. The fellowship fosters accountability, brotherhood, and a strong commitment to faith.",
      image: "https://i.ibb.co/jvN7xQ5H/20241110-092529-1.jpg",
    },
    {
      name: "Sisters Fellowship",
      description:
        "A vibrant gathering of single women seeking to grow in faith, wisdom, and purpose. Through prayer, encouragement, and community service, members support one another in their spiritual and personal journeys. The fellowship equips women to live with confidence and devotion as they navigate their season of singleness.",
      image: "https://i.ibb.co/Xx7fPfyJ/20241110-091112.jpg",
    },
    {
      name: "Mens Fellowship",
      description:
        "This fellowship is for married men seeking to grow spiritually and lead their families with wisdom and faith. Through prayer, Bible study, and mentorship, members support one another in their roles as husbands, fathers, and community leaders. Together, they strive to strengthen their homes and make a positive impact in the church and beyond.",
      image: "https://i.ibb.co/sJ9xmVzS/20241110-092600-1.jpg",
    },
    {
      name: "Women Fellowship",
      description:
        "A community of married women committed to deepening their faith and nurturing strong, God-centered families. Members encourage one another through prayer, fellowship, and discussions on biblical womanhood and family life. They also engage in outreach programs to support the church and the wider community.",
      image: "https://i.ibb.co/d02w6hZb/20241110-092753-1.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Introductory Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Our Fellowship
          </h1>
          <p className="text-lg md:text-xl text-gray-800 mx-auto max-w-3xl" style={{ textAlign: 'justify' }}>
            At our church, we believe in the power of community and fellowship. Through various groups, families, and community gatherings, we come together to celebrate our faith, share our experiences, and grow spiritually. Explore our different fellowship opportunities below.
          </p>
        </motion.div>

        {/* Fellowship Groups Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 border-b-4 border-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 inline-block pb-2">
            Fellowship Groups
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fellowshipGroups.map((group, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl"
              >
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {group.name}
                  </h3>
                  <p className="text-gray-600" style={{ textAlign: 'justify' }}>
                    {group.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Family Gatherings Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 border-b-4 border-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 inline-block pb-2">
            Family Gatherings
          </h2>
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-8 transform transition-all duration-500 hover:scale-105">
            <p className="text-gray-800 text-lg mb-6" style={{ textAlign: 'justify' }}>
              Our family gatherings provide a nurturing environment where families meet to pray and discuss life's challenges and joys. Every family group shares the same agenda: to support one another, grow in faith, and build stronger bonds through open discussion and prayer.
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Family Groups:
            </h3>
            <ul className="list-disc pl-5 text-gray-700 text-lg">
              {families.map((family, index) => (
                <li key={index} className="mb-2">
                  {family.name}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Community Bible Study Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 border-b-4 border-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 inline-block pb-2">
            Community Bible Study
          </h2>
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-8 transform transition-all duration-500 hover:scale-105">
            <p className="text-gray-800 text-lg mb-6" style={{ textAlign: 'justify' }}>
              Every Tuesday, our community Bible study sessions bring together members based on geographical locations. Join us to explore God’s word, share insights, and grow together in a supportive environment.
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Communities:
            </h3>
            <ul className="list-disc pl-5 text-gray-700 text-lg">
              {communities.map((community, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{community.name}</span>
                  {community.address && ` - ${community.address}`}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Fellowship;
