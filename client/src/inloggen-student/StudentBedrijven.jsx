import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaBuilding, FaHeartbeat, FaTools, FaChalkboardTeacher, FaBullhorn, FaMoneyBillWave, FaSearch } from "react-icons/fa";
import "../voor-inloggen/bedrijven.css";
import { useAuth } from "../AuthContext.jsx";
import "./StudentBedrijven.css";

const sectorColors = [
  "#3b82f6", "#22c55e", "#a78bfa", "#f59e42", "#f43f5e", "#06b6d4"
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
  return sectorColors[index % sectorColors.length];
}

function getSectorIcon(sector) {
  if (!sector) return sectorIcons.default;
  const key = Object.keys(sectorIcons).find(k => sector.toLowerCase().includes(k.toLowerCase()));
  return key ? sectorIcons[key] : sectorIcons.default;
}

// Matching logica functie
function calculateMatchScore(student, bedrijf) {
  let score = 0;
  let reasons = [];

  // 1. Opleiding matching
  if (student.opleiding && bedrijf.gezochte_opleidingen) {
    if (bedrijf.gezochte_opleidingen.toLowerCase().includes(student.opleiding.toLowerCase())) {
      score += 3;
      reasons.push('opleiding match');
    }
  }

  // 2. Dienstverbanden matching
  if (student.dienstverbanden && bedrijf.dienstverbanden) {
    const studentDienstverbanden = typeof student.dienstverbanden === 'string' ? 
      JSON.parse(student.dienstverbanden) : student.dienstverbanden;
    const bedrijfDienstverbanden = typeof bedrijf.dienstverbanden === 'string' ? 
      JSON.parse(bedrijf.dienstverbanden) : bedrijf.dienstverbanden;
    
    if (Array.isArray(studentDienstverbanden) && Array.isArray(bedrijfDienstverbanden)) {
      const hasDienstverbandMatch = studentDienstverbanden.some(studentDienst =>
        bedrijfDienstverbanden.some(bedrijfDienst =>
          studentDienst.toLowerCase().includes(bedrijfDienst.toLowerCase()) ||
          bedrijfDienst.toLowerCase().includes(studentDienst.toLowerCase())
        )
      );
      if (hasDienstverbandMatch) {
        score += 2;
        reasons.push('dienstverband match');
      }
    }
  }

  // 3. Sector matching (bonus)
  if (student.opleiding && bedrijf.sector) {
    const opleidingLower = student.opleiding.toLowerCase();
    const sectorLower = bedrijf.sector.toLowerCase();
    
    if (opleidingLower.includes('informatica') && sectorLower.includes('it')) {
      score += 1;
      reasons.push('sector match');
    } else if (opleidingLower.includes('multimedia') && (sectorLower.includes('it') || sectorLower.includes('marketing'))) {
      score += 1;
      reasons.push('sector match');
    }
  }

  return { score, reasons };
}

