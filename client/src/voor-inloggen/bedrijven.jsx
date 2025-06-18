import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaBuilding, FaHeartbeat, FaTools, FaChalkboardTeacher, FaBullhorn, FaMoneyBillWave } from "react-icons/fa";
import "./bedrijven.css";
import { useAuth } from "../AuthContext.jsx";

// Accentkleuren per sector (of afwisselend)
const sectorColors = [
  "#3b82f6", // blauw
  "#22c55e", // groen
  "#a78bfa", // paars
  "#f59e42", // oranje
  "#f43f5e", // rood
  "#06b6d4", // cyaan
];
const sectorIcons = {
  IT: <FaBuilding />,
  Zorg: <FaHeartbeat />,
  Bouw: <FaTools />,
  Onderwijs: <FaChalkboardTeacher />,
  Marketing: <FaBullhorn />,
  Finance: <FaMoneyBillWave />,
  default: <FaBuilding />
};

function getSectorColor(index, sector) {
  // Je kunt ook per sector kleuren kiezen, nu afwisselend
  return sectorColors[index % sectorColors.length];
}
function getSectorIcon(sector) {
  if (!sector) return sectorIcons.default;
  const key = Object.keys(sectorIcons).find(k => sector.toLowerCase().includes(k.toLowerCase()));
  return key ? sectorIcons[key] : sectorIcons.default;
}

function Bedrijven() {
  const [bedrijven, setBedrijven] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingBedrijfId, setPendingBedrijfId] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const start = Date.now();
    fetch("/api/bedrijven")
      .then((res) => res.json())
      .then((data) => {
        const elapsed = Date.now() - start;
        const minLoading = 600;
        if (elapsed < minLoading) {
          setTimeout(() => {
            setBedrijven(data);
            setIsLoading(false);
          }, minLoading - elapsed);
        } else {
          setBedrijven(data);
          setIsLoading(false);
        }
      })
      .catch((err) => console.error("Fout bij ophalen:", err));
  }, []);

  const handleReserveerClick = (bedrijfId) => {
    if (user) {
      navigate(`/speeddate/${bedrijfId}`);
    } else {
      setPendingBedrijfId(bedrijfId);
      setShowLoginModal(true);
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setPendingBedrijfId(null);
  };

  return (
    <div className="page-container bedrijven-modern-bg">
      {/* Hero golfvorm bovenaan */}
      <div className="bedrijven-hero-wave">
        <svg viewBox="0 0 1440 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#f0f9ff" d="M0,80 C320,180 1120,0 1440,100 L1440,0 L0,0 Z" />
        </svg>
      </div>
      <main className="content-wrap">
        <div className="bedrijven-container">
          <h1 className="bedrijven-title"><span dangerouslySetInnerHTML={{__html: "&#128269;"}} /> Ontdek onze partnerbedrijven</h1>
          <p className="bedrijven-subtitle">Kies je favoriet en plan je speeddates</p>
          <div className="bedrijven-grid">
            {bedrijven
              .sort((a, b) => a.naam.localeCompare(b.naam))
              .map((bedrijf, index) => {
                const accentColor = getSectorColor(index, bedrijf.sector);
                const icon = getSectorIcon(bedrijf.sector);
                return (
                  <div
                    key={bedrijf.bedrijf_id}
                    className="bedrijf-card modern no-bg bedrijf-fadein"
                    style={{
                      '--accent-color': accentColor,
                      '--animation-order': index,
                      animationDelay: '0s'
                    }}
                  >
                    <div className="bedrijf-card-accent"></div>
                    <div className="bedrijf-card-content">
                      <div className="bedrijf-card-icon">{icon}</div>
                      <h2 className="bedrijf-naam">{bedrijf.naam}</h2>
                      <div className="bedrijf-info">
                        <div className="bedrijf-details">
                          <p><span role="img" aria-label="adres" dangerouslySetInnerHTML={{__html: "&#128205;"}} /> {bedrijf.straatnaam} {bedrijf.huis_nr}{bedrijf.bus_nr && ` bus ${bedrijf.bus_nr}`}, {bedrijf.postcode} {bedrijf.gemeente}</p>
                          <p><span role="img" aria-label="email" dangerouslySetInnerHTML={{__html: "&#128231;"}} /> <a href={`mailto:${bedrijf.email}`}>{bedrijf.email}</a></p>
                          <p><span role="img" aria-label="website" dangerouslySetInnerHTML={{__html: "&#127760;"}} /> <a href={bedrijf.bedrijf_URL && bedrijf.bedrijf_URL.startsWith('http') ? bedrijf.bedrijf_URL : `https://${bedrijf.bedrijf_URL}`} target="_blank" rel="noopener noreferrer">{bedrijf.bedrijf_URL}</a></p>
                        </div>
                        <button
                          className="reserveer-btn modern"
                          onClick={() => handleReserveerClick(bedrijf.bedrijf_id)}
                        >
                          <FaCalendarAlt className="btn-icon" style={{ marginRight: 8 }} /> Reserveer speeddate
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-box">
            <div className="login-modal-title">Reserveer een speeddate</div>
            <div className="login-modal-content">
              Log in om beschikbare tijdsloten te zien en een speeddate te reserveren.
            </div>
            <button className="login-modal-btn" onClick={() => navigate('/login')}>
              Inloggen
            </button>
            <button className="login-modal-close" onClick={closeModal} title="Sluiten">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bedrijven; 