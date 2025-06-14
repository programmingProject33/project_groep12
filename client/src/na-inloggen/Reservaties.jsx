import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reservaties.css';

const Reservaties = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;
        console.log('userId', userId);
        if (!userId) {
          navigate('/login');
          return;
        }

        console.log("fetching reservations");
        const response = await fetch(`http://localhost:5000/api/reservations/${userId}`);
        console.log("response", response);
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError('Er is een fout opgetreden bij het ophalen van je reserveringen.');
        console.error('Error fetching reservations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-BE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('nl-BE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAnnuleer = async (speed_id) => {
    if (!window.confirm('Weet je zeker dat je deze reservering wilt annuleren?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${speed_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Annuleren mislukt');
      }
      setReservations((prev) => prev.filter((r) => r.speed_id !== speed_id));
    } catch (err) {
      alert('Er is een fout opgetreden bij het annuleren.');
    }
  };

  if (loading) {
    return (
      <div className="reservaties-container">
        <div className="reservaties-content">
          <h1>Mijn Reserveringen</h1>
          <p>Reserveringen laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservaties-container">
        <div className="reservaties-content">
          <h1>Mijn Reserveringen</h1>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reservaties-container">
      <div className="reservaties-content">
        <h1>Mijn Reserveringen</h1>
        {reservations.length === 0 ? (
          <p>Je hebt nog geen reserveringen.</p>
        ) : (
          <div className="reservations-table-wrapper">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Bedrijf</th>
                  <th>Sector</th>
                  <th>Datum</th>
                  <th>Tijd</th>
                  <th>Beschrijving</th>
                  <th>Actie</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.speed_id}>
                    <td>{reservation.bedrijfsnaam}</td>
                    <td>{reservation.sector}</td>
                    <td>{formatDate(reservation.starttijd)}</td>
                    <td>{formatTime(reservation.starttijd)} - {formatTime(reservation.eindtijd)}</td>
                    <td>{reservation.beschrijving}</td>
                    <td>
                      <button className="annuleer-btn" onClick={() => handleAnnuleer(reservation.speed_id)}>
                        Annuleer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservaties; 