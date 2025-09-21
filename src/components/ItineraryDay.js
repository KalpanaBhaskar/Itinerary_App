import React from 'react';
import './../assets/styles/ItineraryDay.css';

const ItineraryDay = ({ day, onTimingChange, dayIndex }) => {
  const timings = ['Morning', 'Afternoon', 'Evening'];
  
  return (
    <div className="itinerary-day-card card">
      <h3 className="day-header">
        Day {day.day} - {day.date}
      </h3>
      <ul className="places-list">
        {day.places.map((place, placeIndex) => (
          <li key={place.id} className="place-item">
            <select 
              value={place.timing} 
              onChange={(e) => onTimingChange(dayIndex, placeIndex, e.target.value)}
              className="timing-dropdown"
            >
              {timings.map(timing => (
                <option key={timing} value={timing}>{timing}</option>
              ))}
            </select>
            <span className="place-name">{place.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItineraryDay;