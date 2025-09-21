import React from 'react';
import './../assets/styles/ItineraryDay.css';

const ItineraryDay = ({ day }) => {
  return (
    <div className="itinerary-day-card card">
      <h3 className="day-header">
        Day {day.day} - {day.date}
      </h3>
      <ul className="places-list">
        {day.places.map((place, index) => (
          <li key={index} className="place-item">
            <span className="place-timing">{place.timing}</span>
            <span className="place-name">{place.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItineraryDay;