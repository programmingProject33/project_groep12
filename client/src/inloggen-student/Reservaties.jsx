import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reservaties.css';

const MAX_DESC = 80;

function mapKlasToAula(val) {
  if (!val) return val;
  const match = String(val).match(/^klas\s?(\d)$/i);
  if (match) {
    return `aula ${match[1]}`;
  }
  return val;
}

const Reservaties = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const gebruikerId = user?.gebruiker_id;
        console.log('gebruikerId', gebruikerId);
        if (!gebruikerId) {
          navigate('/login');
          return;
        }

        console.log("fetching reservations");
        const response = await fetch(`http://localhost:5000/api/reservaties/${gebruikerId}`);
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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Wacht op bevestiging', color: '#f59e0b', bgColor: '#fef3c7' },
      accepted: { text: 'Bevestigd', color: '#059669', bgColor: '#d1fae5' },
      rejected: { text: 'Afgewezen', color: '#dc2626', bgColor: '#fee2e2' },
      alternative: { text: 'Alternatief voorstel', color: '#7c3aed', bgColor: '#ede9fe' }
    };
    
    const config = statusConfig[status] || { text: status, color: '#6b7280', bgColor: '#f3f4f6' };
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        color: config.color,
        backgroundColor: config.bgColor
      }}>
        {config.text}
      </span>
    );
  };

  const handleAnnuleer = async (reserveringId) => {
    if (!window.confirm('Weet je zeker dat je deze reservering wilt annuleren? Het bedrijf krijgt hiervan automatisch bericht.')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/reservaties/${reserveringId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Annuleren mislukt');
      }
      
      // Refresh de reserveringen in plaats van alleen te filteren
      const user = JSON.parse(localStorage.getItem('user'));
      const gebruikerId = user?.gebruiker_id;
      const refreshResponse = await fetch(`http://localhost:5000/api/reservaties/${gebruikerId}`);
      const data = await refreshResponse.json();
      setReservations(data);
      
      // Trigger het event om de tijdsloten te updaten
      window.dispatchEvent(new Event('reservationCancelled'));
      
      alert('Reservering succesvol geannuleerd! Het bedrijf heeft hiervan automatisch bericht gekregen.');
    } catch (err) {
      alert(`Er is een fout opgetreden bij het annuleren: ${err.message}`);
      console.error('Error canceling reservation:', err);
    }
  };

  const handleAlternativeResponse = async (reserveringId, accepted) => {
    const action = accepted ? 'accepteren' : 'weigeren';
    if (!window.confirm(`Weet je zeker dat je het alternatieve voorstel wilt ${action}?`)) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/reservaties/${reserveringId}/alternatief-antwoord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accepted }),
      });
      
      if (!response.ok) {
        throw new Error(`Fout bij ${action} van alternatief voorstel`);
      }
      
      // Refresh de reserveringen
      const user = JSON.parse(localStorage.getItem('user'));
      const gebruikerId = user?.gebruiker_id;
      const refreshResponse = await fetch(`http://localhost:5000/api/reservaties/${gebruikerId}`);
      const data = await refreshResponse.json();
      setReservations(data);
      
      alert(`Alternatief voorstel succesvol ${action === 'accepteren' ? 'geaccepteerd' : 'geweigerd'}!`);
    } catch (err) {
      alert(`Er is een fout opgetreden bij het ${action} van het alternatieve voorstel.`);
      console.error('Error responding to alternative:', err);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
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
        <div className="reservaties-intro">
          <span role="img" aria-label="calendar" dangerouslySetInnerHTML={{__html: "&#128197;"}} /> Hier vind je een overzicht van je geplande speeddates. Je kunt ook eenvoudig annuleren indien nodig.
        </div>
        
        {/* Filter reserveringen */}
        {(() => {
          const activeReservations = reservations.filter(r => r.status !== 'rejected');
          const rejectedReservations = reservations.filter(r => r.status === 'rejected');
          
          return (
            <>
              {/* Actieve reserveringen */}
              {activeReservations.length === 0 && rejectedReservations.length === 0 ? (
                <p>Je hebt nog geen reserveringen.</p>
              ) : (
                <>
                  {/* Actieve reserveringen sectie */}
                  {activeReservations.length > 0 && (
                    <>
                      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#1f2937' }}>
                        Actieve Reserveringen
                      </h2>
                      <div className="reservations-table-wrapper">
                        <table className="reservations-table">
                          <thead>
                            <tr>
                              <th><span role="img" aria-label="bedrijf" dangerouslySetInnerHTML={{__html: "&#128188;"}} /> Bedrijf</th>
                              <th><span role="img" aria-label="sector" dangerouslySetInnerHTML={{__html: "&#128278;"}} /> Sector</th>
                              <th><span role="img" aria-label="datum" dangerouslySetInnerHTML={{__html: "&#128197;"}} /> Datum</th>
                              <th><span role="img" aria-label="tijd" dangerouslySetInnerHTML={{__html: "&#128340;"}} /> Tijd</th>
                              <th><span role="img" aria-label="status" dangerouslySetInnerHTML={{__html: "&#128221;"}} /> Status</th>
                              <th><span role="img" aria-label="beschrijving" dangerouslySetInnerHTML={{__html: "&#128221;"}} /> Beschrijving</th>
                              <th><span role="img" aria-label="actie" dangerouslySetInnerHTML={{__html: "&#128465;"}} /></th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeReservations.map((reservation) => {
                              console.log('reservation:', reservation);
                              const desc = reservation.beschrijving || "";
                              const isLong = desc.length > MAX_DESC;
                              const isExpanded = expanded[reservation.reservering_id];
                              
                              // Bepaal welke tijd te tonen (origineel of alternatief)
                              const showTime = reservation.status === 'alternative' && reservation.alt_starttijd 
                                ? { start: reservation.alt_starttijd, end: reservation.alt_eindtijd }
                                : { start: reservation.starttijd, end: reservation.eindtijd };
                              
                              return (
                                <tr key={reservation.reservering_id} className="reservatie-item">
                                  <td>{reservation.bedrijfsnaam}</td>
                                  <td>{reservation.sector}</td>
                                  <td>{formatDate(showTime.start)}</td>
                                  <td>{formatTime(showTime.start)} - {formatTime(showTime.end)}</td>
                                  <td>{getStatusBadge(reservation.status)}</td>
                                  <td>
                                    <div className={`desc-wrapper${isExpanded ? ' expanded' : ''}`}>
                                      {isLong && !isExpanded ? (
                                        <>
                                          {desc.slice(0, MAX_DESC)}...{' '}
                                          <button className="meer-lezen-btn" onClick={() => toggleExpand(reservation.reservering_id)}>
                                            meer lezen
                                          </button>
                                        </>
                                      ) : isLong && isExpanded ? (
                                        <>
                                          {desc}
                                          <button className="meer-lezen-btn" onClick={() => toggleExpand(reservation.reservering_id)}>
                                            minder
                                          </button>
                                        </>
                                      ) : (
                                        desc
                                      )}
                                    </div>
                                    
                                    {/* Toon alternatief voorstel als dat er is */}
                                    {reservation.status === 'alternative' && reservation.alt_starttijd && (
                                      <div style={{
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        backgroundColor: '#fef3c7',
                                        border: '1px solid #f59e0b',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                      }}>
                                        <strong>🔄 Alternatief voorstel:</strong><br/>
                                        {formatDate(reservation.alt_starttijd)}<br/>
                                        {formatTime(reservation.alt_starttijd)} - {formatTime(reservation.alt_eindtijd)}
                                      </div>
                                    )}
                                    
                                    <div style={{marginTop: '1.1rem', padding: '0.7rem 0 0.2rem 0', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '0.2rem'}}>
                                      <span style={{fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.4em'}}>
                                        <span role="img" aria-label="locatie">📍</span> Lokaal: <span style={{fontWeight: 600, color: '#222'}}>{mapKlasToAula(reservation.lokaal) || 'Niet toegewezen'}</span>
                                      </span>
                                      <span style={{fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.4em'}}>
                                        <span role="img" aria-label="verdieping">🏢</span> Verdieping: <span style={{fontWeight: 600, color: '#222'}}>{mapKlasToAula(reservation.verdieping) || 'Onbekend'}</span>
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                      {/* Toon acties op basis van status */}
                                      {reservation.status === 'alternative' && (
                                        <>
                                          <button 
                                            className="accept-btn" 
                                            onClick={() => handleAlternativeResponse(reservation.reservering_id, true)}
                                            style={{
                                              padding: '4px 8px',
                                              backgroundColor: '#059669',
                                              color: 'white',
                                              border: 'none',
                                              borderRadius: '4px',
                                              fontSize: '12px',
                                              cursor: 'pointer'
                                            }}
                                          >
                                            ✅ Accepteren
                                          </button>
                                          <button 
                                            className="reject-btn" 
                                            onClick={() => handleAlternativeResponse(reservation.reservering_id, false)}
                                            style={{
                                              padding: '4px 8px',
                                              backgroundColor: '#dc2626',
                                              color: 'white',
                                              border: 'none',
                                              borderRadius: '4px',
                                              fontSize: '12px',
                                              cursor: 'pointer'
                                            }}
                                          >
                                            ❌ Weigeren
                                          </button>
                                        </>
                                      )}
                                      
                                      {/* Annuleer knop voor alle statussen behalve rejected */}
                                      {reservation.status !== 'rejected' && (
                                        <button 
                                          className="annuleer-btn" 
                                          onClick={() => handleAnnuleer(reservation.reservering_id)}
                                          style={{
                                            padding: '4px 8px',
                                            backgroundColor: '#6b7280',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          🗑️ Annuleren
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  
                  {/* Afgewezen reserveringen sectie */}
                  {rejectedReservations.length > 0 && (
                    <>
                      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#dc2626' }}>
                        Afgewezen Reserveringen
                      </h2>
                      <div className="reservations-table-wrapper">
                        <table className="reservations-table">
                          <thead>
                            <tr>
                              <th><span role="img" aria-label="bedrijf" dangerouslySetInnerHTML={{__html: "&#128188;"}} /> Bedrijf</th>
                              <th><span role="img" aria-label="sector" dangerouslySetInnerHTML={{__html: "&#128278;"}} /> Sector</th>
                              <th><span role="img" aria-label="datum" dangerouslySetInnerHTML={{__html: "&#128197;"}} /> Datum</th>
                              <th><span role="img" aria-label="tijd" dangerouslySetInnerHTML={{__html: "&#128340;"}} /> Tijd</th>
                              <th><span role="img" aria-label="status" dangerouslySetInnerHTML={{__html: "&#128221;"}} /> Status</th>
                              <th><span role="img" aria-label="beschrijving" dangerouslySetInnerHTML={{__html: "&#128221;"}} /> Beschrijving</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rejectedReservations.map((reservation) => {
                              const desc = reservation.beschrijving || "";
                              const isLong = desc.length > MAX_DESC;
                              const isExpanded = expanded[reservation.reservering_id];
                              
                              return (
                                <tr key={reservation.reservering_id} className="reservatie-item" style={{ opacity: 0.7 }}>
                                  <td>{reservation.bedrijfsnaam}</td>
                                  <td>{reservation.sector}</td>
                                  <td>{formatDate(reservation.starttijd)}</td>
                                  <td>{formatTime(reservation.starttijd)} - {formatTime(reservation.eindtijd)}</td>
                                  <td>{getStatusBadge(reservation.status)}</td>
                                  <td>
                                    <div className={`desc-wrapper${isExpanded ? ' expanded' : ''}`}>
                                      {isLong && !isExpanded ? (
                                        <>
                                          {desc.slice(0, MAX_DESC)}...{' '}
                                          <button className="meer-lezen-btn" onClick={() => toggleExpand(reservation.reservering_id)}>
                                            meer lezen
                                          </button>
                                        </>
                                      ) : isLong && isExpanded ? (
                                        <>
                                          {desc}
                                          <button className="meer-lezen-btn" onClick={() => toggleExpand(reservation.reservering_id)}>
                                            minder
                                          </button>
                                        </>
                                      ) : (
                                        desc
                                      )}
                                    </div>
                                    
                                    {/* Toon afwijzingsreden als die er is */}
                                    {reservation.rejection_reason && (
                                      <div style={{
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        backgroundColor: '#fee2e2',
                                        border: '1px solid #dc2626',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                      }}>
                                        <strong>❌ Reden van afwijzing:</strong><br/>
                                        {reservation.rejection_reason}
                                      </div>
                                    )}
                                    
                                    <div style={{marginTop: '1.1rem', padding: '0.7rem 0 0.2rem 0', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '0.2rem'}}>
                                      <span style={{fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.4em'}}>
                                        <span role="img" aria-label="locatie">📍</span> Lokaal: <span style={{fontWeight: 600, color: '#222'}}>{mapKlasToAula(reservation.lokaal) || 'Niet toegewezen'}</span>
                                      </span>
                                      <span style={{fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.4em'}}>
                                        <span role="img" aria-label="verdieping">🏢</span> Verdieping: <span style={{fontWeight: 600, color: '#222'}}>{mapKlasToAula(reservation.verdieping) || 'Onbekend'}</span>
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Reservaties; 