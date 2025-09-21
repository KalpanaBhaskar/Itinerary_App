import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './../assets/styles/TripDetailsPage.css';
import { getItineraryById, updateItinerary, deleteItinerary } from '../services/api';

const TripDetailsPage = () => {
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
    const updatedItinerary = [...editedTrip.itinerary];
    updatedItinerary[dayIndex].places[placeIndex][field] = value;
    setEditedTrip({ ...editedTrip, itinerary: updatedItinerary });
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
      setTrip(editedTrip); // Update local state with saved changes
    } catch (error) {
      alert('Failed to save changes.');
      console.error('Error saving changes:', error);
    }
  };

  const handleAddPlace = (dayIndex) => {
    const updatedItinerary = [...editedTrip.itinerary];
    const newPlace = { id: Date.now(), name: '', timing: '' };
    updatedItinerary[dayIndex].places.push(newPlace);
    setEditedTrip({ ...editedTrip, itinerary: updatedItinerary });
  };

  const handleRemovePlace = (dayIndex, placeIndex) => {
    const updatedItinerary = [...editedTrip.itinerary];
    updatedItinerary[dayIndex].places.splice(placeIndex, 1);
    setEditedTrip({ ...editedTrip, itinerary: updatedItinerary });
  };

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
                <div key={place.id} className="place-item">
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
                          <input
                            type="text"
                            value={place.timing}
                            onChange={(e) => handleEditChange(dayIndex, placeIndex, 'timing', e.target.value)}
                            className="edit-input"
                            placeholder="Timing (e.g., Morning)"
                          />
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