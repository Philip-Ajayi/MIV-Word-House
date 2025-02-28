import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { jsPDF } from "jspdf";

// YouTube API constants
const API_KEY = "AIzaSyBbh5Z3C7Ga1k-mTwpt-T2tQY_XwmO54iM";
const CHANNEL_ID = "UCacNQvyF_C6X_dHkk0RBRgw";

// List of all 66 Bible books
const bibleBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings",
  "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea",
  "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark",
  "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John",
  "3 John", "Jude", "Revelation"
];

const Tv = () => {
  // Video states
  const [videoId, setVideoId] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tab control: "bible", "schedule", "note"
  const [activeTab, setActiveTab] = useState("bible");

  // Bible tab states (using only KJV)
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState("1");
  const [bibleChapterData, setBibleChapterData] = useState([]);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);

  // Note tab state (prefilled with current date and "MIV Word House")
  const todayHeader = new Date().toLocaleDateString() + " - MIV Word House";
  const [noteContent, setNoteContent] = useState(
    `<h3>${todayHeader}</h3><p><br/></p>`
  );

  // Schedule data state
  const [scheduleData, setScheduleData] = useState([]);

  // --- Live Video & Fallback Logic ---
  // Function to check for live video and, if none, pick a random fallback deterministically.
  const fetchLiveVideo = async () => {
    try {
      // 1. Check for a live video on the channel.
      const liveUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`;
      const liveResponse = await fetch(liveUrl);
      const liveData = await liveResponse.json();

      if (liveData.items && liveData.items.length > 0) {
        setVideoId(liveData.items[0].id.videoId);
        setIsLive(true);
      } else {
        // 2. If no live video, pick a fallback.
        setIsLive(false);
        const playlistsUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&key=${API_KEY}`;
        const playlistsResponse = await fetch(playlistsUrl);
        const playlistsData = await playlistsResponse.json();

        if (playlistsData.items && playlistsData.items.length > 0) {
          // Choose the first playlist.
          const playlistId = playlistsData.items[0].id;
          const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`;
          const playlistItemsResponse = await fetch(playlistItemsUrl);
          const playlistItemsData = await playlistItemsResponse.json();

          if (playlistItemsData.items && playlistItemsData.items.length > 0) {
            // Use the current day (1-31) as a seed so that the fallback is "random" yet the same for all users.
            const seed = new Date().getDate();
            const randomIndex = seed % playlistItemsData.items.length;
            setVideoId(
              playlistItemsData.items[randomIndex].snippet.resourceId.videoId
            );
          } else {
            console.error("No videos found in the playlist.");
          }
        } else {
          console.error("No playlists found for the channel.");
        }
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    } finally {
      setLoading(false);
    }
  };

  // On mount, fetch video and re-check every 60 seconds.
  useEffect(() => {
    fetchLiveVideo();
    const interval = setInterval(fetchLiveVideo, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Schedule Data ---
  // Compute the next occurrence for a given weekday and time.
  const getNextOccurrence = (targetDay, hour, minute) => {
    const now = new Date();
    const result = new Date(now);
    result.setHours(hour, minute, 0, 0);
    const currentDay = now.getDay();
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd < 0 || (daysToAdd === 0 && now > result)) {
      daysToAdd += 7;
    }
    result.setDate(result.getDate() + daysToAdd);
    return result;
  };

  useEffect(() => {
    // For Wednesday (day 3) at 18:00 (6pm) and Sunday (day 0) at 08:30
    const nextWednesday = getNextOccurrence(3, 18, 0);
    const nextSunday = getNextOccurrence(0, 8, 30);

    // Format the date/time strings.
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const wednesdayStr = nextWednesday.toLocaleString("en-US", options);
    const sundayStr = nextSunday.toLocaleString("en-US", options);

    setScheduleData([
      { id: 1, title: "Live Service", dateTime: wednesdayStr },
      { id: 2, title: "Sunday Worship", dateTime: sundayStr },
      { id: 3, title: "Bible Study", dateTime: "Friday, December 31, 2025, 07:00pm (WAT)" },
    ]);
  }, []);

  // --- Bible Tab: Fetch Full Chapter (KJV Only) ---
  useEffect(() => {
    if (activeTab !== "bible") return;
    const fetchBibleChapter = async () => {
      setBibleLoading(true);
      setBibleError(null);
      const query = encodeURIComponent(`${selectedBook} ${selectedChapter}`);
      try {
        const response = await fetch(
          `https://bible-api.com/${query}?translation=kjv`
        );
        const data = await response.json();
        if (data.error) {
          setBibleError(data.error);
          setBibleChapterData([]);
        } else {
          // The API returns a "verses" array containing the full chapter.
          setBibleChapterData(data.verses);
        }
      } catch (error) {
        setBibleError("Failed to fetch Bible chapter.");
        setBibleChapterData([]);
      } finally {
        setBibleLoading(false);
      }
    };

    fetchBibleChapter();
  }, [activeTab, selectedBook, selectedChapter]);

  // When clicking on a verse, scroll it into view and highlight it.
  const handleVerseClick = (verseNumber) => {
    const element = document.getElementById(`verse-${verseNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setSelectedVerse(verseNumber);
    }
  };

  // --- Note Tab: Save as PDF ---
  const handleSavePdf = () => {
    const doc = new jsPDF();
    const header = todayHeader;
    doc.setFontSize(16);
    doc.text(header, 10, 20);
    // Remove HTML tags for PDF content.
    const plainText = noteContent.replace(/<[^>]+>/g, "");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(plainText, 180);
    doc.text(lines, 10, 30);
    doc.save("note.pdf");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-900 text-white flex items-center justify-between px-4 py-3">
        <div className="text-xl font-bold">TV Channel</div>
        <div className="flex items-center space-x-4">
          <div className={`px-2 py-1 text-sm font-semibold rounded ${isLive ? "bg-red-500" : "bg-gray-500"}`}>
            {isLive ? "LIVE" : "Pre-recorded"}
          </div>
          <a
            href="/radio"
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white text-sm"
          >
            Live Radio
          </a>
        </div>
      </header>

      {/* Main Content Grid */}
      {/* On desktop: TV iframe takes 2/3 and tab section takes 1/3 */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3">
        {/* TV Iframe Section */}
        <div className="bg-black md:col-span-2">
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {videoId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-white text-center">
                No video available at the moment.
              </div>
            )}
          </motion.div>
        </div>

        {/* Tab Section */}
        <div className="bg-gray-100 p-4 overflow-auto md:col-span-1">
          {/* Tabs Navigation */}
          <div className="flex space-x-4 border-b mb-4">
            <button
              className={`px-4 py-2 ${
                activeTab === "bible"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("bible")}
            >
              Bible
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "schedule"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("schedule")}
            >
              Schedule
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "note"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("note")}
            >
              Note
            </button>
          </div>

          {/* Tabs Content */}
          {activeTab === "bible" && (
            <div className="space-y-4">
              {/* Bible Selection Controls */}
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 mb-1">Bible Book:</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                  >
                    {bibleBooks.map((book, idx) => (
                      <option key={idx} value={book}>
                        {book}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Chapter:</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    min="1"
                  />
                </div>
              </div>
              {bibleLoading ? (
                <p>Loading chapter...</p>
              ) : bibleError ? (
                <p className="text-red-500">{bibleError}</p>
              ) : (
                <div className="bg-white p-4 rounded shadow max-h-96 overflow-auto">
                  {bibleChapterData.map((verse, idx) => (
                    <div
                      key={idx}
                      id={`verse-${verse.verse}`}
                      onClick={() => handleVerseClick(verse.verse)}
                      className={`cursor-pointer p-1 rounded hover:bg-gray-200 ${
                        selectedVerse === verse.verse ? "bg-yellow-200" : ""
                      }`}
                    >
                      {/* Display header showing the book, chapter, and verse */}
                      <h4 className="text-sm font-bold mb-1">
                        {selectedBook} {selectedChapter}:{verse.verse}
                      </h4>
                      <p className="text-sm">{verse.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "schedule" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Live Schedule</h2>
              <ul className="space-y-3">
                {scheduleData.map((event) => (
                  <li key={event.id} className="bg-white p-3 rounded shadow">
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-gray-600">{event.dateTime}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "note" && (
            <div className="flex flex-col space-y-4">
              <ReactQuill theme="snow" value={noteContent} onChange={setNoteContent} />
              <div className="flex space-x-4">
                <button
                  onClick={handleSavePdf}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Save as PDF
                </button>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-bold mb-2">Note Preview</h2>
                <div dangerouslySetInnerHTML={{ __html: noteContent }} className="prose" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tv;
