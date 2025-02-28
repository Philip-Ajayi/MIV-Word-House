import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// LazyLoad component using IntersectionObserver
const LazyLoad = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={ref} className={className}>{isVisible ? children : null}</div>;
};

const Sermon = () => {
  // States for sermons, filters, and grid visibility
  const [sermons, setSermons] = useState([]);
  const [filteredSermons, setFilteredSermons] = useState([]);
  const [speakerFilter, setSpeakerFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [speakers, setSpeakers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12); // Initially show 12 grid items

  // Fetch sermons from the API on mount
  useEffect(() => {
    fetch('/sermon/items')
      .then((res) => res.json())
      .then((data) => {
        setSermons(data);
        setFilteredSermons(data);

        // Extract unique speakers for filtering
        const uniqueSpeakers = Array.from(new Set(data.map((item) => item.speaker)));
        setSpeakers(uniqueSpeakers);
      })
      .catch((err) => console.error(err));
  }, []);

  // Update filtered sermons when filters change
  useEffect(() => {
    let filtered = sermons;
    if (speakerFilter) {
      filtered = filtered.filter((item) => item.speaker === speakerFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.series.toLowerCase().includes(query) ||
          item.speaker.toLowerCase().includes(query)
      );
    }
    setFilteredSermons(filtered);
    setVisibleCount(12); // Reset visible count when filters change
  }, [speakerFilter, searchQuery, sermons]);

  // Determine headline sermon (if no filters) and grid sermons
  const activeFilters = speakerFilter || searchQuery;
  const lastSermon = sermons[0];
  const gridSermons =
    !activeFilters && sermons.length > 1 ? sermons.slice(1) : filteredSermons;

  // Helper to format dates
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-10">
        Sermons
      </h1>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={speakerFilter}
            onChange={(e) => setSpeakerFilter(e.target.value)}
            className="border border-gray-200 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Speakers</option>
            {speakers.map((speaker) => (
              <option key={speaker} value={speaker}>
                {speaker}
              </option>
            ))}
          </select>

          {/* Sermon Video Route Button */}
          <Link
            to="/sermon-video"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-colors duration-300"
          >
            Sermon Videos
          </Link>
        </div>
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name, series or speaker"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 rounded-md px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Headline Sermon (only when no filters are active) */}
      {!activeFilters && lastSermon && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl rounded-xl p-8 mb-12 transition-all duration-300 max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Lazy-loaded Sermon Thumbnail */}
            <LazyLoad className="flex-shrink-0 w-72 h-72">
              <img
                src={`https://drive.google.com/thumbnail?id=${lastSermon.thumbnail}`}
                alt={lastSermon.name}
                className="object-cover w-full h-full rounded-xl"
              />
            </LazyLoad>
            <div className="flex flex-col justify-between flex-1">
              <div>
                <span className="text-sm text-blue-500 uppercase tracking-wide">
                  Latest Sermon
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                  {lastSermon.name}
                </h2>
                <p className="text-gray-700 text-lg mt-2">
                  <span className="font-semibold">Speaker:</span> {lastSermon.speaker}
                </p>
                <p className="text-gray-700 text-lg mt-1">
                  <span className="font-semibold">Series:</span> {lastSermon.series}
                </p>
                <p className="text-gray-700 text-lg mt-1">
                  <span className="font-semibold">Date:</span> {formatDate(lastSermon.date)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Current Series</p>
              </div>
              <div className="mt-6">
                <a
                  href={`https://drive.google.com/uc?export=download&id=${lastSermon.audioFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors duration-300"
                >
                  Download Audio
                </a>
              </div>
            </div>
          </div>
          {/* Lazy-loaded Audio Preview */}
          <LazyLoad className="mt-8">
            <iframe
              src={`https://drive.google.com/file/d/${lastSermon.audioFile}/preview`}
              title="Audio Preview"
              className="w-full h-24 rounded-lg shadow-md"
              allow="autoplay"
              loading="lazy"
            ></iframe>
          </LazyLoad>
        </motion.div>
      )}

      {/* Sermons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {gridSermons.slice(0, visibleCount).map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300"
          >
            {/* Lazy-loaded Thumbnail with a square aspect ratio */}
            <LazyLoad className="relative aspect-square">
              <img
                src={`https://drive.google.com/thumbnail?id=${item.thumbnail}`}
                alt={item.name}
                className="object-cover w-full h-full"
              />
            </LazyLoad>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.name}</h3>
              <p className="text-gray-600 text-lg mb-1">
                <span className="font-medium">Speaker:</span> {item.speaker}
              </p>
              <p className="text-gray-600 text-lg mb-1">
                <span className="font-medium">Series:</span> {item.series}
              </p>
              <p className="text-gray-600 text-lg mb-2">
                <span className="font-medium">Date:</span> {formatDate(item.date)}
              </p>
              <div className="mt-auto flex flex-col gap-4">
                <a
                  href={`https://drive.google.com/uc?export=download&id=${item.audioFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg px-4 py-2 rounded-full text-center transition-colors duration-300"
                >
                  Download Audio
                </a>
                <LazyLoad className="w-full">
                  <iframe
                    src={`https://drive.google.com/file/d/${item.audioFile}/preview`}
                    title="Audio Preview"
                    className="w-full h-20 rounded-lg shadow-sm"
                    allow="autoplay"
                    loading="lazy"
                  ></iframe>
                </LazyLoad>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* "Load More" Button */}
      {visibleCount < gridSermons.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-full transition-colors duration-300"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Sermon;
