import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GivePage = () => {
  // Donation type: Tithe, Offering, or Project.
  const [donationType, setDonationType] = useState("Tithe");
  // Donation amount entered by the user (only for Credit Card).
  const [amount, setAmount] = useState("");
  // Payment method: "credit", "bank", "cheque", or "gift".
  const [paymentMethod, setPaymentMethod] = useState("");
  // Selected project for donation when donationType is "Project"
  const [selectedProject, setSelectedProject] = useState("");
  // For credit card details.
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    address: ''
  });

  // Example bank account numbers for each donation type.
  const bankAccounts = {
    Tithe: '0095181953',
    Offering: '0095181506',
    Project: '0095182084'
  };

  // Example projects available for donation.
  const projects = [
    "Salt and Light Conference",
    "Church Infrastructure",
    "Auditorium chairs",
    "Office chairs",
    "Generator",
    "Sound system",
    "Digital screens",
    "Church bus",
    "Others",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Only allow submission if the Credit Card option is selected and an amount is provided.
    if (paymentMethod !== "credit" || !amount) {
      alert("Please select Credit Card as the payment method and provide a donation amount.");
      return;
    }

    // Process the donation here (e.g., call your API)
    console.log({ donationType, selectedProject, amount, paymentMethod, cardDetails });
    alert("Donation submitted!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="relative">
        <img 
          src="https://media.swncdn.com/via/13996-cupped-hands-giving-coins-seedling-gettyimage.jpg"
          alt="Church Service"
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          {/* Increase heading size on desktop */}
          <h1 className="text-4xl md:text-7xl text-white font-bold">Give</h1>
          <p className="text-lg md:text-2xl text-gray-200 mt-2 text-center max-w-2xl px-4">
            Your generous gift empowers our ministry, strengthens our community, and spreads hope.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <p className="text-gray-700 text-center mb-6 text-lg md:text-xl">
            At MIV Word House, we believe that giving is an act of worship and a way to honor God with our resources.
            Your generosity helps us spread the gospel, support our community, and fund life-changing projects.
            Whether you’re giving your tithe, an offering, or contributing to a special project, every gift makes a difference.
            Together, we are building God’s kingdom and transforming lives. Thank you for your faithful support!
          </p>

          {/* Donation Type Tabs */}
          <div className="flex justify-center mb-6 space-x-2">
            {["Tithe", "Offering", "Project"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setDonationType(type);
                  // Reset selected project when not in "Project" mode.
                  if (type !== "Project") {
                    setSelectedProject("");
                  }
                }}
                className={`px-5 py-2 rounded-full font-semibold transition-colors border focus:outline-none text-base md:text-lg
                  ${donationType === type
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project selector: Only show when donation type is "Project" */}
            {donationType === "Project" && (
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm md:text-base">
                  Select a Project
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-lg"
                >
                  <option value="">-- Select a Project --</option>
                  {projects.map((project, index) => (
                    <option key={index} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Donation Amount (Visible only for Credit Card) */}
            {paymentMethod === "credit" && (
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm md:text-base">
                  Donation Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-lg"
                />
              </div>
            )}

            {/* Payment Method Options */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium text-sm md:text-base">
                Select Payment Method
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit")}
                  className={`px-4 py-2 rounded-md transition-colors border focus:outline-none text-base md:text-lg
                    ${paymentMethod === "credit"
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                    }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`px-4 py-2 rounded-md transition-colors border focus:outline-none text-base md:text-lg
                    ${paymentMethod === "bank"
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                    }`}
                >
                  Bank Account
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cheque")}
                  className={`px-4 py-2 rounded-md transition-colors border focus:outline-none text-base md:text-lg
                    ${paymentMethod === "cheque"
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                    }`}
                >
                  Cheque
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("gift")}
                  className={`px-4 py-2 rounded-md transition-colors border focus:outline-none text-base md:text-lg
                    ${paymentMethod === "gift"
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                    }`}
                >
                  Gift
                </button>
              </div>
            </div>

            {/* Payment Method Details with Animation */}
            <AnimatePresence exitBeforeEnter>
              {paymentMethod === "credit" && (
                <motion.div
                  key="credit"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium text-sm md:text-base">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                      }
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-lg"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:space-x-4">
                    <div className="sm:w-1/2">
                      <label className="block text-gray-700 mb-2 font-medium text-sm md:text-base">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, expiry: e.target.value })
                        }
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-lg"
                      />
                    </div>
                    <div className="sm:w-1/2">
                      <label className="block text-gray-700 mb-2 font-medium text-sm md:text-base">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, cvv: e.target.value })
                        }
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium text-sm md:text-base">
                      Billing Address
                    </label>
                    <input
                      type="text"
                      value={cardDetails.address}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, address: e.target.value })
                      }
                      placeholder="Enter your address"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-lg"
                    />
                  </div>
                </motion.div>
              )}

              {paymentMethod === "bank" && (
                <motion.div
                  key="bank"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  <p className="text-gray-700 text-base md:text-lg">
                    Please transfer your donation to the following bank account:
                  </p>
                  <div className="p-4 border border-dashed rounded-md bg-gray-50">
                    <p className="font-bold text-base md:text-lg">{donationType} Bank Name:</p>
                    <p className="text-xl md:text-2xl">Sterling Bank</p>
                    <p className="font-bold mt-2 text-base md:text-lg">{donationType} Bank Account:</p>
                    <p className="text-xl md:text-2xl">{bankAccounts[donationType]}</p>
                  </div>
                </motion.div>
              )}

              {paymentMethod === "cheque" && (
                <motion.div
                  key="cheque"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  <p className="text-gray-700 text-base md:text-lg">
                    Please make your cheque payable to the beneficiary.
                  </p>
                  <div className="p-4 border border-dashed rounded-md bg-gray-50">
                    <p className="font-bold text-base md:text-lg">Beneficiary Name:</p>
                    <p className="text-xl md:text-2xl">MIV Word House</p>
                    <p className="font-bold mt-2 text-base md:text-lg">Beneficiary Address:</p>
                    <p className="text-xl md:text-2xl">
                      Word House Behind Accord Building, Obadeyi Estate, Samonda Ibadan
                    </p>
                    <p className="font-bold mt-2 text-base md:text-lg">Contact Phone Number:</p>
                    <p className="text-xl md:text-2xl">+234 (816) 3047-854</p>
                  </div>
                </motion.div>
              )}

              {paymentMethod === "gift" && (
                <motion.div
                  key="gift"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  <p className="text-gray-700 text-base md:text-lg">
                    To send a gift, please contact us at:
                  </p>
                  <div className="p-4 border border-dashed rounded-md bg-gray-50">
                    <p className="font-bold text-base md:text-lg">Beneficiary Address:</p>
                    <p className="text-xl md:text-2xl">Behind Accord Building, Obadeyi Estate, Samonda Ibadan</p>
                    <p className="font-bold mt-2 text-base md:text-lg">Contact Phone Number:</p>
                    <p className="text-xl md:text-2xl">+234 (816) 3047-854</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit (Donation) Button */}
            <button
              type="submit"
              disabled={paymentMethod !== "credit" || !amount}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Donation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GivePage;
