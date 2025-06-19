import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaBuilding, FaHeartbeat, FaTools, FaChalkboardTeacher, FaBullhorn, FaMoneyBillWave, FaSearch } from "react-icons/fa";
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
  const [filteredBedrijven, setFilteredBedrijven] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingBedrijfId, setPendingBedrijfId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(9);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetch("/api/bedrijven")
      .then((res) => res.json())
      .then((data) => {
        setBedrijven(data);
        setFilteredBedrijven(data);
        setIsLoading(false);
      })
      .catch((err) => console.error("Fout bij ophalen:", err));
  }, []);

  // Filter bedrijven based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBedrijven(bedrijven);
      setVisibleCount(9);
    } else {
      const filtered = bedrijven.filter(bedrijf =>
        bedrijf.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bedrijf.gemeente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bedrijf.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bedrijf.beschrijving?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBedrijven(filtered);
      setVisibleCount(9);
    }
  }, [searchTerm, bedrijven]);

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
          
          {/* Zoekbalk */}
          <div className="search-container" style={{
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div className="search-box" style={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px'
            }}>
              <FaSearch style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                fontSize: '1.1rem'
              }} />
              <input
                type="text"
                placeholder="Zoek op bedrijfsnaam, plaats, sector of beschrijving..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '1rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  background: '#fff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#64748b'
                }}
              >
                Wissen
              </button>
            )}
          </div>

          {/* Resultaten teller */}
          {searchTerm && (
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
              color: '#64748b',
              fontSize: '1rem'
            }}>
              {filteredBedrijven.length} bedrijf{filteredBedrijven.length !== 1 ? 'en' : ''} gevonden
            </div>
          )}

          <div className="bedrijven-grid">
            {filteredBedrijven
              .sort((a, b) => a.naam.localeCompare(b.naam))
              .slice(0, visibleCount)
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
                      animationDelay: '0s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div className="bedrijf-card-accent"></div>
                    <div className="bedrijf-card-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '2.2rem 1.5rem 1.5rem 1.5rem', justifyContent: 'center'}}>
                      <div className="bedrijf-card-icon" style={{marginBottom: '1.1rem', alignSelf: 'center'}}>{icon}</div>
                      <h2 className="bedrijf-naam" style={{textAlign: 'center', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.2rem', alignSelf: 'center'}}>{bedrijf.naam}</h2>
                      <div className="bedrijf-info" style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem', marginBottom: '1.2rem', justifyContent: 'center'}}>
                        <div className="bedrijf-details" style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '1.05rem', justifyContent: 'center'}}>
                            <span role="img" aria-label="adres" dangerouslySetInnerHTML={{__html: "&#128205;"}} /> {bedrijf.straatnaam} {bedrijf.huis_nr}{bedrijf.bus_nr && ` bus ${bedrijf.bus_nr}`}, {bedrijf.postcode} {bedrijf.gemeente}
                          </div>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'}}>
                            <span role="img" aria-label="email" dangerouslySetInnerHTML={{__html: "&#128231;"}} /> <a href={`mailto:${bedrijf.email}`} style={{color: '#2563eb', textDecoration: 'underline', textAlign: 'center'}}>{bedrijf.email}</a>
                          </div>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'}}>
                            <span role="img" aria-label="website" dangerouslySetInnerHTML={{__html: "&#127760;"}} /> <a href={bedrijf.bedrijf_URL && bedrijf.bedrijf_URL.startsWith('http') ? bedrijf.bedrijf_URL : `https://${bedrijf.bedrijf_URL}`} target="_blank" rel="noopener noreferrer" style={{color: '#2563eb', textDecoration: 'underline', textAlign: 'center'}}>{bedrijf.bedrijf_URL}</a>
                          </div>
                        </div>
                      </div>
                      <button
                        className="reserveer-btn modern"
                        style={{marginTop: 'auto', width: '100%', fontSize: '1.13rem', padding: '1rem 0', borderRadius: '1rem', fontWeight: 700, background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)', color: '#fff', border: 'none', boxShadow: '0 2px 12px rgba(59,130,246,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', cursor: 'pointer', alignSelf: 'center'}}
                        onClick={() => handleReserveerClick(bedrijf.bedrijf_id)}
                      >
                        <FaCalendarAlt className="btn-icon" style={{ marginRight: 8 }} /> Reserveer speeddate
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
          {visibleCount < filteredBedrijven.length && (
            <button className="toon-meer-btn" style={{margin: '2.5rem auto 0 auto', padding: '0.7rem 2.2rem', background: '#e0e7ef', color: '#1e293b', border: 'none', borderRadius: '2rem', fontSize: '1.1rem', fontWeight: 600, boxShadow: '0 2px 8px rgba(59,130,246,0.08)', cursor: 'pointer', display: 'block', transition: 'background 0.2s, color 0.2s, transform 0.2s'}} onClick={() => setVisibleCount(v => v + 9)}>
              Toon meer
            </button>
          )}
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