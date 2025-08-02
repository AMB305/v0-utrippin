import React, { useState } from 'react';
import './FlightSearchHero.css';

interface FlightSearchHeroProps {
  onSearch?: (searchData: any) => void;
}

function FlightSearchHero({ onSearch }: FlightSearchHeroProps) {
  const [tripType, setTripType] = useState('one-way');
  const [directFlightsOnly, setDirectFlightsOnly] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchData = {
      origin: formData.get('from'),
      destination: formData.get('to'),
      departureDate: formData.get('depart'),
      returnDate: formData.get('return'),
      tripType,
      directFlightsOnly
    };
    
    if (onSearch) {
      onSearch(searchData);
    }
  };

  return (
    <div className="booking-form">
      {/* trip‑type tabs */}
      <div className="trip-type-tabs">
        <button 
          type="button"
          className={`trip-type-tab ${tripType === 'one-way' ? 'active' : ''}`}
          onClick={() => setTripType('one-way')}
        >
          One-way
        </button>
        <button 
          type="button"
          className={`trip-type-tab ${tripType === 'round-trip' ? 'active' : ''}`}
          onClick={() => setTripType('round-trip')}
        >
          Round-trip
        </button>
        <button 
          type="button"
          className={`trip-type-tab ${tripType === 'multi-city' ? 'active' : ''}`}
          onClick={() => setTripType('multi-city')}
        >
          Multi-city
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label>From</label>
        <input 
          name="from" 
          placeholder="Jakarta (JKTA)" 
        />
        
        <label>To</label>
        <input 
          name="to" 
          placeholder="Bali / Denpasar (DPS)" 
        />
        
        <label>Departure date</label>
        <input 
          type="date" 
          name="depart" 
          defaultValue="2025-07-20" 
        />
        
        <label>Return date</label>
        <input 
          type="date" 
          name="return" 
          disabled={tripType === 'one-way'}
          placeholder="Select return date" 
        />
        
        <button 
          type="submit" 
          className="submit-btn"
        >
          Search Flights
        </button>
      </form>
    </div>
  );
}

export default FlightSearchHero;
