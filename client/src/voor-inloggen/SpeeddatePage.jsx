import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const TIME_SLOTS = [
  "9:00-9:10", "9:10-9:20", "9:20-9:30", "9:30-9:40", "9:40-9:50", "9:50-10:00", "10:00-10:10", "10:10-10:20",
  "10:20-10:30", "10:30-10:40", "10:40-10:50", "10:50-11:00", "11:00-11:10", "11:10-11:20", "11:20-11:30", "11:30-11:40",
  "11:40-11:50", "12:00-12:10", "12:10-12:20", "12:20-12:30", "12:30-12:40", "12:40-12:50", "12:50-13:00", "13:00-13:10"
];

export default function SpeeddatePage() {
  const { bedrijfId } = useParams();
  const [bedrijf, setBedrijf] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleReserve = async () => {
    // Debug: log user object
    console.log('user:', user);
    if (!user || !user.id || !bedrijfId) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/speeddate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          bedrijf_id: bedrijfId
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Reservering bevestigd!");
        navigate("/");
      } else {
        console.error('Reservation error:', data);
        alert(data.error || "Er is een fout opgetreden bij het reserveren.");
      }
    } catch (err) {
      alert("Er is een fout opgetreden bij het reserveren.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      {bedrijf && (
        <div style={{ marginBottom: 32, background: "#f5f6fa", borderRadius: 12, padding: "2rem", boxShadow: "0 2px 8px #e5e7eb" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: 18 }}>
            <a href={bedrijf.bedrijf_URL?.startsWith('http') ? bedrijf.bedrijf_URL : `https://${bedrijf.bedrijf_URL}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1e40af', textDecoration: 'underline', fontWeight: 700 }}>
              {bedrijf.naam}
            </a>
          </h1>
          <div style={{ color: '#444', fontSize: '1.18rem', lineHeight: 1.7 }}>
            <div><b>BTW-nummer:</b> {bedrijf.BTW_nr}</div>
            <div><b>Adres:</b> {bedrijf.straatnaam} {bedrijf.huis_nr}{bedrijf.bus_nr && ` bus ${bedrijf.bus_nr}`}, {bedrijf.postcode} {bedrijf.gemeente}</div>
            <div><b>Telefoon:</b> {bedrijf.telefoon_nr}</div>
            <div><b>Email:</b> <a href={`mailto:${bedrijf.email}`} style={{ color: '#1e40af', textDecoration: 'underline' }}>{bedrijf.email}</a></div>
            <div><b>Website:</b> <a href={bedrijf.bedrijf_URL?.startsWith('http') ? bedrijf.bedrijf_URL : `https://${bedrijf.bedrijf_URL}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1e40af', textDecoration: 'underline' }}>{bedrijf.bedrijf_URL}</a></div>
          </div>
        </div>
      )}
      <h2 style={{ marginTop: 0 }}>Reserveer een speeddate</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gap: "0.7rem",
        margin: "2rem 0 1.5rem 0"
      }}>
        {TIME_SLOTS.map((slot, idx) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            style={{
              padding: "1rem 0.2rem",
              background: selectedSlot === slot ? "#2563eb" : "#fca5a5",
              color: selectedSlot === slot ? "#fff" : "#222",
              border: selectedSlot === slot ? "2px solid #2563eb" : "1px solid #fca5a5",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s, border 0.15s"
            }}
          >
            {slot}
          </button>
        ))}
      </div>
      {selectedSlot && (
        <>
          <div style={{ marginTop: 24, fontSize: "1.1rem" }}>
            Geselecteerd tijdslot: <b>{selectedSlot}</b>
          </div>
          <button
            style={{
              marginTop: 18,
              background: loading ? '#a5b4fc' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '0.9rem 2.2rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              boxShadow: '0 1px 4px #e0e7ef'
            }}
            disabled={loading}
            onClick={handleReserve}
          >
            {loading ? 'Reserveren...' : 'Bevestig reservering'}
          </button>
        </>
      )}
    </div>
  );
} 