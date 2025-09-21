import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProgressBar from '../components/ProgressBar';
import CuratedPlaceCard from '../components/CuratedPlaceCard';
import ItineraryDay from '../components/ItineraryDay';
import './../assets/styles/PlanJourneyPage.css';
import { createItinerary } from '../services/api';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFormData((prev) => ({ ...prev, startDate: start, endDate: end }));
  };

  const handleBudgetChange = (e) => {
    setFormData((prev) => ({ ...prev, budget: parseInt(e.target.value) }));
  };

  // Placeholder for the "curated places"
  const curatedPlaces = [
    //... (same as before)
  ];

  // Placeholder for the "generated itinerary"
  const generatedItinerary = [
    //... (same as before)
  ];

  const states = ['Select an Indian state', 'Delhi', 'Goa', 'Karnataka', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'Uttarakhand'];
  const locations = {
    'Delhi': ['New Delhi', 'Old Delhi'],
    'Goa': ['North Goa', 'South Goa'],
    'Karnataka': ['Bangalore', 'Mysore'],
    'Maharashtra': ['Mumbai', 'Pune'],
    'Punjab': ['Amritsar'],
    'Rajasthan': ['Jaipur', 'Udaipur'],
    'Tamil Nadu': ['Chennai', 'Madurai'],
    'Uttar Pradesh': ['Agra', 'Varanasi', 'Lucknow'],
    'Uttarakhand': ['Dehradun', 'Rishikesh']
  };

  const safetyOptions = ['Low - Remote & Adventurous', 'Moderate - Well-known places', 'High - Family-friendly & secure'];
  const crowdOptions = ['Quiet - Few tourists', 'Balanced - Mix of popular & quiet', 'Busy - High tourist traffic'];

  const handleSaveItinerary = async () => {
    const newItinerary = {
      title: formData.tripTitle,
      start_date: formData.startDate.toISOString().split('T')[0],
      end_date: formData.endDate.toISOString().split('T')[0],
      itinerary_data: generatedItinerary, // This will be the full itinerary data
      status: 'upcoming'
    };

    try {
      await createItinerary(newItinerary);
      alert('Itinerary saved successfully!');
      navigate('/'); // Navigate back to the home page
    } catch (error) {
      alert('Failed to save itinerary.');
      console.error('Error saving itinerary:', error);
    }
  };

  return (
    <div className="plan-journey-container">
      {/* ... (existing JSX for steps 1, 2, and 3) ... */}
      {currentStep === 3 && (
        <div className="plan-step-content step-three">
          <div className="card full-width-card">
            <div className="step-three-header">
              <h2 className="card-title">Your Perfect Itinerary</h2>
              <div className="itinerary-actions">
                <button className="reset-button">Reset</button>
                <button className="save-button" onClick={handleSaveItinerary}>
                  Save Itinerary
                </button>
              </div>
            </div>
            <div className="itinerary-days-list">
              {generatedItinerary.map(day => (
                <ItineraryDay key={day.day} day={day} />
              ))}
            </div>
            <div className="navigation-buttons">
              <button className="prev-button" onClick={() => setCurrentStep(2)}>
                ← Previous
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanJourneyPage;