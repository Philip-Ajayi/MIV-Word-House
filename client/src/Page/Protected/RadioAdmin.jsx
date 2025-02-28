import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function RadioAdmin() {
  // Define activeTab for tab navigation
  const [activeTab, setActiveTab] = useState(0);

  // *************** SCHEDULE STATES ***************
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleDescription, setScheduleDescription] = useState("");
  const [scheduleImage, setScheduleImage] = useState(""); // Image URL for create
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleOffset, setScheduleOffset] = useState(""); // e.g., "+1" or "-5"
  const [schedules, setSchedules] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editScheduleName, setEditScheduleName] = useState("");
  const [editScheduleDescription, setEditScheduleDescription] = useState("");
  const [editScheduleImage, setEditScheduleImage] = useState(""); // Image URL for edit
  const [editScheduleTime, setEditScheduleTime] = useState("");
  const [editScheduleOffset, setEditScheduleOffset] = useState("");

  // *************** CHAT SESSION STATES ***************
  const [chatStartTime, setChatStartTime] = useState("");
  const [chatEndTime, setChatEndTime] = useState("");
  const [chatOffset, setChatOffset] = useState(""); // e.g., "+1" or "-5"
  const [chatSessions, setChatSessions] = useState([]);
  const [editingChat, setEditingChat] = useState(null);
  const [editChatStartTime, setEditChatStartTime] = useState("");
  const [editChatEndTime, setEditChatEndTime] = useState("");
  const [editChatOffset, setEditChatOffset] = useState("");

  // *************** FETCH DATA ***************
  useEffect(() => {
    fetchSchedules();
    fetchChatSessions();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch("/radio/schedule/all");
      const data = await res.json();
      setSchedules(data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const fetchChatSessions = async () => {
    try {
      const res = await fetch("/radio/chatsession/all");
      const data = await res.json();
      setChatSessions(data);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    }
  };

  // Helper function to format a numeric offset into ISO format (e.g., "+01:00")
  const formatOffset = (offsetInput) => {
    let num = parseInt(offsetInput, 10);
    if (isNaN(num)) num = 0;
    const sign = num >= 0 ? "+" : "-";
    const abs = Math.abs(num).toString().padStart(2, "0");
    return `${sign}${abs}:00`;
  };

  // Helper to convert a stored UTC time to the original local datetime string using its offset
  const convertUTCToLocal = (utcDateStr, timeZone) => {
    if (!utcDateStr || !timeZone) return "";
    const utcDate = new Date(utcDateStr);
    // timeZone is expected in the format "+01:00" or "-05:00"
    const sign = timeZone[0] === "+" ? 1 : -1;
    const hours = parseInt(timeZone.slice(1, 3), 10);
    const minutes = parseInt(timeZone.slice(4, 6), 10);
    const totalMinutes = sign * (hours * 60 + minutes);
    const localDate = new Date(utcDate.getTime() + totalMinutes * 60 * 1000);
    const pad = (n) => n.toString().padStart(2, "0");
    const year = localDate.getFullYear();
    const month = pad(localDate.getMonth() + 1);
    const day = pad(localDate.getDate());
    const hour = pad(localDate.getHours());
    const minute = pad(localDate.getMinutes());
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  // *************** SCHEDULE HANDLERS ***************
  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    const offsetStr = formatOffset(scheduleOffset);
    // Append the offset to the datetime-local string then convert to ISO
    const scheduleTimeISO = new Date(scheduleTime + offsetStr).toISOString();
    const payload = {
      name: scheduleName,
      description: scheduleDescription,
      image: scheduleImage, // Include image URL if provided
      scheduleTime: scheduleTimeISO,
      timeZone: offsetStr,
    };
    try {
      await fetch("/radio/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchSchedules();
      setScheduleName("");
      setScheduleDescription("");
      setScheduleImage("");
      setScheduleTime("");
      setScheduleOffset("");
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  const handleEditSchedule = async (e) => {
    e.preventDefault();
    const offsetStr = formatOffset(editScheduleOffset);
    const scheduleTimeISO = new Date(editScheduleTime + offsetStr).toISOString();
    const payload = {
      name: editScheduleName,
      description: editScheduleDescription,
      image: editScheduleImage, // Include image URL in update
      scheduleTime: scheduleTimeISO,
      timeZone: offsetStr,
    };
    try {
      await fetch(`/radio/schedule/${editingSchedule._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchSchedules();
      setEditingSchedule(null);
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      await fetch(`/radio/schedule/${id}`, { method: "DELETE" });
      fetchSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  // *************** CHAT SESSION HANDLERS ***************
  const handleCreateChatSession = async (e) => {
    e.preventDefault();
    const offsetStr = formatOffset(chatOffset);
    const startTimeISO = new Date(chatStartTime + offsetStr).toISOString();
    const endTimeISO = new Date(chatEndTime + offsetStr).toISOString();
    const payload = { startTime: startTimeISO, endTime: endTimeISO, timeZone: offsetStr };
    try {
      await fetch("/radio/chatsession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchChatSessions();
      setChatStartTime("");
      setChatEndTime("");
      setChatOffset("");
    } catch (error) {
      console.error("Error creating chat session:", error);
    }
  };

  const handleEditChatSession = async (e) => {
    e.preventDefault();
    const offsetStr = formatOffset(editChatOffset);
    const startTimeISO = new Date(editChatStartTime + offsetStr).toISOString();
    const endTimeISO = new Date(editChatEndTime + offsetStr).toISOString();
    const payload = { startTime: startTimeISO, endTime: endTimeISO, timeZone: offsetStr };
    try {
      await fetch(`/radio/chatsession/${editingChat._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      fetchChatSessions();
      setEditingChat(null);
    } catch (error) {
      console.error("Error updating chat session:", error);
    }
  };

  const handleDeleteChatSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this chat session?")) return;
    try {
      await fetch(`/radio/chatsession/${id}`, { method: "DELETE" });
      fetchChatSessions();
    } catch (error) {
      console.error("Error deleting chat session:", error);
    }
  };

  // *************** RADIO CREDENTIALS (Hard-coded) ***************
  const radioCredentials = {
    server: "link.zeno.fm",
    port: "80",
    mount: "/qqgdtv5o3isuv",
    username: "source",
    password: "BKugcIgK",
  };

  return (
    <div className="container mx-auto p-4">
      {/* Tab Navigation */}
      <div className="flex flex-wrap space-x-4 border-b mb-4">
        {[
          "Create Schedule",
          "List Schedules",
          "Create Chat Session",
          "List Chat Sessions",
          "Radio Credentials",
        ].map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-2 px-4 focus:outline-none ${
              activeTab === index
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence exitBeforeEnter>
        {/* Tab 1: Create Schedule */}
        {activeTab === 0 && (
          <motion.div
            key="create-schedule"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-xl font-bold mb-4">Create Schedule</h2>
            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={scheduleName}
                  onChange={(e) => setScheduleName(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  value={scheduleDescription}
                  onChange={(e) => setScheduleDescription(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              {/* Image URL Field */}
              <div>
                <label className="block mb-1">Image URL</label>
                <input
                  type="url"
                  value={scheduleImage}
                  onChange={(e) => setScheduleImage(e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block mb-1">Schedule Time</label>
                <input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">UTC Offset (e.g., +1, -5)</label>
                <input
                  type="text"
                  value={scheduleOffset}
                  onChange={(e) => setScheduleOffset(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Create Schedule
              </button>
            </form>
          </motion.div>
        )}

        {/* Tab 2: List Schedules */}
        {activeTab === 1 && (
          <motion.div
            key="list-schedules"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-xl font-bold mb-4">List Schedules</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Time</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule._id}>
                      <td className="p-2 border">{schedule.name}</td>
                      <td className="p-2 border">
                        {new Date(schedule.scheduleTime).toLocaleDateString()} at{" "}
                        {new Date(schedule.scheduleTime).toLocaleTimeString()}
                      </td>
                      <td className="p-2 border space-x-2">
                        <button
                          onClick={() => {
                            setEditingSchedule(schedule);
                            setEditScheduleName(schedule.name);
                            setEditScheduleDescription(schedule.description);
                            setEditScheduleImage(schedule.image || "");
                            setEditScheduleTime(
                              convertUTCToLocal(schedule.scheduleTime, schedule.timeZone)
                            );
                            setEditScheduleOffset(schedule.timeZone.replace(":00", ""));
                          }}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
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

        {/* Tab 3: Create Chat Session */}
        {activeTab === 2 && (
          <motion.div
            key="create-chat"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-xl font-bold mb-4">Create Chat Session</h2>
            <form onSubmit={handleCreateChatSession} className="space-y-4">
              <div>
                <label className="block mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={chatStartTime}
                  onChange={(e) => setChatStartTime(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={chatEndTime}
                  onChange={(e) => setChatEndTime(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">UTC Offset (e.g., +1, -5)</label>
                <input
                  type="text"
                  value={chatOffset}
                  onChange={(e) => setChatOffset(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Create Chat Session
              </button>
            </form>
          </motion.div>
        )}

        {/* Tab 4: List Chat Sessions */}
        {activeTab === 3 && (
          <motion.div
            key="list-chat"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-xl font-bold mb-4">List Chat Sessions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Start Time</th>
                    <th className="p-2 border">End Time</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chatSessions.map((session) => (
                    <tr key={session._id}>
                      <td className="p-2 border">
                        {new Date(session.startTime).toLocaleString()}
                      </td>
                      <td className="p-2 border">
                        {new Date(session.endTime).toLocaleString()}
                      </td>
                      <td className="p-2 border space-x-2">
                        <button
                          onClick={() => {
                            setEditingChat(session);
                            setEditChatStartTime(
                              convertUTCToLocal(session.startTime, session.timeZone)
                            );
                            setEditChatEndTime(
                              convertUTCToLocal(session.endTime, session.timeZone)
                            );
                            setEditChatOffset(session.timeZone.replace(":00", ""));
                          }}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteChatSession(session._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
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

        {/* Tab 5: Radio Credentials */}
        {activeTab === 4 && (
          <motion.div
            key="radio-credentials"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-xl font-bold mb-4">Radio Credentials</h2>
            <div className="p-4 border rounded space-y-2">
              <p>
                <strong>Server:</strong> {radioCredentials.server}
              </p>
              <p>
                <strong>Port:</strong> {radioCredentials.port}
              </p>
              <p>
                <strong>Mount:</strong> {radioCredentials.mount}
              </p>
              <p>
                <strong>Username:</strong> {radioCredentials.username}
              </p>
              <p>
                <strong>Password:</strong> {radioCredentials.password}
              </p>
            </div>
            <div className="mt-4">
              <a
                href="https://dashboard.zeno.fm"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Go to Zeno Dashboard
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* *************** SCHEDULE EDIT MODAL *************** */}
      {editingSchedule && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            className="bg-white rounded p-4 max-h-full overflow-y-auto w-11/12 md:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <h2 className="text-xl font-bold mb-4">Edit Schedule</h2>
            <form onSubmit={handleEditSchedule} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={editScheduleName}
                  onChange={(e) => setEditScheduleName(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  value={editScheduleDescription}
                  onChange={(e) => setEditScheduleDescription(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              {/* Image URL Field for editing */}
              <div>
                <label className="block mb-1">Image URL</label>
                <input
                  type="url"
                  value={editScheduleImage}
                  onChange={(e) => setEditScheduleImage(e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block mb-1">Schedule Time</label>
                <input
                  type="datetime-local"
                  value={editScheduleTime}
                  onChange={(e) => setEditScheduleTime(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">UTC Offset (e.g., +1, -5)</label>
                <input
                  type="text"
                  value={editScheduleOffset}
                  onChange={(e) => setEditScheduleOffset(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* *************** CHAT SESSION EDIT MODAL *************** */}
      {editingChat && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            className="bg-white rounded p-4 max-h-full overflow-y-auto w-11/12 md:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <h2 className="text-xl font-bold mb-4">Edit Chat Session</h2>
            <form onSubmit={handleEditChatSession} className="space-y-4">
              <div>
                <label className="block mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={editChatStartTime}
                  onChange={(e) => setEditChatStartTime(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={editChatEndTime}
                  onChange={(e) => setEditChatEndTime(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">UTC Offset (e.g., +1, -5)</label>
                <input
                  type="text"
                  value={editChatOffset}
                  onChange={(e) => setEditChatOffset(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingChat(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default RadioAdmin;
