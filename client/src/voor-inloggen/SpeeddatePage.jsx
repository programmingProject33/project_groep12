import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "./SpeeddatePage.css";

export default function SpeeddatePage() {
  const { bedrijfId } = useParams();
  const [bedrijf, setBedrijf] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeslots, setTimeslots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userReservations, setUserReservations] = useState([]);
  const reservationSectionRef = useRef(null);

  const fetchTimeslots = async () => {
    setLoadingSlots(true);
    try {
      const response = await fetch(`http://localhost:5000/api/speeddates/${bedrijfId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timeslots');
      }
      const data = await response.json();
      setTimeslots(data);
    } catch (err) {
      console.error('Error fetching timeslots:', err);
      setErrorMessage('Er is een fout opgetreden bij het ophalen van de tijdsloten.');
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    // Fetch bedrijf details by ID
    fetch("http://localhost:5000/api/bedrijven")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((b) => String(b.bedrijf_id) === String(bedrijfId));
        setBedrijf(found);
      });
  }, [bedrijfId]);

  useEffect(() => {
    // Alleen tijdsloten ophalen als de gebruiker is ingelogd
    if (user) {
      fetchTimeslots();
    }
  }, [bedrijfId, user]);

  // Luister naar het 'reservationCancelled' event
  useEffect(() => {
    const handleReservationCancelled = () => {
      fetchTimeslots();
    };

    window.addEventListener('reservationCancelled', handleReservationCancelled);
    return () => {
      window.removeEventListener('reservationCancelled', handleReservationCancelled);
    };
  }, []);

  useEffect(() => {
    // Haal alle reserveringen van de student op
    async function fetchUserReservations() {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:5000/api/reservaties/${user.gebruiker_id}`);
        if (res.ok) {
          const data = await res.json();
          setUserReservations(data);
        }
      } catch (e) {}
    }
    fetchUserReservations();
  }, [user]);

  // Check of student al een reservering heeft bij dit bedrijf
  const existingReservation = userReservations.find(r => String(r.bedrijf_id) === String(bedrijfId));

  // Verzamel alle reeds gereserveerde tijdstippen van de student
  const reservedTimes = userReservations.map(r => r.starttijd);

  // Verzamel alle bezette tijdsloten bij dit bedrijf (alleen geaccepteerde reserveringen)
  const takenSlots = timeslots.filter(slot => {
    // Check of er een geaccepteerde reservering is voor dit tijdslot
    return userReservations.some(reservation => 
      reservation.speed_id === slot.speed_id && reservation.status === 'accepted'
    );
  });
  if (bedrijf && process.env.NODE_ENV !== 'production') {
    console.log(`Bezet bij bedrijf ${bedrijf.naam} (${bedrijfId}):`, takenSlots.map(s => ({ tijd: s.starttijd, gebruiker_id: s.gebruiker_id })));
  }

  const handleReserve = async () => {
    if (!user || !user.gebruiker_id) {
      navigate('/login');
      return;
    }
    if (!bedrijfId || !selectedSlot) return;
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/reserveren", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: user.gebruiker_id,
          bedrijf_id: bedrijfId,
          speed_id: selectedSlot.speed_id
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Reservering succesvol aangemaakt! Het bedrijf zal je reservering beoordelen.");
        navigate("/student/reservaties");
      } else {
        setErrorMessage(data.error || "Er is een fout opgetreden bij het reserveren.");
      }
    } catch (err) {
      setErrorMessage("Er is een fout opgetreden bij het reserveren.");
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    // Use setTimeout to ensure the element is rendered before scrolling
    setTimeout(() => {
      reservationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Helper to format SQL datetime string to HH:mm
  function formatTime(datetimeString) {
    const date = new Date(datetimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  // Filter timeslots: geen slots tussen 13:00 en 14:00
  function isNotPauseSlot(slot) {
    // Pak het uur direct uit de string
    const hour = parseInt(slot.starttijd.slice(11, 13), 10);
    // 13:00:00 t.e.m. 13:59:59
    return hour !== 13;
  }

  return (
    <div className="speeddate-container">
      {bedrijf && (
        <>
          <div className="speeddate-header">{bedrijf.naam}</div>
          <div className="speeddate-labels">
            <span className="speeddate-label">Sector: {bedrijf.sector || "N.v.t."}</span>
            <span className="speeddate-label">Dienstverband: {(bedrijf.dienstverbanden && bedrijf.dienstverbanden.length > 0) ? bedrijf.dienstverbanden.join(', ') : 'N.v.t.'}</span>
          </div>

          <div className="speeddate-box">
            <div className="speeddate-title">Wie zijn we:</div>
            <div style={{ marginBottom: 12 }}>{bedrijf.beschrijving || "Geen beschrijving beschikbaar."}</div>
            
            <div className="speeddate-title">Dit zoeken we in een kandidaat:</div>
            <div style={{ marginBottom: 12 }}>{bedrijf.gezocht_profiel_omschrijving || "Geen specifieke omschrijving beschikbaar."}</div>

            {bedrijf.gezochte_opleidingen && (
              <>
                <div className="speeddate-title">Specifiek op zoek naar opleidingen:</div>
                <ul className="speeddate-list">
                  {bedrijf.gezochte_opleidingen.split(',')
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                </ul>
              </>
            )}
          </div>

          <div className="speeddate-slots-box">
            {existingReservation && (
              <div style={{background:'#e0fbe6', color:'#166534', borderRadius:8, padding:'1rem', marginBottom:16, fontWeight:600, fontSize:'1.08rem', textAlign:'center'}}>
                ✅ Je hebt een reservering op {formatTime(existingReservation.starttijd)} - {formatTime(existingReservation.eindtijd)} bij dit bedrijf.
              </div>
            )}
            {errorMessage && (
              <div style={{ color: 'red', marginBottom: 16, fontWeight: 500 }}>
                {errorMessage}
              </div>
            )}
            <div className="speeddate-slots-title">Reserveer een speeddate</div>
            
            {!user ? (
              <div className="login-prompt">
                <p>Log in om beschikbare tijdsloten te zien en een speeddate te reserveren.</p>
                <button 
                  className="login-button"
                  onClick={() => navigate('/login')}
                >
                  Inloggen
                </button>
              </div>
            ) : (
              <>
                <div className="speeddate-slots-grid">
                  {loadingSlots ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#2563eb', fontWeight: 600, fontSize: '1.1rem', padding: '1.5rem 0' }}>
                      Tijdsloten laden...
                    </div>
                  ) : timeslots.filter(isNotPauseSlot).length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b', fontWeight: 500, fontSize: '1.1rem', padding: '1.5rem 0' }}>
                      Er zijn momenteel geen tijdsloten beschikbaar voor dit bedrijf.
                    </div>
                  ) : (
                    timeslots.filter(isNotPauseSlot).map((slot) => {
                      // Blokkeer slot als het tijdstip al door deze student is gereserveerd (bedrijf-onafhankelijk)
                      const isOwnReserved = reservedTimes.includes(slot.starttijd);
                      // Blokkeer slot als het al bezet is door een andere student bij dit bedrijf (alleen geaccepteerde reserveringen)
                      const isTakenByOther = userReservations.some(reservation => 
                        reservation.speed_id === slot.speed_id && 
                        reservation.status === 'accepted' && 
                        reservation.student_id !== user.gebruiker_id
                      );
                      return (
                        <button
                          key={slot.speed_id}
                          className={`speeddate-slot-btn${isTakenByOther || isOwnReserved ? " reserved" : ""}${selectedSlot && selectedSlot.speed_id === slot.speed_id ? " selected" : ""}`}
                          onClick={() => !isTakenByOther && !isOwnReserved && handleSlotClick(slot)}
                          type="button"
                          disabled={isTakenByOther || isOwnReserved}
                        >
                          {formatTime(slot.starttijd)} - {formatTime(slot.eindtijd)}
                        </button>
                      );
                    })
                  )}
                </div>
                {selectedSlot && (
                  <div ref={reservationSectionRef}>
                    <div style={{ marginTop: 24, fontSize: "1.1rem" }}>
                      Geselecteerd tijdslot: <b>{formatTime(selectedSlot.starttijd)} - {formatTime(selectedSlot.eindtijd)}</b>
                    </div>
                    <button
                      className="speeddate-reserveer-btn"
                      style={{ marginTop: 18 }}
                      disabled={loading}
                      onClick={handleReserve}
                    >
                      {loading ? 'Reserveren...' : 'Bevestig reservering'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
} 