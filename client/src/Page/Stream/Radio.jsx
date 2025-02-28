import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../../assets/xlogo.png";

// Firebase imports for realtime database functionality
import { db } from "../../firebase";
import { ref, set, remove, onDisconnect, onValue } from "firebase/database";

const Radio = () => {
  // Live stream URL
  const audioSrc =
    "https://stream-175.zeno.fm/qqgdtv5o3isuv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJxcWdkdHY1bzNpc3V2IiwiaG9zdCI6InN0cmVhbS0xNzUuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IkMtU1lkY2dQUmphVllwRlhHSDBrbnciLCJpYXQiOjE3MzkyNTQyNzAsImV4cCI6MTczOTI1NDMzMH0.jC0UwgRTNlkcWPDofZQmtP3HftoqunVxEd3EjGF9l9w";

  // Audio playback state
  const [playing, setPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef(null);

  // Now Playing / Next Playing & Schedule Data
  const [nowPlaying, setNowPlaying] = useState(null);
  const [nextPlaying, setNextPlaying] = useState(null);
  const [schedule, setSchedule] = useState([]);

  // Chat state
  const [activeChatSession, setActiveChatSession] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatForm, setChatForm] = useState({
    userName: '',
    comment: '',
  });

  // Active Listeners state and a unique client id for Firebase
  const [activeListenersCount, setActiveListenersCount] = useState(0);
  const [clientId] = useState(() => Math.random().toString(36).substring(2, 15));

  // State for schedule details modal
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // -------------------------------
  // SSE Subscription for Now Playing Data
  // -------------------------------
  useEffect(() => {
    const eventSource = new EventSource("https://api.zeno.fm/mounts/metadata/subscribe/qqgdtv5o3isuv");

    // Listen for message events containing the stream title
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Check that the mount matches and a stream title exists
        if (data.mount === "qqgdtv5o3isuv" && data.streamTitle) {
          setNowPlaying({ name: data.streamTitle });
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    // Optionally, handle errors
    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // -------------------------------
  // Data Fetching Functions for Next, Schedule & Chat
  // -------------------------------
  const fetchNextPlaying = async () => {
    try {
      const res = await axios.get('/radio/schedule/next');
      setNextPlaying(res.data);
    } catch (error) {
      console.error('Error fetching next playing:', error);
      setNextPlaying(null);
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await axios.get('/radio/schedule/future');
      setSchedule(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setSchedule([]);
    }
  };

  const fetchActiveChatSession = async () => {
    try {
      const res = await axios.get('/radio/chatsession/all');
      let sessions = res.data;
      if (!Array.isArray(sessions)) {
        sessions = Object.values(sessions);
      }
      const now = new Date();
      const active = sessions.find(session => {
        const start = new Date(session.startTime);
        const end = new Date(session.endTime);
        return start <= now && end >= now;
      });
      setActiveChatSession(active);
    } catch (error) {
      console.error('Error fetching active chat session:', error);
      setActiveChatSession(null);
    }
  };

  const fetchChatMessages = async () => {
    if (!activeChatSession) {
      setChatMessages([]);
      return;
    }
    try {
      const res = await axios.get(`/radio/chatsession/${activeChatSession._id}/comments`);
      setChatMessages(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setChatMessages([]);
    }
  };

  // -------------------------------
  // useEffect: Fetch other data on mount and periodically
  // -------------------------------
  useEffect(() => {
    fetchNextPlaying();
    fetchSchedule();
    fetchActiveChatSession();

    const interval = setInterval(() => {
      fetchNextPlaying();
      fetchSchedule();
      fetchActiveChatSession();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchChatMessages();
  }, [activeChatSession]);

  // -------------------------------
  // Active Listeners: Listen for realtime changes in Firebase
  // -------------------------------
  useEffect(() => {
    const activeListenersRef = ref(db, 'activeListeners');
    const unsubscribe = onValue(activeListenersRef, (snapshot) => {
      const data = snapshot.val();
      const count = data ? Object.keys(data).length : 0;
      setActiveListenersCount(count);
    });

    return () => unsubscribe();
  }, []);

  // -------------------------------
  // Audio Controls with Loader & Active Listener Tracking
  // -------------------------------
  const togglePlayPause = () => {
    const listenerRef = ref(db, `activeListeners/${clientId}`);
    
    if (!playing) {
      setAudioLoading(true);
      audioRef.current.play()
        .then(() => {
          // If audio is already ready, clear loader and update state immediately.
          if (audioRef.current.readyState >= 4) {
            setAudioLoading(false);
            setPlaying(true);
            set(listenerRef, true);
            onDisconnect(listenerRef).remove();
          } else {
            const handleCanPlay = () => {
              setAudioLoading(false);
              setPlaying(true);
              set(listenerRef, true);
              onDisconnect(listenerRef).remove();
              audioRef.current.removeEventListener("canplaythrough", handleCanPlay);
            };
            audioRef.current.addEventListener("canplaythrough", handleCanPlay);
          }
        })
        .catch((err) => {
          setAudioLoading(false);
          console.error("Audio playback error:", err);
        });
    } else {
      audioRef.current.pause();
      setPlaying(false);
      remove(listenerRef);
    }
  };

  // Clean up on page unload (if the client is listening)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (playing) {
        remove(ref(db, `activeListeners/${clientId}`));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [playing, clientId]);

  // -------------------------------
  // Chat Submission
  // -------------------------------
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!activeChatSession) return;
    try {
      await axios.post(`/radio/chatsession/${activeChatSession._id}/comment`, {
        name: chatForm.userName,
        comment: chatForm.comment
      });
      setChatForm({ userName: '', comment: '' });
      fetchChatMessages();
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  // -------------------------------
  // Render Component
  // -------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-12"
        >
          <img src={logo} alt="Radio Logo" className="h-28 w-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center">
            Expression Radio
          </h1>
          <p className="mt-2 text-lg md:text-xl text-gray-600 text-center max-w-2xl">
            Strong in Sound! Vigorous in Vibe! Victorious in Voice!
          </p>
        </motion.div>

        {/* Audio Player Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex flex-col items-center">
            <audio ref={audioRef} src={audioSrc} preload="none" />
            {/* Dynamic Play/Pause Button with Loader */}
            <motion.button
              onClick={togglePlayPause}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white p-4 rounded-full focus:outline-none transition duration-300 shadow-lg flex items-center justify-center"
            >
              <AnimatePresence exitBeforeEnter initial={false}>
                {audioLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Simple spinner */}
                    <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  </motion.div>
                ) : playing ? (
                  <motion.g
                    key="pause"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg width="50" height="50" viewBox="0 0 50 50">
                      <rect x="12" y="10" width="8" height="30" fill="#fff" rx="2" />
                      <rect x="30" y="10" width="8" height="30" fill="#fff" rx="2" />
                    </svg>
                  </motion.g>
                ) : (
                  <motion.svg
                    key="play"
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <polygon points="15,10 40,25 15,40" fill="#fff" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-semibold text-gray-800"
              >
                Now Playing: <span className="text-indigo-600">{nowPlaying ? nowPlaying.name : 'N/A'}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl font-semibold text-gray-800 mt-1"
              >
                Next Playing: <span className="text-indigo-600">{nextPlaying ? nextPlaying.name : 'N/A'}</span>
              </motion.div>
              {/* Display Active Listeners Count */}
              <div className="mt-4 text-gray-600 text-sm hidden">
                Active Listeners: {activeListenersCount}
              </div>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8rYejO4FtGX9dlJ1_hFCFJs26RCrbr7A0jA&s"
                alt="About Us"
                className="rounded-xl shadow-lg w-64 h-64 object-cover"
              />
            </div>
            <div className="md:w-1/2 md:pl-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
              <p
                className="text-gray-700 mb-3 text-base md:text-lg"
                style={{ textAlign: 'justify' }}
              >
                Expression Radio is more than just an online station—it’s a movement. Created as an extension of our church’s vision, Expression Radio is a platform where faith, creativity, and culture collide.
              </p>
              <p
                className="text-gray-700 mb-3 text-base md:text-lg"
                style={{ textAlign: 'justify' }}
              >
                Our mission is to inspire, uplift, and connect people through powerful messages, dynamic worship, and engaging discussions on topics that matter.
              </p>
              <p
                className="text-gray-700 text-base md:text-lg"
                style={{ textAlign: 'justify' }}
              >
                Whether you’re tuning in for live worship sessions or thoughtful conversations, you’re an essential part of our community. Let your spirit soar with every beat and every word.
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Our Schedule</h2>
          <div className="space-y-4">
            {schedule.map((item) => (
              <div key={item._id} className="flex justify-between items-center bg-white p-4 rounded shadow">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    {new Date(item.scheduleTime).toLocaleDateString()} at {new Date(item.scheduleTime).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                  onClick={() => setSelectedSchedule(item)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Details Modal */}
        <AnimatePresence>
          {selectedSchedule && (
            <motion.div
              key="scheduleModal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
              onClick={() => setSelectedSchedule(null)}
            >
              <motion.div
                className="bg-white rounded-lg p-6 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-4">{selectedSchedule.name}</h3>
                <p className="text-gray-600 mb-2">
                  {new Date(selectedSchedule.scheduleTime).toLocaleDateString()} at {new Date(selectedSchedule.scheduleTime).toLocaleTimeString()}
                </p>
                {selectedSchedule.image && (
                  <img
                    src={selectedSchedule.image}
                    alt={selectedSchedule.name}
                    className="w-full h-64 object-contain mb-4"
                  />
                )}
                <p className="text-gray-700 mb-4">{selectedSchedule.description}</p>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                  onClick={() => setSelectedSchedule(null)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Chat</h2>
          {activeChatSession ? (
            <div className="flex flex-col">
              <div className="h-64 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4">
                {chatMessages.map((msg) => (
                  <div key={msg._id} className="mb-3">
                    <p className="text-base md:text-lg">
                      <span className="font-bold text-indigo-600">{msg.name}:</span> {msg.comment}
                    </p>
                    <p className="text-sm md:text-base text-gray-500">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={chatForm.userName}
                  onChange={(e) =>
                    setChatForm({ ...chatForm, userName: e.target.value })
                  }
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Your comment"
                  value={chatForm.comment}
                  onChange={(e) =>
                    setChatForm({ ...chatForm, comment: e.target.value })
                  }
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
                >
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-700">
                Chat is currently closed. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Radio;
