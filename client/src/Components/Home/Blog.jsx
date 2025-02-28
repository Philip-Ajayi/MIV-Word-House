import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";

// Helper to remove HTML tags and truncate text.
const truncateText = (text, maxLength) => {
  if (!text) return "";
  const plainText = text.replace(/<\/?[^>]+(>|$)/g, "");
  return plainText.length <= maxLength ? plainText : plainText.substring(0, maxLength) + "...";
};

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numSlices, setNumSlices] = useState(3);

  useEffect(() => {
    const updateNumSlices = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setNumSlices(3);
      } else if (width >= 640 && width < 1024) {
        setNumSlices(4);
      } else {
        setNumSlices(3);
      }
    };

    updateNumSlices();
    window.addEventListener("resize", updateNumSlices);
    return () => window.removeEventListener("resize", updateNumSlices);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/blog/blogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center py-8">Loading blogs...</p>;

  return (
    <section className="w-full py-12 bg-gradient-to-r from-purple-500 to-purple-300 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Blogs</h2>
          <Link to="/blog" className="text-yellow-300 hover:underline font-medium">
            See More
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length === 0 ? (
            <p className="text-center col-span-full text-white">No blogs available</p>
          ) : (
            blogs.slice(0, numSlices).map((blog) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <img
                  src={blog.image || "https://source.unsplash.com/random/800x600?blog"}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-purple-900">{blog.title}</h3>
                  <p className="text-purple-800">{truncateText(blog.body, 100)}</p>
                  <Link
                    to={`/blog/${blog._id}`}
                    className="inline-block mt-3 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Read More
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
