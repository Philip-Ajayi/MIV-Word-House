import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";

// Helper function to strip HTML tags and truncate text.
const truncateText = (text, maxLength) => {
  if (!text) return "";
  const plainText = text.replace(/<\/?[^>]+(>|$)/g, "");
  return plainText.length <= maxLength
    ? plainText
    : plainText.substr(0, maxLength) + "...";
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Updated ITEMS_PER_LOAD to 10
  const ITEMS_PER_LOAD = 10;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/blog/blogs"); // Update URL if needed
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
  }, [selectedCategory]);

  if (loading)
    return <p className="text-center py-8 text-xl">Loading blogs...</p>;
  if (blogs.length === 0)
    return <p className="text-center py-8 text-xl">No blogs found</p>;

  const headline = blogs[0];
  const uniqueCategories = Array.from(new Set(blogs.map((post) => post.category)));
  const categories = ["All", ...uniqueCategories];

  const allFilteredPosts =
    selectedCategory === "All"
      ? blogs.slice(1)
      : blogs.slice(1).filter((post) => post.category === selectedCategory);

  const filteredPosts = allFilteredPosts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + ITEMS_PER_LOAD);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Headline Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative overflow-hidden rounded-lg shadow-lg"
      >
        <img
          src={headline.image || "https://source.unsplash.com/random/800x600?blog"}
          alt={headline.title}
          className="w-full h-80 lg:h-[32rem] object-cover transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl lg:text-5xl font-bold drop-shadow-lg">{headline.title}</h1>
          <p className="mt-4 max-w-lg text-lg lg:text-xl drop-shadow-sm">
            {truncateText(headline.body, 150)}
          </p>
          <Link
            to={`/blog/${headline._id}`}
            className="inline-block mt-4 px-6 py-3 border border-blue-400 text-blue-400 font-medium rounded-full hover:bg-blue-400 hover:text-white transition-colors duration-300"
          >
            See More
          </Link>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts Section */}
        <div className="lg:col-span-2">
          {/* Category Filter */}
          <div className="mb-6 flex space-x-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full whitespace-nowrap text-lg font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={post.image || "https://source.unsplash.com/random/800x600?blog"}
                  alt={post.title}
                  className="w-full h-56 lg:h-72 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-700 text-lg">{truncateText(post.body, 100)}</p>
                  <Link
                    to={`/blog/${post._id}`}
                    className="inline-block mt-4 text-blue-500 font-medium hover:underline text-lg"
                  >
                    See More
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* "See More" Button */}
          {visibleCount < allFilteredPosts.length && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 text-lg"
              >
                See More
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-100 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Categories</h3>
            <ul>
              {uniqueCategories.map((cat) => (
                <li key={cat} className="mb-3">
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className="text-blue-600 font-medium hover:underline text-lg"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-6">Recent Posts</h3>
              <ul>
                {blogs.slice(1, 4).map((post) => (
                  <li key={post._id} className="mb-3">
                    <Link
                      to={`/blog/${post._id}`}
                      className="text-gray-800 font-medium hover:underline text-lg"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
