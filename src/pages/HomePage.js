import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from '../components/Calendar';
import ItineraryCard from '../components/ItineraryCard';
import './../assets/styles/HomePage.css';
import background from './../assets/images/home-background.jpg';
import { getItineraries } from '../services/api';

const HomePage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('upcoming');

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await getItineraries();
        const formattedItineraries = response.data.map(item => ({
          id: item.id,
          title: item.title,
          dates: `${item.start_date} - ${item.end_date}`,
          status: item.status,
          dateRange: [new Date(item.start_date), new Date(item.end_date)]
        }));
        setItineraries(formattedItineraries);
      } catch (err) {
        setError('Failed to fetch itineraries.');
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  const filteredItineraries = itineraries.filter(
    (trip) => trip.status === activeFilter
  );

  const highlightedDates = itineraries.flatMap(trip => {
    if (trip.dateRange) {
      const dates = [];
      let currentDate = new Date(trip.dateRange[0]);
      while (currentDate <= trip.dateRange[1]) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    }
    return [];
  });

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="home-page-container" style={{ backgroundImage: `url(${background})` }}>
      <header className="home-header">
        <h1 className="logo">Yatra Planner</h1>
        <nav className="main-nav">
          <Link to="/" className="nav-link">My Itineraries</Link>
          {/* Login button removed as per your request */}
        </nav>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h1>Plan Your Journey, Perfectly.</h1>
          <p>Create a detailed, safe, and personalized itinerary for your next adventure across India.</p>
          <div className="cta-buttons">
            <Link to="/plan" className="cta-button primary">Start Planning</Link>
            <Link to="/explore" className="cta-button secondary">Explore Destinations</Link>
          </div>
        </div>
      </main>

      <section className="below-fold-content">
        <div className="itinerary-section-header">
          <h2>My Itineraries</h2>
        </div>
        <div className="main-itinerary-content">
          <div className="calendar-card card">
            <Calendar highlightedDates={highlightedDates} />
          </div>
          <div className="itinerary-list-card card">
            <div className="filter-tabs">
              <button
                className={`filter-tab ${activeFilter === 'ongoing' ? 'active' : ''}`}
                onClick={() => setActiveFilter('ongoing')}
              >
                Ongoing
              </button>
              <button
                className={`filter-tab ${activeFilter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveFilter('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`filter-tab ${activeFilter === 'past' ? 'active' : ''}`}
                onClick={() => setActiveFilter('past')}
              >
                Past
              </button>
            </div>
            <div className="itinerary-list">
              {filteredItineraries.length > 0 ? (
                filteredItineraries.map((itinerary) => (
                  <ItineraryCard key={itinerary.id} itinerary={itinerary} />
                ))
              ) : (
                <p className="no-itineraries">No itineraries found.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;