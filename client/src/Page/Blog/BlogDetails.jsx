import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import 'react-quill/dist/quill.bubble.css';

// Utility function to strip HTML tags and truncate text.
const getSummary = (html, maxLength = 100) => {
  const plainText = html.replace(/<[^>]+>/g, '');
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
};

const BlogDetails = () => {
  const { id } = useParams();

  // State for the current blog details.
  const [blog, setBlog] = useState(null);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [blogError, setBlogError] = useState(null);

  // State for recent posts.
  const [recentPosts, setRecentPosts] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // Fetch the current blog details.
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/blog/blogs/${id}`);
        setBlog(response.data.blog || response.data);
        setLoadingBlog(false);
      } catch (err) {
        setBlogError('Failed to fetch blog details.');
        setLoadingBlog(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Fetch recent posts.
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get('/blog/blogs');
        const allPosts = response.data;
        const filteredPosts = allPosts.filter(
          (post) => String(post._id) !== String(id)
        );
        setRecentPosts(filteredPosts.slice(0, 3));
        setLoadingRecent(false);
      } catch (err) {
        console.error('Failed to fetch posts', err);
        setLoadingRecent(false);
      }
    };

    fetchRecentPosts();
  }, [id]);

  if (loadingBlog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600 text-lg lg:text-xl">Loading...</div>
      </div>
    );
  }

  if (blogError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 text-lg lg:text-xl">{blogError}</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600 text-lg lg:text-xl">Blog not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blog Details Section */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
              />
            )}
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                {blog.title}
              </h1>
              <div className="mb-4">
                <span className="inline-block bg-blue-200 text-blue-800 text-xs lg:text-sm px-2 py-1 rounded-full">
                  {blog.category}
                </span>
              </div>
              <div className="text-sm lg:text-base text-gray-500 mb-6">
                <span>
                  By <span className="font-medium">{blog.author}</span>
                </span>
                <span className="mx-2">|</span>
                <span>{new Date(blog.date).toLocaleDateString()}</span>
              </div>
              <div className="text-gray-700 text-base lg:text-lg leading-relaxed">
                {/* Render the blog body with dangerouslySetInnerHTML.
                    Wrapping in a container with class "ql-editor" applies Quill's styles. */}
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: blog.body }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">
                Recent Posts
              </h2>
              {loadingRecent ? (
                <p className="text-gray-600 text-base lg:text-lg">
                  Loading recent posts...
                </p>
              ) : recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div key={post._id} className="mb-6">
                    <div className="flex items-center">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                      )}
                      <div>
                        <Link
                          to={`/blogs/${post._id}`}
                          className="text-lg lg:text-xl font-semibold text-gray-800 hover:underline"
                        >
                          {post.title}
                        </Link>
                        <div className="text-sm lg:text-base text-gray-500">
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700 text-sm lg:text-base">
                      {getSummary(post.body, 100)}
                    </p>
                    <Link
                      to={`/blog/${post._id}`}
                      className="text-blue-500 hover:underline text-sm lg:text-base mt-1 inline-block"
                    >
                      See More
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-base lg:text-lg">
                  No recent posts available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
