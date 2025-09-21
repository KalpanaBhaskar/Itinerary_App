import React from 'react';
import './../assets/styles/CuratedPlaceCard.css';

const CuratedPlaceCard = ({ place }) => {
  const getSafetyClass = (safety) => {
    switch (safety) {
      case 'High':
        return 'safety-high';
      case 'Medium':
        return 'safety-medium';
      case 'Low':
        return 'safety-low';
      default:
        return '';
    }
  };

  return (
    <div className="curated-place-card">
      <img src={place.image} alt={place.name} className="place-image" />
      <div className="place-details">
        <div className="header-row">
          <h4 className="place-name">{place.name}</h4>
          <span className="suggested-timing">{place.suggested_timing}</span>
        </div>
        <p className="place-description">{place.description}</p>
        <div className="info-row">
          <span className={`place-safety ${getSafetyClass(place.safety_level)}`}>
            {place.safety_level === 'Low' && 'Unsafe'}
          </span>
          <span className="place-crowd">{place.crowd_level} crowd</span>
        </div>
      </div>
      <div className="place-actions">
        <button className="add-button">Add to Itinerary</button>
        <button className="remove-button">Remove</button>
      </div>
    </div>
  );
};

export default CuratedPlaceCard;