function StudentBedrijven() {
  const { user, isAuthLoading } = useAuth();
  const [bedrijven, setBedrijven] = useState([]);
  const [recommendedBedrijven, setRecommendedBedrijven] = useState([]);
  const [filteredBedrijven, setFilteredBedrijven] = useState([]);
  const [filteredRecommendedBedrijven, setFilteredRecommendedBedrijven] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDienstverband, setSelectedDienstverband] = useState("");
  const bedrijvenOverzichtRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  console.log('user:', user, 'isAuthLoading:', isAuthLoading);

  useEffect(() => {
    fetch("/api/bedrijven")
      .then((res) => res.json())
      .then((data) => {
        console.log('Opgehaalde bedrijven:', data);
        setBedrijven(data);
        setFilteredBedrijven(data);
        
        // Bereken aanbevelingen als student is ingelogd
        if (user && user.type === 'student') {
          const recommendations = data
            .map(bedrijf => {
              const match = calculateMatchScore(user, bedrijf);
              return { ...bedrijf, matchScore: match.score, matchReasons: match.reasons };
            })
            .filter(bedrijf => bedrijf.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 9); // Max 9 aanbevelingen
          
          setRecommendedBedrijven(recommendations);
          setFilteredRecommendedBedrijven(recommendations);
          
          // Debug logging
          if (recommendations.length > 0) {
            console.log('=== AANBEVELINGEN GEVONDEN ===');
            recommendations.forEach(bedrijf => {
              console.log(`Aanbeveling: ${bedrijf.naam} (score: ${bedrijf.matchScore}, redenen: ${bedrijf.matchReasons.join(', ')})`);
            });
          } else {
            console.log('Geen aanbevelingen gevonden voor deze student');
          }
        }
      })
      .catch((err) => console.error("Fout bij ophalen:", err));
  }, [user]);

  // Filter bedrijven based on search term and filters
  useEffect(() => {
    if (searchTerm.trim() === "" && selectedSector === "" && selectedLocation === "" && selectedDienstverband === "") {
      setFilteredBedrijven(bedrijven);
      setFilteredRecommendedBedrijven(recommendedBedrijven);
      setVisibleCount(9);
    } else {
      const searchLower = searchTerm.toLowerCase();
      
      // Filter alle bedrijven
      const filtered = bedrijven.filter(bedrijf => {
        // Search term filter - alleen eerste letter van bedrijfsnaam
        const matchesSearch = searchTerm.trim() === "" || 
          bedrijf.naam.toLowerCase().startsWith(searchLower);
        
        // Sector filter
        const matchesSector = selectedSector === "" || 
          bedrijf.sector?.toLowerCase() === selectedSector.toLowerCase();
        
        // Location filter
        const matchesLocation = selectedLocation === "" || 
          bedrijf.gemeente?.toLowerCase() === selectedLocation.toLowerCase();
        
        // Dienstverband filter
        const matchesDienstverband = selectedDienstverband === "" ||
          (bedrijf.dienstverbanden && bedrijf.dienstverbanden.includes(selectedDienstverband));
        
        return matchesSearch && matchesSector && matchesLocation && matchesDienstverband;
      });
      setFilteredBedrijven(filtered);
      
      // Pas exact dezelfde filter toe op de aanbevolen bedrijven
      const filteredRecommended = recommendedBedrijven.filter(bedrijf => {
        const matchesSearch = searchTerm.trim() === "" || 
          bedrijf.naam.toLowerCase().startsWith(searchLower);
        
        const matchesSector = selectedSector === "" || 
          bedrijf.sector?.toLowerCase() === selectedSector.toLowerCase();
        
        const matchesLocation = selectedLocation === "" || 
          bedrijf.gemeente?.toLowerCase() === selectedLocation.toLowerCase();
        
        const matchesDienstverband = selectedDienstverband === "" ||
          (bedrijf.dienstverbanden && bedrijf.dienstverbanden.includes(selectedDienstverband));
        
        return matchesSearch && matchesSector && matchesLocation && matchesDienstverband;
      });
      setFilteredRecommendedBedrijven(filteredRecommended);
      setVisibleCount(9);
    }
  }, [searchTerm, selectedSector, selectedLocation, selectedDienstverband, bedrijven, recommendedBedrijven]);

  // Splits bedrijven in recommended en overige
  const recommendedIds = new Set(filteredRecommendedBedrijven.map(b => b.bedrijf_id));
  const overigeBedrijven = filteredBedrijven.filter(b => !recommendedIds.has(b.bedrijf_id));

  // Fade-in animatie voor nieuwe bedrijven
  const [fadeInIndexes, setFadeInIndexes] = useState([]);
  useEffect(() => {
    setFadeInIndexes(Array.from({length: visibleCount}, (_, i) => i));
  }, [visibleCount, overigeBedrijven.length]);

  // Smooth scroll naar overzicht
  const scrollToOverzicht = () => {
    bedrijvenOverzichtRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // BedrijfCard component voor herbruikbaarheid
  const BedrijfCard = ({ bedrijf, index, isRecommended = false }) => {
    const accentColor = getSectorColor(index, bedrijf.sector);
    const icon = getSectorIcon(bedrijf.sector);
    
    return (
      <div
        key={bedrijf.bedrijf_id}
        className={`bedrijf-card modern no-bg bedrijf-fadein${isRecommended ? ' recommended' : ''}`}
        style={{
          '--accent-color': accentColor,
          '--animation-order': index,
          animationDelay: '0s',
          border: '2px solid ' + accentColor,
          background: isRecommended ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' : '#fff',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.10)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="bedrijf-card-accent"></div>
        <div className="bedrijf-card-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '2.2rem 1.5rem 1.5rem 1.5rem', justifyContent: 'center'}}>
          <div className="bedrijf-card-icon" style={{marginBottom: '1.1rem', alignSelf: 'center'}}>{icon}</div>
          <h2 className="bedrijf-naam" style={{textAlign: 'center', fontWeight: 700, fontSize: '1.5rem', marginBottom: isRecommended ? '0.7rem' : '1.2rem', alignSelf: 'center'}}>{bedrijf.naam}</h2>
          {isRecommended && bedrijf.matchReasons && (
            <div className="match-badge" style={{marginBottom: '1.2rem', width: '100%', textAlign: 'center', borderRadius: '1.2rem', fontWeight: 600, fontSize: '1.05rem', background: '#3b82f6', color: '#fff', padding: '0.7rem 0.5rem', alignSelf: 'center'}}>
              <span role="img" aria-label="star">⭐</span> Aangeraden ({bedrijf.matchReasons.join(', ')})
            </div>
          )}
          <div className="bedrijf-info" style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem', marginBottom: '1.2rem', justifyContent: 'center'}}>
            <div className="bedrijf-details" style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '1.05rem', justifyContent: 'center'}}>
                <span role="img" aria-label="adres" dangerouslySetInnerHTML={{__html: "&#128205;"}} /> {bedrijf.straatnaam} {bedrijf.huis_nr}{bedrijf.bus_nr && ` bus ${bedrijf.bus_nr}`}, {bedrijf.postcode} {bedrijf.gemeente}
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'}}>
                <span role="img" aria-label="email" dangerouslySetInnerHTML={{__html: "&#128231;"}} /> <a href={`mailto:${bedrijf.email}`} style={{color: '#2563eb', textDecoration: 'underline', textAlign: 'center'}}>{bedrijf.email}</a>
              </div>
              {bedrijf.bedrijf_URL && (
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'}}>
                  <span role="img" aria-label="website" dangerouslySetInnerHTML={{__html: "&#127760;"}} /> <a href={bedrijf.bedrijf_URL.startsWith('http') ? bedrijf.bedrijf_URL : `https://${bedrijf.bedrijf_URL}`} target="_blank" rel="noopener noreferrer" style={{color: '#2563eb', textDecoration: 'underline', textAlign: 'center'}}>{bedrijf.bedrijf_URL}</a>
                </div>
              )}
            </div>
          </div>
          <button
            className="reserveer-btn modern"
            style={{marginTop: 'auto', width: '100%', fontSize: '1.13rem', padding: '1rem 0', borderRadius: '1rem', fontWeight: 700, background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)', color: '#fff', border: 'none', boxShadow: '0 2px 12px rgba(59,130,246,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', cursor: 'pointer', alignSelf: 'center'}}
            onClick={() => navigate(`/student/speeddate/${bedrijf.bedrijf_id}`)}
          >
            <FaCalendarAlt className="btn-icon" style={{ marginRight: 8 }} /> Reserveer speeddate
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container bedrijven-modern-bg">
      <div className="bedrijven-hero-wave">
        <svg viewBox="0 0 1440 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#f0f9ff" d="M0,80 C320,180 1120,0 1440,100 L1440,0 L0,0 Z" />
        </svg>
      </div>
      <main className="content-wrap">
        <div className="bedrijven-container">
          <h1 className="bedrijven-title"><span role="img" aria-label="zoek" dangerouslySetInnerHTML={{__html: "&#128269;"}} /> Ontdek onze partnerbedrijven</h1>
          <p className="bedrijven-subtitle">Kies je favoriet en plan je speeddates</p>
          
          {/* Zoekbalk en filters */}
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
                {[...new Set(bedrijven.map(b => b.sector).filter(Boolean))].sort().map(sector => (
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
                <option value="Voltijds">Voltijds</option>
                <option value="Deeltijds">Deeltijds</option>
                <option value="Freelance">Freelance</option>
                <option value="Stage">Stage</option>
              </select>
            </div>
          </div>

          {/* Resultaten teller */}
          <div className="result-count">
            {filteredBedrijven.length} bedrijf{filteredBedrijven.length !== 1 ? 'en' : ''} gevonden
          </div>
          
          {/* Aanbevolen bedrijven */}
          {user && user.type === 'student' && filteredRecommendedBedrijven.length > 0 && (
            <div className="recommended-section">
              <h2 className="section-title">
                <span role="img" aria-label="star">✨</span> Aanbevolen voor jouw opleiding
              </h2>
              <div className="bedrijven-grid recommended-grid">
                {filteredRecommendedBedrijven.map((bedrijf, index) => (
                  <BedrijfCard key={bedrijf.bedrijf_id} bedrijf={bedrijf} index={index} isRecommended={true} />
                ))}
              </div>
              {overigeBedrijven.length > 0 && <div className="section-divider"></div>}
            </div>
          )}
          
          {/* Overzicht van overige bedrijven */}
          <div className="all-bedrijven-section" ref={bedrijvenOverzichtRef}>
            <h2 className="section-title">
              {searchTerm ? 'Zoekresultaten' : 'Alle partnerbedrijven'}
            </h2>
            <div className="bedrijven-grid">
              {overigeBedrijven.slice(0, visibleCount).map((bedrijf, index) => (
                <div key={bedrijf.bedrijf_id} className={`fadein-card${fadeInIndexes.includes(index) ? ' fade-in' : ''}`} style={{animationDelay: `${index * 0.07}s`}}>
                  <BedrijfCard bedrijf={bedrijf} index={index} isRecommended={false} />
                </div>
              ))}
            </div>
            <div className="pagination-controls">
              {visibleCount < overigeBedrijven.length && (
                <button className="toon-meer-btn" onClick={() => setVisibleCount(v => v + 9)}>
                  Toon meer
                </button>
              )}
              {visibleCount > 9 && (
                <button className="toon-meer-btn" onClick={() => setVisibleCount(9)}>
                  Toon minder
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentBedrijven; 