import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';
import axios from 'axios'; // Added for the RSS tab
import 'react-quill/dist/quill.snow.css';

// ReactQuill toolbar configuration to include subscript, superscript, quote, alignment, and multilevel numbering
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['clean']
  ]
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'script',
  'blockquote',
  'list', 'bullet', 'indent',
  'align'
];

const BlogAdmin = () => {
  // Tab state: "create", "list", or "rss"
  const [activeTab, setActiveTab] = useState('create');

  // Form state for creating a blog post
  const [blogForm, setBlogForm] = useState({
    title: '',
    image: '',
    category: '',
    body: '',
    author: '',
    date: '',
  });

  // Suggestions for category and author fetched from the API
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  // Blogs list state for the "List Blogs" tab
  const [blogs, setBlogs] = useState([]);

  // Filtering states for the List tab
  const [dateFilter, setDateFilter] = useState('');
  const [keyword, setKeyword] = useState('');

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Submission flag to prevent multiple submissions
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories and authors on mount
  useEffect(() => {
    fetchCategories();
    fetchAuthors();
  }, []);

  // When "List Blogs" tab is active, fetch blogs
  useEffect(() => {
    if (activeTab === 'list') {
      fetchBlogs();
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/blog/categories'); // Adjust URL if needed
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await fetch('/blog/authors'); // Adjust URL if needed
      const data = await res.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/blog/blogs'); // Adjust URL if needed
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  // Handle input changes for the create form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle ReactQuill changes for the create form
  const handleBodyChange = (value) => {
    setBlogForm((prev) => ({
      ...prev,
      body: value,
    }));
  };

  // Handle form submission for creating a blog
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/blog/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogForm),
      });
      if (!res.ok) {
        throw new Error('Failed to create blog');
      }
      await res.json();
      alert('Blog created successfully!');
      // Reset form after submission
      setBlogForm({
        title: '',
        image: '',
        category: '',
        body: '',
        author: '',
        date: '',
      });
    } catch (error) {
      console.error(error);
      alert('Error creating blog');
    }
    setSubmitting(false);
  };

  // Handle deletion of a blog
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const res = await fetch(`/blog/blogs/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error('Failed to delete blog');
        }
        fetchBlogs();
      } catch (error) {
        console.error(error);
        alert('Error deleting blog');
      }
    }
  };

  // Open the edit modal with the selected blog prefilled
  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setEditModalOpen(true);
  };

  // Handle changes for the edit modal inputs
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditBodyChange = (value) => {
    setEditingBlog((prev) => ({
      ...prev,
      body: value,
    }));
  };

  // Submit the updated blog
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/blog/blogs/${editingBlog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBlog),
      });
      if (!res.ok) {
        throw new Error('Failed to update blog');
      }
      await res.json();
      alert('Blog updated successfully!');
      setEditModalOpen(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error(error);
      alert('Error updating blog');
    }
  };

  // Filtering for "List Blogs": filter blogs by date (YYYY-MM-DD) and keyword (in title or body)
  const filteredBlogs = blogs.filter(blog => {
    let matchesDate = true;
    let matchesKeyword = true;
    if (dateFilter) {
      const blogDate = new Date(blog.date).toISOString().split('T')[0];
      matchesDate = blogDate === dateFilter;
    }
    if (keyword) {
      matchesKeyword =
        blog.title.toLowerCase().includes(keyword.toLowerCase()) ||
        (blog.body && blog.body.toLowerCase().includes(keyword.toLowerCase()));
    }
    return matchesDate && matchesKeyword;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Tab Navigation */}
      <div className="mb-4 border-b">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 focus:outline-none ${
              activeTab === 'create'
                ? 'border-b-2 border-blue-500 font-semibold'
                : 'text-gray-600'
            }`}
          >
            Create Blog
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 focus:outline-none ${
              activeTab === 'list'
                ? 'border-b-2 border-blue-500 font-semibold'
                : 'text-gray-600'
            }`}
          >
            List Blogs
          </button>
          <button
            onClick={() => setActiveTab('rss')}
            className={`px-4 py-2 focus:outline-none ${
              activeTab === 'rss'
                ? 'border-b-2 border-blue-500 font-semibold'
                : 'text-gray-600'
            }`}
          >
            RSS Admin
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'create' && (
        <div>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={blogForm.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type="text"
                name="image"
                value={blogForm.image}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input
                list="categorySuggestions"
                type="text"
                name="category"
                value={blogForm.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              <datalist id="categorySuggestions">
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium">Body</label>
              <ReactQuill
                theme="snow"
                value={blogForm.body}
                onChange={handleBodyChange}
                modules={quillModules}
                formats={quillFormats}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Author</label>
              <input
                list="authorSuggestions"
                type="text"
                name="author"
                value={blogForm.author}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              <datalist id="authorSuggestions">
                {authors.map((author, idx) => (
                  <option key={idx} value={author} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={blogForm.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              {submitting ? 'Submitting...' : 'Create Blog'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div>
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="flex space-x-4">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
                placeholder="Filter by Date"
              />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
                placeholder="Search by keyword"
              />
            </div>
            <button
              onClick={() => {
                setDateFilter('');
                setKeyword('');
              }}
              className="text-blue-500 underline"
            >
              Clear Filters
            </button>
          </div>

          {/* Blogs Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{blog.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(blog.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rss' && <RssAdminTab />}

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalOpen && editingBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ y: '-100vh' }}
              animate={{ y: 0 }}
              exit={{ y: '100vh' }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-full overflow-y-auto p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Edit Blog</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editingBlog.title}
                    onChange={handleEditChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={editingBlog.image}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <input
                    list="categorySuggestions"
                    type="text"
                    name="category"
                    value={editingBlog.category}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                  <datalist id="categorySuggestions">
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium">Body</label>
                  <ReactQuill
                    theme="snow"
                    value={editingBlog.body}
                    onChange={handleEditBodyChange}
                    modules={quillModules}
                    formats={quillFormats}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Author</label>
                  <input
                    list="authorSuggestions"
                    type="text"
                    name="author"
                    value={editingBlog.author}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                  <datalist id="authorSuggestions">
                    {authors.map((author, idx) => (
                      <option key={idx} value={author} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editingBlog.date ? editingBlog.date.split('T')[0] : ''}
                    onChange={handleEditChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditModalOpen(false);
                      setEditingBlog(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Update Blog
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Inner component for the RSS Admin tab
const RssAdminTab = () => {
  // State to store blogs and the search keyword
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch all blogs from the API using axios
  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  // Filter blogs by title (you can extend this logic as needed)
  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    return blog.title.toLowerCase().includes(query);
  });

  return (
    <div className="container mx-auto p-4">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBlogs.map((blog) => (
              <tr key={blog._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {blog.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(blog.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {blog.uniqueIps ? blog.uniqueIps.length : 0}
                </td>
              </tr>
            ))}
            {filteredBlogs.length === 0 && (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan="3">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogAdmin;
