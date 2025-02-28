import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiSearch } from 'react-icons/fi';
import Flask from '../../assets/FLASK.png';

const productsData = [
  {
    id: 1,
    name: 'Hood',
    price: '#11,000',
    category: 'Apparel',
    description:
      'A cozy and stylish hooded design that provides warmth and comfort, perfect for casual wear.',
    images: [
      'https://i.ibb.co/DP5WBCPF/Hoodie-WORD-HOUSE-124901.png',
      'https://i.ibb.co/Vp5hhvFb/Word-House-Hoodie-1-Mockup-123217.png',
      'https://i.ibb.co/MDNQysfy/Hoodie-greay-WORD-HOUSE-124002.png',
    ],
  },
  {
    id: 2,
    name: 'Round Neck Wear',
    price: '#10,000',
    category: 'Apparel',
    description:
      'A classic blue denim jacket that pairs well with any outfit. Durable and timeless design.',
    images: [
      'https://i.ibb.co/GQBfhgbZ/Word-House-T-shirt-Mockup-122332.png',
    ],
  },
  {
    id: 3,
    name: 'Flask',
    price: '#5,000',
    category: 'Household',
    description:
      'A portable container designed to keep beverages hot or cold for extended periods, making it ideal for travel, work, or outdoor activities.',
    images: [Flask],
  },
];

// Fallback image if a product has no images.
const placeholderImage = 'https://via.placeholder.com/300?text=No+Image';

const ProductCard = ({ product }) => {
  const { name, price, description, images } = product;
  // Set the initial image (fallback to a placeholder if needed)
  const [selectedImage, setSelectedImage] = useState(
    images && images.length > 0 ? images[0] : placeholderImage
  );

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-4 flex flex-col"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={selectedImage}
          alt={name}
          className="w-full h-64 object-cover rounded-lg"
        />
        {/* Wishlist icon in the image's top right */}
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
          <FiHeart className="text-red-500" size={20} />
        </button>
      </div>

      {/* Product Details */}
      <div className="mt-4 flex-1">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      {/* Price & Add to Cart Button */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-semibold text-gray-800">{price}</span>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          <FiShoppingCart size={20} />
          <span>Add to Cart</span>
        </button>
      </div>

      {/* Thumbnail Selector for Multiple Images */}
      {images && images.length > 1 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${name} ${index + 1}`}
              className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${
                selectedImage === img ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const Store = () => {
  // State for search query and category filter.
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get unique categories from the products data.
  const categories = [...new Set(productsData.map(product => product.category))];

  // Filter products based on search input and selected category.
  const filteredProducts = productsData.filter(product => {
    const matchesQuery =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="bg-white py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Word House Store</h1>
          <div className="flex items-center space-x-4">
            <button className="relative">
              <FiHeart className="text-red-500" size={24} />
            </button>
            <button className="relative">
              <FiShoppingCart className="text-blue-500" size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex items-center w-full sm:w-1/2 border border-gray-300 rounded-md px-3 py-2">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Category Filter */}
          <div className="w-full sm:w-1/4">
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No products found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
