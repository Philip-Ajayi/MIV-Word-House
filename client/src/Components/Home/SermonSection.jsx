import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SermonSection = () => {
  const [sermons, setSermons] = useState([]);
  const [columns, setColumns] = useState(4); // default to 4 columns

  // Update column count based on window width (Tailwind breakpoints)
  const updateColumns = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setColumns(4);
    } else if (width >= 768) {
      setColumns(3);
    } else if (width >= 640) {
      setColumns(2);
    } else {
      setColumns(1);
    }
  };

  useEffect(() => {
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Fetch sermons when the component mounts
  useEffect(() => {
    fetch('/sermon/items')
      .then((res) => res.json())
      .then((data) => setSermons(data))
      .catch((err) => console.error('Error fetching sermons:', err));
  }, []);

  if (sermons.length === 0) {
    return (
      <section className="w-full py-8 bg-purple-100 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-800">Loading sermons…</p>
        </div>
      </section>
    );
  }

  // Determine how many sermons to show based on column count
  const sliceCount = columns === 3 ? 3 : 4;
  const lastSermon = sermons[0];
  const gridSermons = sermons.slice(0, sliceCount);

  return (
    <section className="w-full py-8 bg-purple-100 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-900">Sermons</h2>
          <p className="mt-2 text-lg text-purple-800">
            Current Series: <span className="font-semibold">{lastSermon.series}</span>
          </p>
          <p className="mt-1 text-lg text-purple-800">
            Last Sermon: <span className="font-semibold">{lastSermon.name}</span>
          </p>
        </div>

        {/* Sermon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gridSermons.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="relative">
                {item._id === lastSermon._id && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs uppercase px-2 py-1 rounded">
                    Last Sermon
                  </div>
                )}
                <img
                  src={`https://drive.google.com/thumbnail?id=${item.thumbnail}`}
                  alt={item.name}
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-purple-900">{item.name}</h3>
                <p className="text-purple-800 mb-1">{item.series}</p>
                <p className="text-purple-800">{item.speaker}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See More Button */}
        <div className="flex justify-center mt-8">
          <a
            href="/sermons"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded"
          >
            See More
          </a>
        </div>
      </div>
    </section>
  );
};

export default SermonSection;
