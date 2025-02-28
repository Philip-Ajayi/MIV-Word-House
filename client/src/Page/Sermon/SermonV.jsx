import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_KEY = 'AIzaSyBbh5Z3C7Ga1k-mTwpt-T2tQY_XwmO54iM';
const CHANNEL_ID = 'UCacNQvyF_C6X_dHkk0RBRgw';

const SermonV = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // itemsPerPage determines how many grid items load on each "read more" click
  const [itemsPerPage, setItemsPerPage] = useState(16);
  // visibleCount keeps track of how many grid videos are currently visible
  const [visibleCount, setVisibleCount] = useState(16);

  // Set itemsPerPage based on window width (if grid is 3, then 15 per time)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setItemsPerPage(15);
      } else {
        setItemsPerPage(16);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure visibleCount is at least itemsPerPage on initial render/resizes
  useEffect(() => {
    setVisibleCount((prev) => (prev < itemsPerPage ? itemsPerPage : prev));
  }, [itemsPerPage]);

  useEffect(() => {
    const fetchPlaylistsAndVideos = async () => {
      try {
        // 1. Fetch all playlists from the channel
        const playlistsResponse = await axios.get(
          'https://www.googleapis.com/youtube/v3/playlists',
          {
            params: {
              part: 'snippet',
              channelId: CHANNEL_ID,
              key: API_KEY,
              maxResults: 50,
            },
          }
        );

        const playlists = playlistsResponse.data.items;

        // 2. For each playlist (series), fetch the videos concurrently
        const videoFetchPromises = playlists.map((playlist) =>
          axios
            .get('https://www.googleapis.com/youtube/v3/playlistItems', {
              params: {
                part: 'snippet,contentDetails', // include contentDetails to get original video publish date
                playlistId: playlist.id,
                key: API_KEY,
                maxResults: 50,
              },
            })
            .then((response) =>
              response.data.items.map((item) => ({
                videoId: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                publishedAt: item.contentDetails.videoPublishedAt,
                series: playlist.snippet.title,
              }))
            )
        );

        // Wait for all video fetches to complete
        const videosBySeries = await Promise.all(videoFetchPromises);

        // 3. Flatten and sort all videos from newest to oldest
        let allVideos = videosBySeries.flat();
        allVideos.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        setVideos(allVideos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data from YouTube API:', error);
        setLoading(false);
      }
    };

    fetchPlaylistsAndVideos();
  }, []);

  // Determine the most recent video overall (unfiltered)
  const mostRecentVideo = videos[0];

  // Filter videos based on search term (title or series)
  const filteredVideos = videos.filter((video) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      video.title.toLowerCase().includes(lowerSearch) ||
      video.series.toLowerCase().includes(lowerSearch)
    );
  });

  // Only show a headline if the most recent video is part of the filtered videos
  const headlineVideo = filteredVideos.some(
    (video) => video.videoId === mostRecentVideo?.videoId
  )
    ? mostRecentVideo
    : null;

  // For grid videos, remove the headline if it exists; otherwise, show all filtered videos
  const gridVideos = headlineVideo
    ? filteredVideos.filter((video) => video.videoId !== headlineVideo.videoId)
    : filteredVideos;

  // Only display a subset of the grid videos based on visibleCount
  const visibleGridVideos = gridVideos.slice(0, visibleCount);

  // Handler for loading more videos
  const handleLoadMore = () => {
    setVisibleCount(visibleCount + itemsPerPage);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by video or series name..."
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Responsive Button to Audio Sermons Page */}
        <div className="flex justify-center mb-8">
          <a
            href="/sermons"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
          >
            View Audio Sermons
          </a>
        </div>

        {loading ? (
          <div className="text-center text-gray-700">Loading sermons...</div>
        ) : (
          <>
            {/* Headline Video Sermon */}
            {headlineVideo && (
              <motion.div
                className="mb-12 p-6 bg-purple-100 rounded-lg shadow-2xl"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-extrabold text-purple-700 mb-4">
                  Latest Sermon Video
                </h2>
                {/* Responsive iFrame Container */}
                <div className="relative w-full pb-[56.25%] mb-4">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-md"
                    src={`https://www.youtube.com/embed/${headlineVideo.videoId}`}
                    title={headlineVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {headlineVideo.title}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(headlineVideo.publishedAt).toLocaleDateString()} | Series:{' '}
                    {headlineVideo.series}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Responsive Grid for Other Sermons */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
                hidden: {},
              }}
            >
              {visibleGridVideos.map((video) => (
                <motion.div
                  key={video.videoId}
                  className="bg-purple-50 rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-3">
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-md"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 text-sm mt-1">
                    Series: {video.series}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* "Read More" Button */}
            {visibleCount < gridVideos.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Read More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SermonV;
