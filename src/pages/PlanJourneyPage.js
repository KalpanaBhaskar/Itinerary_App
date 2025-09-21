import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProgressBar from '../components/ProgressBar';
import CuratedPlaceCard from '../components/CuratedPlaceCard';
import ItineraryDay from '../components/ItineraryDay';
import './../assets/styles/PlanJourneyPage.css';
import { createItinerary, getDestinations } from '../services/api';

const PlanJourneyPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    tripTitle: '',
    state: '',
    location: '',
    startDate: null,
    endDate: null,
    budget: 50000,
    safetyLevel: 'Moderate - Well-known places',
    crowdComfort: 'Balanced - Mix of popular & quiet',
  });
  const [allDestinations, setAllDestinations] = useState([]);
  const [curatedPlaces, setCuratedPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState(new Set());
  const [finalItinerary, setFinalItinerary] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await getDestinations();
        setAllDestinations(response.data);
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (formData.state && formData.state !== 'Select an Indian state') {
      const filtered = allDestinations.filter(d => d.state === formData.state);
      setCuratedPlaces(filtered);
    } else {
      setCuratedPlaces([]);
    }
  }, [formData.state, allDestinations]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFormData((prev) => ({ ...prev, startDate: start, endDate: end }));
  };

  const handleBudgetChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, budget: parseInt(value) }));
  };

  const handleAddPlace = (place) => {
    setSelectedPlaces((prevPlaces) => new Set(prevPlaces).add(place));
  };

  const handleRemovePlace = (placeId) => {
    setSelectedPlaces((prevPlaces) => {
      const newSet = new Set(prevPlaces);
      newSet.forEach(p => {
        if(p.id === placeId) newSet.delete(p);
      });
      return newSet;
    });
  };

  const handleTimingChange = (dayIndex, placeIndex, newTiming) => {
    const newItinerary = [...finalItinerary];
    newItinerary[dayIndex].places[placeIndex].timing = newTiming;
    setFinalItinerary(newItinerary);
  };

  const handleReset = () => {
    setSelectedPlaces(new Set());
    setFinalItinerary([]);
    setFormData({
      ...formData,
      tripTitle: '',
    });
  };

  const generateItinerary = () => {
    if (selectedPlaces.size === 0) {
      return [];
    }
    const itinerary = [{
      day: 1,
      date: 'Day 1',
      places: Array.from(selectedPlaces).map(place => ({
        id: place.id,
        name: place.name,
        timing: place.suggested_timing || 'Morning',
      })),
    }];
    return itinerary;
  };

  const handleSaveItinerary = async () => {
    if (!formData.startDate || !formData.endDate) {
      alert('Please select a start and end date for your trip.');
      return;
    }
    if (selectedPlaces.size === 0) {
      alert('Please add some places to your itinerary before saving.');
      return;
    }
    if (!formData.tripTitle) {
      alert('Please give your itinerary a title.');
      return;
    }

    const newItinerary = {
      title: formData.tripTitle,
      start_date: formData.startDate.toISOString().split('T')[0],
      end_date: formData.endDate.toISOString().split('T')[0],
      itinerary_data: finalItinerary,
      status: 'upcoming',
    };

    try {
      await createItinerary(newItinerary);
      alert('Itinerary saved successfully!');
      navigate('/');
    } catch (error) {
      alert('Failed to save itinerary.');
      console.error('Error saving itinerary:', error);
    }
  };

  const handleNextStep = (step) => {
    if (step === 3) {
      setFinalItinerary(generateItinerary());
    }
    setCurrentStep(step);
  };

  const states = ['Select an Indian state', 'Delhi', 'Goa', 'Karnataka', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'Uttarakhand'];
  const locations = { 'Delhi': ['New Delhi', 'Old Delhi'], 'Goa': ['North Goa', 'South Goa'], 'Karnataka': ['Bangalore', 'Mysore'], 'Maharashtra': ['Mumbai', 'Pune'], 'Punjab': ['Amritsar'], 'Rajasthan': ['Jaipur', 'Udaipur'], 'Tamil Nadu': ['Chennai', 'Madurai'], 'Uttar Pradesh': ['Agra', 'Varanasi', 'Lucknow'], 'Uttarakhand': ['Dehradun', 'Rishikesh'] };
  const safetyOptions = ['Low - Remote & Adventurous', 'Moderate - Well-known places', 'High - Family-friendly & secure'];
  const crowdOptions = ['Quiet - Few tourists', 'Balanced - Mix of popular & quiet', 'Busy - High tourist traffic'];
  
  return (
    <div className="plan-journey-container">
      <header className="plan-journey-header">
        <Link to="/" className="back-button">←</Link>
        <div className="header-content">
          <h1 className="plan-title">Plan Your Journey</h1>
          <p className="plan-subtitle">Create your perfect Indian adventure with our curated destinations</p>
        </div>
      </header>

      <ProgressBar currentStep={currentStep} totalSteps={3} />

      {currentStep === 1 && (
        <div className="plan-step-content">
          <div className="card destination-card">
            <h2 className="card-title">Choose Your Destination</h2>
            <div className="form-group">
              <label htmlFor="state">Select State</label>
              <select id="state" name="state" value={formData.state} onChange={handleInputChange} className="form-control">
                {states.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="location">Specific Location</label>
              <select id="location" name="location" value={formData.location} onChange={handleInputChange} className="form-control" disabled={!formData.state || formData.state === 'Select an Indian state'}>
                <option value="">e.g., Agra, Jaipur, Goa...</option>
                {formData.state && formData.state !== 'Select an Indian state' && locations[formData.state]?.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
              </select>
            </div>
            <div className="form-group date-input-group">
              <label htmlFor="dateRange">Trip Dates</label>
              <DatePicker
                selected={formData.startDate}
                onChange={handleDateChange}
                startDate={formData.startDate}
                endDate={formData.endDate}
                selectsRange
                dateFormat="dd-MM-yyyy"
                placeholderText="Select a date range"
                className="form-control date-picker"
                wrapperClassName="date-picker-wrapper"
              />
            </div>
          </div>
          <div className="card preferences-card">
            <h2 className="card-title">Your Preferences</h2>
            <div className="form-group">
              <label>Budget: ₹{formData.budget.toLocaleString()}</label>
              <input type="range" min="10000" max="200000" step="10000" name="budget" value={formData.budget} onChange={handleBudgetChange} className="budget-slider" />
              <div className="budget-range-labels"><span>₹10,000</span><span>₹2,00,000</span></div>
            </div>
            <div className="form-group">
              <label htmlFor="safetyLevel">Safety Level</label>
              <select id="safetyLevel" name="safetyLevel" value={formData.safetyLevel} onChange={handleInputChange} className="form-control">
                {safetyOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="crowdComfort">Crowd Comfort</label>
              <select id="crowdComfort" name="crowdComfort" value={formData.crowdComfort} onChange={handleInputChange} className="form-control">
                {crowdOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
            </div>
            <button className="next-step-button" onClick={() => handleNextStep(2)}>Next: View Curated Places</button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="plan-step-content step-two">
          <div className="card full-width-card">
            <h2 className="card-title">Curated Places</h2>
            <div className="form-group">
              <label htmlFor="tripTitle">Trip Title</label>
              <input type="text" id="tripTitle" name="tripTitle" value={formData.tripTitle} onChange={handleInputChange} placeholder="e.g., Rajasthan Tour" className="form-control" />
            </div>
            <div className="curated-places-list">
              {curatedPlaces.map(place => (
                <CuratedPlaceCard key={place.id} place={place} onAddPlace={handleAddPlace} onRemovePlace={handleRemovePlace} isSelected={Array.from(selectedPlaces).some((p) => p.id === place.id)} />
              ))}
            </div>
            <div className="navigation-buttons">
              <button className="prev-button" onClick={() => setCurrentStep(1)}>← Previous</button>
              <button className="next-button" onClick={() => handleNextStep(3)}>Next: View Itinerary →</button>
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="plan-step-content step-three">
          <div className="card full-width-card">
            <div className="step-three-header">
              <h2 className="card-title">Your Perfect Itinerary</h2>
              <div className="itinerary-actions">
                <button className="reset-button" onClick={handleReset}>Reset</button>
                <button className="save-button" onClick={handleSaveItinerary}>Save Itinerary</button>
              </div>
            </div>
            <div className="itinerary-days-list">
              {finalItinerary.map((day, index) => (
                <ItineraryDay key={index} day={day} onTimingChange={handleTimingChange} dayIndex={index} />
              ))}
            </div>
            <div className="navigation-buttons">
              <button className="prev-button" onClick={() => setCurrentStep(2)}>← Previous</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanJourneyPage;