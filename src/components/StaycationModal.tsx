import React, { useState } from 'react';
import { X } from 'lucide-react';

interface StaycationModalProps {
  onClose: () => void;
}

export default function StaycationModal({ onClose }: StaycationModalProps) {
  const [zipCode, setZipCode] = useState('');
  const [month, setMonth] = useState('August');
  const [budget, setBudget] = useState(1000);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode) {
      setError('Please enter your zip code.');
      return;
    }
    
    // Construct the final payload for the API
    const apiPayload = {
      type: 'staycation',
      zipCode: zipCode,
      month: month,
      budget: budget,
    };

    // --- API Call Goes Here ---
    // Example: fetch('/api/keila-bot', { method: 'POST', body: JSON.stringify(apiPayload) });
    console.log('Submitting to API:', apiPayload);

    // After submission, you would likely navigate to the results page.
    // For now, we'll just close the modal.
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-6">Plan Your Perfect Staycation 🏖️</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="zipCode" className="block text-gray-700 font-semibold mb-2">
              Your Zip Code
            </label>
            <input
              id="zipCode"
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., 90210"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="month" className="block text-gray-700 font-semibold mb-2">
              Travel Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="budget" className="block text-gray-700 font-semibold mb-2">
              Your Budget: ${budget}
            </label>
            <input
              id="budget"
              type="range"
              min="100"
              max="5000"
              step="100"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>$100</span>
              <span>$5,000</span>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Generate Staycation Itinerary
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 text-gray-600 hover:text-gray-800 py-2 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}