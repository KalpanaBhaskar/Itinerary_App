import React from 'react';
import { Link } from 'react-router-dom';
import './../assets/styles/ItineraryCard.css';

const ItineraryCard = ({ itinerary }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'ongoing':
        return 'status-ongoing';
      case 'upcoming':
        return 'status-upcoming';
      case 'past':
        return 'status-past';
      default:
        return '';
    }
  };

  return (
    <div className="itinerary-card card">
      <div className="card-header">
        <h4 className="trip-title">{itinerary.title}</h4>
        <div className={`trip-status ${getStatusClass(itinerary.status)}`}>{itinerary.status}</div>
      </div>
      <div className="card-body">
        <p className="trip-dates">{itinerary.dates}</p>
        <div className="card-buttons">
          <Link to={`/trip/${itinerary.id}`} className="card-button view">View Details</Link>
          {itinerary.status !== 'past' && (
            <Link to={`/edit/${itinerary.id}`} className="card-button edit">Edit Trip</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;