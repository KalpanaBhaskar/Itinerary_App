import React from 'react';
import './../assets/styles/CuratedPlaceCard.css';

const CuratedPlaceCard = ({ place, onAddPlace, onRemovePlace, isSelected }) => {
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

  const getSafetyText = (safety) => {
    switch (safety) {
      case 'High':
        return 'Safe';
      case 'Medium':
        return 'Moderate Safety';
      case 'Low':
        return 'Unsafe';
      default:
        return 'Unknown';
    }
  };

  const getCrowdClass = (crowd) => {
    if (!crowd) return '';
    switch (crowd.toLowerCase()) {
      case 'high':
        return 'crowd-high';
      case 'medium':
        return 'crowd-medium';
      case 'low':
        return 'crowd-low';
      default:
        return '';
    }
  };

  const handleButtonClick = () => {
    if (isSelected) {
      onRemovePlace(place.id);
    } else {
      onAddPlace(place);
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
            {getSafetyText(place.safety_level)}
          </span>
          <span className={`place-crowd ${getCrowdClass(place.crowd_level)}`}>{place.crowd_level} crowd</span>
        </div>
      </div>
      <div className="place-actions">
        <button
          className={`add-button ${isSelected ? 'added' : ''}`}
          onClick={handleButtonClick}
        >
          {isSelected ? 'Added' : 'Add to Itinerary'}
        </button>
      </div>
    </div>
  );
};

export default CuratedPlaceCard;