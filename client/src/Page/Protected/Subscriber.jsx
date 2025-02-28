import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const Subscriber = () => {
  // State for subscribers and search, deletion confirmation
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  // State for tab navigation: "list" or "message"
  const [activeTab, setActiveTab] = useState("list");

  // State for broadcast message form
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]); // State for attached files
  const [broadcastStatus, setBroadcastStatus] = useState(null);

  // Fetch subscribers on mount
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get("/contact/email");
      setSubscribers(res.data);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  };

  // Delete subscriber function
  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== "delete") {
      alert("Type 'delete' to confirm.");
      return;
    }

    try {
      await axios.delete(`/contact/email/${deleteId}`);
      setSubscribers(subscribers.filter((sub) => sub._id !== deleteId));
      setDeleteId(null);
      setConfirmText("");
    } catch (error) {
      console.error("Error deleting subscriber:", error);
    }
  };

  // Filter subscribers based on search input
  const filteredSubscribers = subscribers.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase()) ||
    sub.email.toLowerCase().includes(search.toLowerCase())
  );

  // Handle file input changes
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Handle broadcast message form submission with file attachments
  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    setBroadcastStatus(null);

    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("body", body);
      // Append each file under the field name "files"
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      }

      const res = await axios.post(
        "/contact/sendSubscribeMessage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        setBroadcastStatus("Broadcast message sent successfully!");
        setSubject("");
        setBody("");
        setFiles([]);
      } else {
        setBroadcastStatus("There was an error sending the broadcast message.");
      }
    } catch (error) {
      console.error("Error sending broadcast message:", error);
      setBroadcastStatus("There was an error sending the broadcast message.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto">
        {/* Tabs Navigation */}
        <div className="flex flex-col sm:flex-row mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("list")}
            className={`py-3 px-6 text-center focus:outline-none ${
              activeTab === "list"
                ? "bg-gray-800 text-white border-b-2 border-blue-500"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Subscribers List
          </button>
          <button
            onClick={() => setActiveTab("message")}
            className={`py-3 px-6 text-center focus:outline-none ${
              activeTab === "message"
                ? "bg-gray-800 text-white border-b-2 border-blue-500"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Broadcast Message
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "list" && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-6">
              Subscribers List
            </h2>
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Subscribers Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-700 text-left text-gray-300">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.length > 0 ? (
                    filteredSubscribers.map((sub, index) => (
                      <motion.tr
                        key={sub._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border-b border-gray-700 hover:bg-gray-750 transition"
                      >
                        <td className="py-3 px-4">{sub.name}</td>
                        <td className="py-3 px-4">{sub.email}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setDeleteId(sub._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-4 text-gray-400"
                      >
                        No subscribers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "message" && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">
              Broadcast Message
            </h2>
            <form
              onSubmit={handleBroadcastSubmit}
              className="space-y-6 bg-gray-800 p-6 rounded-lg"
            >
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-300"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject (you can use {name})"
                  className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="body"
                  className="block text-sm font-medium text-gray-300"
                >
                  Body
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows="6"
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter message body (you can use {name})"
                  className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="files"
                  className="block text-sm font-medium text-gray-300"
                >
                  Attach Files (optional)
                </label>
                <input
                  type="file"
                  id="files"
                  name="files"
                  multiple
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-gray-300 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Broadcast
              </button>
              {broadcastStatus && (
                <p className="text-center text-sm mt-2 text-gray-300">
                  {broadcastStatus}
                </p>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
          >
            <h3 className="text-xl font-bold text-red-500 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 mb-2">
              Type <strong>delete</strong> to confirm:
            </p>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 border border-gray-500 focus:outline-none focus:border-red-500 mb-3"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Subscriber;
