import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './../assets/styles/TripDetailsPage.css';
import { getItineraryById, updateItinerary, deleteItinerary } from '../services/api';

const TripDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await getItineraryById(id);
        const fetchedTrip = {
            id: response.data.id,
            title: response.data.title,
            dates: `${response.data.start_date} - ${response.data.end_date}`,
            itinerary: response.data.itinerary_data
        }
        setTrip(fetchedTrip);
        setEditedTrip(fetchedTrip);
      } catch (err) {
        setError('Failed to fetch trip details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleEditChange = (dayIndex, placeIndex, field, value) => {
    const updatedItinerary = { ...editedTrip };
    updatedItinerary.itinerary[dayIndex].places[placeIndex][field] = value;
    setEditedTrip(updatedItinerary);
  };

  const handleSave = async () => {
    try {
      await updateItinerary(id, {
        title: editedTrip.title,
        start_date: editedTrip.dates.split(' - ')[0],
        end_date: editedTrip.dates.split(' - ')[1],
        itinerary_data: editedTrip.itinerary,
        status: 'upcoming'
      });
      alert('Itinerary updated successfully!');
      setIsEditing(false);
      setTrip(editedTrip);
    } catch (error) {
      alert('Failed to save changes.');
      console.error('Error saving changes:', error);
    }
  };
  
  const handleAddPlace = (dayIndex) => {
    const updatedItinerary = { ...editedTrip };
    const newPlace = { id: Date.now(), name: '', timing: 'Morning' };
    updatedItinerary.itinerary[dayIndex].places.push(newPlace);
    setEditedTrip(updatedItinerary);
  };

  const handleRemovePlace = (dayIndex, placeIndex) => {
    const updatedItinerary = { ...editedTrip };
    updatedItinerary.itinerary[dayIndex].places.splice(placeIndex, 1);
    setEditedTrip(updatedItinerary);
  };

  const handleDeleteTrip = async () => {
      if(window.confirm('Are you sure you want to delete this trip?')) {
          try {
              await deleteItinerary(id);
              alert('Trip deleted successfully!');
              navigate('/');
          } catch (error) {
              alert('Failed to delete trip.');
              console.error('Error deleting trip:', error);
          }
      }
  }

  const timings = ['Morning', 'Afternoon', 'Evening'];

  if (loading) return <div className="loading-state">Loading trip details...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!trip) return <div className="no-trip-state">No trip found with this ID.</div>;

  return (
    <div className="trip-details-container">
      <header className="trip-details-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <div className="header-content">
          <h1 className="trip-details-title">{trip.title}</h1>
          <p className="trip-details-subtitle">{trip.dates}</p>
        </div>
        <div className="actions-section">
          <button onClick={() => setIsEditing(!isEditing)} className="edit-toggle-button">
            {isEditing ? 'Cancel' : 'Edit Trip'}
          </button>
          {isEditing && (
            <button onClick={handleSave} className="save-button">
              Save Changes
            </button>
          )}
          <button onClick={handleDeleteTrip} className="delete-button">
            Delete Trip
          </button>
        </div>
      </header>

      <div className="itinerary-section">
        {editedTrip.itinerary.map((day, dayIndex) => (
          <div key={dayIndex} className="itinerary-day-card card">
            <h3 className="day-header">
              Day {day.day} - {day.date}
            </h3>
            <div className="places-list">
              {day.places.map((place, placeIndex) => (
                <div key={placeIndex} className="place-item">
                  <div className="place-details-row">
                    <div className="place-details-content">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={place.name}
                            onChange={(e) => handleEditChange(dayIndex, placeIndex, 'name', e.target.value)}
                            className="edit-input"
                            placeholder="Place Name"
                          />
                          <select
                            value={place.timing}
                            onChange={(e) => handleEditChange(dayIndex, placeIndex, 'timing', e.target.value)}
                            className="edit-select"
                          >
                            {timings.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </>
                      ) : (
                        <>
                          <span className="place-timing">{place.timing}</span>
                          <span className="place-name">{place.name}</span>
                        </>
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleRemovePlace(dayIndex, placeIndex)}
                        className="remove-place-button"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isEditing && (
                <button onClick={() => handleAddPlace(dayIndex)} className="add-place-button">
                  + Add Place
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripDetailsPage;