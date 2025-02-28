import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion, AnimatePresence } from 'framer-motion';

const DevAdmin = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [formData, setFormData] = useState({
    date: '',
    topic: '',
    speaker: '',
    content: '',
  });

  const [devotionals, setDevotionals] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    date: '',
    topic: '',
    speaker: '',
    content: '',
  });

  // ** Fetch devotionals and extract unique speakers **
  useEffect(() => {
    fetch('/devotional/contents')
      .then((res) => res.json())
      .then((data) => {
        setDevotionals(data);
        const uniqueSpeakers = [...new Set(data.map((item) => item.speaker))];
        setSpeakers(uniqueSpeakers);
      })
      .catch((err) => console.error('Error fetching devotionals:', err));
  }, []);

  // ** Handle form submission (CREATE) **
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/devotional/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newDevotional = await response.json();
      setDevotionals([...devotionals, newDevotional.data]);
      setFormData({ date: '', topic: '', speaker: '', content: '' });
    } catch (err) {
      console.error('Error creating devotional:', err);
    }
  };

  // ** Open edit modal **
  const openEditModal = (index) => {
    setEditIndex(index);
    setEditData(devotionals[index]);
    setShowModal(true);
  };

  // ** Handle edit save (UPDATE) **
  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/devotional/update/${devotionals[editIndex]._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      const updatedDevotional = await response.json();
      const updatedList = devotionals.map((item, i) => (i === editIndex ? updatedDevotional.data : item));
      setDevotionals(updatedList);
      setShowModal(false);
    } catch (err) {
      console.error('Error updating devotional:', err);
    }
  };

  // ** Handle delete (DELETE) **
  const handleDelete = async (index) => {
    try {
      await fetch(`/devotional/delete/${devotionals[index]._id}`, { method: 'DELETE' });
      setDevotionals(devotionals.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting devotional:', err);
    }
  };
  // ReactQuill modules & formats including justify/align, superscript, subscript and strike-through
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ script: 'sub' }, { script: 'super' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'script',
    'align',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'link',
    'image',
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="md:w-1/4 border-r">
            <nav className="flex md:flex-col">
              <button
                onClick={() => setActiveTab('create')}
                className={`${
                  activeTab === 'create'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-blue-500'
                } flex-1 py-2 px-4 border-b md:border-b-0 md:border-r transition-colors`}
              >
                Create Devotional
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`${
                  activeTab === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-blue-500'
                } flex-1 py-2 px-4 transition-colors`}
              >
                Devotional List
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4 p-4">
            <AnimatePresence exitBeforeEnter>
              {activeTab === 'create' && (
                <motion.div
                  key="create"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-semibold mb-4">
                    Create Devotional
                  </h2>
                  <form onSubmit={handleSubmit}>
                    {/* Date Field */}
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full border rounded p-2"
                        required
                      />
                    </div>
                    {/* Topic Field */}
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">Topic</label>
                      <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) =>
                          setFormData({ ...formData, topic: e.target.value })
                        }
                        placeholder="Enter topic"
                        className="w-full border rounded p-2"
                        required
                      />
                    </div>
                    {/* Speaker Field with suggestions */}
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">Anchor Scripture</label>
                      <input
                        type="text"
                        value={formData.speaker}
                        onChange={(e) =>
                          setFormData({ ...formData, speaker: e.target.value })
                        }
                        placeholder="Enter speaker name"
                        className="w-full border rounded p-2"
                        list="speaker-suggestions"
                        required
                      />
                      <datalist id="speaker-suggestions">
                        {speakers.map((sp, idx) => (
                          <option key={idx} value={sp} />
                        ))}
                      </datalist>
                    </div>
                    {/* Content Field using ReactQuill with extra formatting options */}
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">
                        Content
                      </label>
                      <ReactQuill
                        value={formData.content}
                        onChange={(value) =>
                          setFormData({ ...formData, content: value })
                        }
                        modules={modules}
                        formats={formats}
                        className="bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Submit
                    </button>
                  </form>
                </motion.div>
              )}
              {activeTab === 'list' && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-semibold mb-4">
                    Devotional List
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="px-4 py-2 border">Topic</th>
                          <th className="px-4 py-2 border">Date</th>
                          <th className="px-4 py-2 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {devotionals.map((dev, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{dev.topic}</td>
                            <td className="px-4 py-2 border">{dev.date}</td>
                            <td className="px-4 py-2 border flex space-x-2">
                              <button
                                onClick={() => openEditModal(index)}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(index)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Scrollable Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-xl font-semibold mb-4">Edit Devotional</h2>
              <form onSubmit={handleEditSave}>
                {/* Date Field */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                {/* Topic Field */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={editData.topic}
                    onChange={(e) =>
                      setEditData({ ...editData, topic: e.target.value })
                    }
                    placeholder="Enter topic"
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                {/* Speaker Field */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Anchor Scripture</label>
                  <input
                    type="text"
                    value={editData.speaker}
                    onChange={(e) =>
                      setEditData({ ...editData, speaker: e.target.value })
                    }
                    placeholder="Enter speaker name"
                    className="w-full border rounded p-2"
                    list="speaker-suggestions-edit"
                    required
                  />
                  <datalist id="speaker-suggestions-edit">
                    {speakers.map((sp, idx) => (
                      <option key={idx} value={sp} />
                    ))}
                  </datalist>
                </div>
                {/* Content Field using ReactQuill with extra formatting options */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Content
                  </label>
                  <ReactQuill
                    value={editData.content}
                    onChange={(value) =>
                      setEditData({ ...editData, content: value })
                    }
                    modules={modules}
                    formats={formats}
                    className="bg-white"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Save
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

export default DevAdmin;
