import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SermonAdmin = () => {
  // Tab control
  const [activeTab, setActiveTab] = useState('create');

  // Suggestions for form fields (fetched from the backend)
  const [speakers, setSpeakers] = useState([]);
  const [seriesList, setSeriesList] = useState([]);

  // Sermons list (for Manage tab)
  const [sermons, setSermons] = useState([]);

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: '',
    date: '',
    speaker: '',
    series: '',
    thumbnail: null,
    audioFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // List filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    date: '',
    speaker: '',
    series: '',
    thumbnail: null,
    audioFile: null,
  });

  // Fetch suggestions and sermons on mount
  useEffect(() => {
    fetch('/sermon/speakers')
      .then((res) => res.json())
      .then((data) => setSpeakers(data))
      .catch((err) => console.error('Error fetching speakers:', err));

    fetch('/sermon/series')
      .then((res) => res.json())
      .then((data) => setSeriesList(data))
      .catch((err) => console.error('Error fetching series:', err));

    fetchSermons();
  }, []);

  const fetchSermons = () => {
    fetch('/sermon/items')
      .then((res) => res.json())
      .then((data) => setSermons(data))
      .catch((err) => console.error('Error fetching sermons:', err));
  };

  // === CREATE TAB HANDLERS ===
  const handleCreateChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCreateForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setCreateForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', createForm.name);
    formData.append('date', createForm.date);
    formData.append('speaker', createForm.speaker);
    formData.append('series', createForm.series);
    if (createForm.thumbnail) formData.append('thumbnail', createForm.thumbnail);
    if (createForm.audioFile) formData.append('audioFile', createForm.audioFile);

    try {
      const res = await fetch('/sermon/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to create sermon');
      alert('Sermon created successfully!');
      // Reset form after successful submission (only once)
      setCreateForm({
        name: '',
        date: '',
        speaker: '',
        series: '',
        thumbnail: null,
        audioFile: null,
      });
      fetchSermons();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    setIsSubmitting(false);
  };

  // === MANAGE TAB HANDLERS ===
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sermon?')) {
      try {
        const res = await fetch(`/sermon/items/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete sermon');
        alert('Sermon deleted successfully!');
        fetchSermons();
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditForm({
      name: item.name,
      date: new Date(item.date).toISOString().substring(0, 10),
      speaker: item.speaker,
      series: item.series,
      thumbnail: null, // optional new file
      audioFile: null, // optional new file
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setEditForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', editForm.name);
    formData.append('date', editForm.date);
    formData.append('speaker', editForm.speaker);
    formData.append('series', editForm.series);
    if (editForm.thumbnail) formData.append('thumbnail', editForm.thumbnail);
    if (editForm.audioFile) formData.append('audioFile', editForm.audioFile);

    try {
      const res = await fetch(`/sermon/edit/${editItem._id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update sermon');
      alert('Sermon updated successfully!');
      setEditModalOpen(false);
      fetchSermons();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // === FILTERING FOR MANAGE TAB ===
  const filteredSermons = sermons.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter
      ? new Date(item.date).toISOString().substring(0, 10) === dateFilter
      : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Tab Navigation */}
      <div className="mb-4 flex border-b">
        <button
          className={`px-4 py-2 -mb-px font-semibold ${
            activeTab === 'create'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('create')}
        >
          Create Sermon
        </button>
        <button
          className={`px-4 py-2 -mb-px font-semibold ${
            activeTab === 'list'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Manage Sermons
        </button>
      </div>

      <AnimatePresence exitBeforeEnter>
        {activeTab === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={createForm.date}
                  onChange={handleCreateChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Speaker
                </label>
                <input
                  type="text"
                  name="speaker"
                  value={createForm.speaker}
                  onChange={handleCreateChange}
                  list="speakersList"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
                <datalist id="speakersList">
                  {speakers.map((s, index) => (
                    <option key={index} value={s} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Series
                </label>
                <input
                  type="text"
                  name="series"
                  value={createForm.series}
                  onChange={handleCreateChange}
                  list="seriesList"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
                <datalist id="seriesList">
                  {seriesList.map((s, index) => (
                    <option key={index} value={s} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thumbnail
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleCreateChange}
                  className="mt-1 block w-full"
                  accept="image/*"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Audio File
                </label>
                <input
                  type="file"
                  name="audioFile"
                  onChange={handleCreateChange}
                  className="mt-1 block w-full"
                  accept="audio/*"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Sermon'}
              </button>
            </form>
          </motion.div>
        )}

        {activeTab === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by name, series, speaker"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded p-2 flex-1"
              />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded p-2"
              />
            </div>

            {/* Responsive Sermons Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Series</th>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSermons.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-2 border">{item.name}</td>
                      <td className="px-4 py-2 border">{item.series}</td>
                      <td className="px-4 py-2 border">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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

      {/* === EDIT MODAL === */}
      <AnimatePresence>
        {editModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg w-full max-w-lg mx-4 overflow-y-auto max-h-full p-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-4">Edit Sermon</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Speaker
                  </label>
                  <input
                    type="text"
                    name="speaker"
                    value={editForm.speaker}
                    onChange={handleEditChange}
                    list="editSpeakersList"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                  <datalist id="editSpeakersList">
                    {speakers.map((s, index) => (
                      <option key={index} value={s} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Series
                  </label>
                  <input
                    type="text"
                    name="series"
                    value={editForm.series}
                    onChange={handleEditChange}
                    list="editSeriesList"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                  <datalist id="editSeriesList">
                    {seriesList.map((s, index) => (
                      <option key={index} value={s} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thumbnail
                  </label>
                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handleEditChange}
                    className="mt-1 block w-full"
                    accept="image/*"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Audio File
                  </label>
                  <input
                    type="file"
                    name="audioFile"
                    onChange={handleEditChange}
                    className="mt-1 block w-full"
                    accept="audio/*"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Save Changes
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

export default SermonAdmin;
