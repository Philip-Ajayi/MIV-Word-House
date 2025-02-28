import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EventAdmin = () => {
  // Tab state: "create" or "list"
  const [activeTab, setActiveTab] = useState('create');

  // Form state for creating a new event (added venue)
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    venue: '',
    startDate: '',
    endDate: '',
    time: '',
    description: '',
    registrationLink: '',
    televised: false,
    televisedLink: '',
  });

  // List of events fetched from the API
  const [events, setEvents] = useState([]);

  // State for the event being edited and modal visibility
  const [editingEvent, setEditingEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch events from the server (GET /events)
  const fetchEvents = async () => {
    try {
      const res = await fetch('/event/events'); // Adjust your API URL or proxy if needed
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // When switching to list tab, load events
  useEffect(() => {
    if (activeTab === 'list') {
      fetchEvents();
    }
  }, [activeTab]);

  // Handle input change for the create event form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle submit for creating an event (POST /events)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/event/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('Event created successfully!');
        setFormData({
          image: '',
          title: '',
          venue: '',
          startDate: '',
          endDate: '',
          time: '',
          description: '',
          registrationLink: '',
          televised: false,
          televisedLink: '',
        });
      } else {
        alert('Error creating event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    }
  };

  // Handle deletion of an event (DELETE /events/:id)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const res = await fetch(`/event/events/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setEvents(events.filter((event) => event._id !== id));
        } else {
          alert('Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  // Open the edit modal with a prefilled event
  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingEvent((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit the edited event (PUT /events/:id)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/event/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent),
      });
      if (res.ok) {
        alert('Event updated successfully!');
        fetchEvents();
        setIsModalOpen(false);
        setEditingEvent(null);
      } else {
        alert('Error updating event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Dashboard Container */}
      <div className="bg-white shadow rounded-lg">
        {/* Tabs Navigation */}
        <div className="border-b">
          <nav className="flex">
            <button
              className={`px-4 py-2 focus:outline-none ${
                activeTab === 'create' ? 'border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveTab('create')}
            >
              Create Event
            </button>
            <button
              className={`px-4 py-2 focus:outline-none ${
                activeTab === 'list' ? 'border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveTab('list')}
            >
              List Events
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'create' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Venue */}
              <div>
                <label className="block text-sm font-medium">Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Event Venue"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Start Date & End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
              {/* Time */}
              <div>
                <label className="block text-sm font-medium">Time</label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="10:00 AM - 2:00 PM"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Registration Link */}
              <div>
                <label className="block text-sm font-medium">
                  Registration Link
                </label>
                <input
                  type="url"
                  name="registrationLink"
                  value={formData.registrationLink}
                  onChange={handleChange}
                  placeholder="https://example.com/register"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Televised */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="televised"
                  checked={formData.televised}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium">Televised</label>
              </div>
              {/* Televised Link (conditionally shown) */}
              {formData.televised && (
                <div>
                  <label className="block text-sm font-medium">
                    Televised Link
                  </label>
                  <input
                    type="url"
                    name="televisedLink"
                    value={formData.televisedLink}
                    onChange={handleChange}
                    placeholder="https://example.com/watch"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Create Event
              </button>
            </form>
          )}

          {activeTab === 'list' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(event.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
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
          )}
        </div>
      </div>

      {/* Edit Modal using Framer Motion */}
      <AnimatePresence>
        {isModalOpen && editingEvent && (
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
              <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={editingEvent.image}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editingEvent.title}
                    onChange={handleEditChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                {/* Venue */}
                <div>
                  <label className="block text-sm font-medium">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    value={editingEvent.venue || ''}
                    onChange={handleEditChange}
                    placeholder="Event Venue"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                {/* Start & End Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={editingEvent.startDate.split('T')[0]}
                      onChange={handleEditChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={
                        editingEvent.endDate
                          ? editingEvent.endDate.split('T')[0]
                          : ''
                      }
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
                {/* Time */}
                <div>
                  <label className="block text-sm font-medium">Time</label>
                  <input
                    type="text"
                    name="time"
                    value={editingEvent.time}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={editingEvent.description}
                    onChange={handleEditChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                {/* Registration Link */}
                <div>
                  <label className="block text-sm font-medium">
                    Registration Link
                  </label>
                  <input
                    type="url"
                    name="registrationLink"
                    value={editingEvent.registrationLink}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                {/* Televised */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="televised"
                    checked={editingEvent.televised}
                    onChange={handleEditChange}
                    className="h-4 w-4"
                  />
                  <label className="text-sm font-medium">Televised</label>
                </div>
                {/* Televised Link */}
                {editingEvent.televised && (
                  <div>
                    <label className="block text-sm font-medium">
                      Televised Link
                    </label>
                    <input
                      type="url"
                      name="televisedLink"
                      value={editingEvent.televisedLink}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                )}
                {/* Modal Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingEvent(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Update Event
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

export default EventAdmin;
