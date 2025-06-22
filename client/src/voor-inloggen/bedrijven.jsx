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
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDienstverband, setSelectedDienstverband] = useState("");
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
    let filtered = bedrijven;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(bedrijf =>
        bedrijf.naam.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSector) {
      filtered = filtered.filter(bedrijf => bedrijf.sector === selectedSector);
    }
    
    if (selectedLocation) {
      filtered = filtered.filter(bedrijf => bedrijf.gemeente === selectedLocation);
    }
    
    if (selectedDienstverband) {
      filtered = filtered.filter(bedrijf => 
        bedrijf.dienstverbanden && bedrijf.dienstverbanden.includes(selectedDienstverband)
      );
    }

    setFilteredBedrijven(filtered);
    setVisibleCount(9); // Reset zichtbare items bij elke filterwijziging

  }, [searchTerm, selectedSector, selectedLocation, selectedDienstverband, bedrijven]);

  const handleReserveerClick = (bedrijfId) => {
    if (user) {
      navigate(`/student/speeddate/${bedrijfId}`);
    } else {
      setPendingBedrijfId(bedrijfId);
      setShowLoginModal(true);
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setPendingBedrijfId(null);
  };

  const uniekeSectoren = [...new Set(bedrijven.map(b => b.sector).filter(Boolean))];
  const dienstverbandOpties = ['Voltijds', 'Deeltijds', 'Freelance', 'Stage'];

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
          
          <div className="search-filter-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Zoek op eerste letter van bedrijfsnaam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button className="search-button">
                Zoeken
              </button>
            </div>

            <div className="filters-container">
              <select 
                className="filter-select"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                <option value="">Alle Sectoren</option>
                {uniekeSectoren.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>

              <select
                className="filter-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Alle Locaties</option>
                {[...new Set(bedrijven.map(b => b.gemeente).filter(Boolean))].sort().map(gemeente => (
                  <option key={gemeente} value={gemeente}>{gemeente}</option>
                ))}
              </select>

              <select
                className="filter-select"
                value={selectedDienstverband}
                onChange={(e) => setSelectedDienstverband(e.target.value)}
              >
                <option value="">Alle Dienstverbanden</option>
                {dienstverbandOpties.map(dienst => (
                  <option key={dienst} value={dienst}>{dienst}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resultaten teller */}
          <div className="result-count">
            {filteredBedrijven.length} bedrijf{filteredBedrijven.length !== 1 ? 'en' : ''} gevonden
          </div>

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
        <div className="speeddate-modal">
          <div className="speeddate-content">
            <h2>Reserveer een speeddate</h2>
            <p>
              Log in om beschikbare tijdsloten te zien en een speeddate te reserveren.
            </p>
            <div className="button-container">
              <button onClick={closeModal}>Annuleren</button>
              <button onClick={() => navigate('/login')}>
                Inloggen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bedrijven; 