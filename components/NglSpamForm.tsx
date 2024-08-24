"use client";

import React, { useState } from "react";
import axios from "axios";

const NglSpamForm = () => {
  const [username, setUsername] = useState("");
  const [question, setQuestion] = useState("");
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [responseData, setResponseData] = useState<{ message: string; data?: any } | null>(null);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  function generateDeviceID(): string {
    const characters = "qwertyuiopasdfghjklzxcvbnm1234567890";
    const randomStr = Array.from({ length: 8 }, () => 
        characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");

    return `${randomStr}-f7d8-4ee2-b6e1-5d0fb2bb88d3`;
  }

  const sendNgl = async () => {
    try {
      const response = await axios.post('/api/spam-ngl', {
        username,
        question,
        deviceId: generateDeviceID(),
        gameSlug: "",
        referrer: ""
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true); // Show loading spinner

    const limitedCount = Math.min(count, 100);

    for (let i = 0; i < limitedCount; i++) {
      try {
        const data = await sendNgl();
        setResponseData({ message: `Spam ke-${i + 1} berhasil dikirim.` });
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 5000); // Hide notification after 5 seconds
      } catch (error) {
        setResponseData({ message: `Error pada Spam ke-${i + 1}` });
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 5000);
      }

      await delay(1000); // Delay between each request
    }

    setIsLoading(false); // Hide loading spinner
    setUsername("");
    setQuestion("");
    setCount(1); // Reset form fields
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username Ngl
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan Username Ngl Target (ex: lorem_12)"
            className="mt-1 block w-full px-4 py-3 rounded-full shadow-sm border border-gray-300 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            Message Target
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Masukkan Message Anda"
            className="mt-1 block w-full px-4 py-3 rounded-full shadow-sm border border-gray-300 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="count" className="block text-sm font-medium text-gray-700">
            Jumlah Spam
          </label>
          <input
            type="number"
            id="count"
            name="count"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value)))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-lg text-sm font-bold rounded-full text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-yellow-500 hover:via-red-500 hover:to-pink-500 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                ></path>
              </svg>
            ) : (
              "Kirim Spam"
            )}
          </button>
        </div>
      </form>

      {/* Notification */}
      {showPopup && (
        <div
          className="mt-4 p-4 bg-green-500 text-white rounded-md text-sm max-h-24 transform transition-all duration-500 ease-in-out animate-slide-in"
        >
          {responseData?.message}
          {responseData?.data && <pre>{JSON.stringify(responseData.data, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
};

export default NglSpamForm;
