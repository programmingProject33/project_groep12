import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "./SpeeddatePage.css";

export default function SpeeddatePage() {
  const { bedrijfId } = useParams();
  const [bedrijf, setBedrijf] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeslots, setTimeslots] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    // Fetch timeslots for this bedrijf
    fetch(`http://localhost:5000/api/speeddates/${bedrijfId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTimeslots(data);
      });
  }, [bedrijfId]);

  const handleReserve = async () => {
    if (!user || !user.id || !bedrijfId || !selectedSlot) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/speeddate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          bedrijf_id: bedrijfId,
          speed_id: selectedSlot.speed_id
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Reservering bevestigd!");
        navigate("/");
      } else {
        alert(data.error || "Er is een fout opgetreden bij het reserveren.");
      }
    } catch (err) {
      alert("Er is een fout opgetreden bij het reserveren.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format ISO time to HH:mm
  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  return (
    <div className="speeddate-container">
      {bedrijf && (
        <>
          <div className="speeddate-header">{bedrijf.naam}</div>
          <div className="speeddate-labels">
            <span className="speeddate-label">Sector: {bedrijf.sector || "IT"}</span>
            <span className="speeddate-label">Dienstverband: stage</span>
          </div>

          <div className="speeddate-box">
            <div className="speeddate-title">Wie zijn we:</div>
            <div style={{ marginBottom: 12 }}>{bedrijf.beschrijving || "Welkom bij ICT-Talents, waar we de toekomst van technologie vormgeven door middel van innovatie en talent! Bij ons geen on-the-job, maar een duurzame relatie die langdurig meegaat en een eindeloze loop in je code. Wij zijn op zoek naar een enthousiaste .NET Developer om ons dynamisch team te versterken."}</div>
            <div className="speeddate-title">Dit zoeken we:</div>
            <ul className="speeddate-list">
              <li>Je beheerst Nederlands, hebt kennis Engels.</li>
              <li>Affiniteit met .NET, C#, SQL, Azure is een mooie extra!</li>
            </ul>
          </div>

          <div className="speeddate-slots-box">
            <div className="speeddate-slots-title">Reserveer een speeddate</div>
            <div className="speeddate-slots-grid">
              {timeslots.map((slot) => (
                <button
                  key={slot.speed_id}
                  className={`speeddate-slot-btn${slot.is_bezet ? " reserved" : ""}${selectedSlot && selectedSlot.speed_id === slot.speed_id ? " selected" : ""}`}
                  onClick={() => !slot.is_bezet && setSelectedSlot(slot)}
                  type="button"
                  disabled={slot.is_bezet}
                >
                  {formatTime(slot.starttijd)} - {formatTime(slot.eindtijd)}
                </button>
              ))}
            </div>
            {selectedSlot && (
              <>
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
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
} 