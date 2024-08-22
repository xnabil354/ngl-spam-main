"use client";

import { useState } from 'react';
import axios from 'axios';

interface ResponseData {
  message: string;
  data?: any;
  error?: any;
}

const NglSpamForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState('');
  const [count, setCount] = useState(1); 
  const [showPopup, setShowPopup] = useState(false);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);

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

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const limitedCount = Math.min(count, 100);

    for (let i = 0; i < limitedCount; i++) { 
      try {
        const data = await sendNgl();
        setResponseData({ message: `Spam ke-${i + 1} berhasil dikirim.` });
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 5000);
      } catch (error) {
        setResponseData({ message: `Error pada Spam ke-${i + 1}` });
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 5000);
      }

      await delay(1000);
    }

    setUsername('');
    setQuestion('');
    setCount(1); 
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username Ngl
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan Username Ngl Target (ex: lorem_123)"
            required
          />
        </div>
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            Question Target
          </label>
          <input
            type="text"
            id="question"
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan Question Anda"
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
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value))))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="100"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Kirim Spam
        </button>
      </form>
      {showPopup && (
        <div className="mt-4 p-4 bg-green-500 text-white rounded-md text-sm overflow-auto max-h-24">
          {responseData?.message}
          {responseData?.data && <pre>{JSON.stringify(responseData.data, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
};

export default NglSpamForm;
