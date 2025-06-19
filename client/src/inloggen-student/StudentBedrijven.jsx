import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaBuilding, FaHeartbeat, FaTools, FaChalkboardTeacher, FaBullhorn, FaMoneyBillWave } from "react-icons/fa";
import "../voor-inloggen/bedrijven.css";
import { useAuth } from "../AuthContext.jsx";

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
  if (student.opleiding && bedrijf.zoeken_we) {
    try {
      const zoekenWe = typeof bedrijf.zoeken_we === 'string' ? JSON.parse(bedrijf.zoeken_we) : bedrijf.zoeken_we;
      if (Array.isArray(zoekenWe)) {
        const hasOpleidingMatch = zoekenWe.some(item => 
          item.toLowerCase().includes(student.opleiding.toLowerCase()) ||
          student.opleiding.toLowerCase().includes(item.toLowerCase())
        );
        if (hasOpleidingMatch) {
          score += 3;
          reasons.push('opleiding match');
        }
      }
    } catch (e) {
      // Fallback: check direct in zoeken_we string
      if (bedrijf.zoeken_we.toLowerCase().includes(student.opleiding.toLowerCase())) {
        score += 3;
        reasons.push('opleiding match');
      }
    }
  }

  // 2. Dienstverbanden matching
  if (student.dienstverbanden && bedrijf.dienstverbanden) {
    try {
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
    } catch (e) {
      // Fallback: direct string comparison
      if (student.dienstverbanden.toLowerCase().includes(bedrijf.dienstverbanden.toLowerCase()) ||
          bedrijf.dienstverbanden.toLowerCase().includes(student.dienstverbanden.toLowerCase())) {
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
  const navigate = useNavigate();
  console.log('user:', user, 'isAuthLoading:', isAuthLoading);

  useEffect(() => {
    fetch("/api/bedrijven")
      .then((res) => res.json())
      .then((data) => {
        console.log('Opgehaalde bedrijven:', data);
        setBedrijven(data);
        
        // Bereken aanbevelingen als student is ingelogd
        if (user && user.type === 'student') {
          const recommendations = data
            .map(bedrijf => {
              const match = calculateMatchScore(user, bedrijf);
              return { ...bedrijf, matchScore: match.score, matchReasons: match.reasons };
            })
            .filter(bedrijf => bedrijf.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 4); // Max 4 aanbevelingen
          
          setRecommendedBedrijven(recommendations);
          
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

  // BedrijfCard component voor herbruikbaarheid
  const BedrijfCard = ({ bedrijf, index, isRecommended = false }) => {
    const accentColor = getSectorColor(index, bedrijf.sector);
    const icon = getSectorIcon(bedrijf.sector);
    
    return (
      <div
        key={bedrijf.bedrijf_id}
        className={`bedrijf-card modern no-bg bedrijf-fadein ${isRecommended ? 'recommended' : ''}`}
        style={{
          '--accent-color': accentColor,
          '--animation-order': index,
          animationDelay: '0s',
          ...(isRecommended && {
            border: '2px solid #3b82f6',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
          })
        }}
      >
        <div className="bedrijf-card-accent"></div>
        <div className="bedrijf-card-content">
          <div className="bedrijf-card-icon">{icon}</div>
          <h2 className="bedrijf-naam">{bedrijf.naam}</h2>
          {isRecommended && bedrijf.matchReasons && (
            <div className="match-badge">
              <span role="img" aria-label="star">⭐</span> Aangeraden ({bedrijf.matchReasons.join(', ')})
            </div>
          )}
          <div className="bedrijf-info">
            <div className="bedrijf-details">
              <p key={`adres-${bedrijf.bedrijf_id}`}><span role="img" aria-label="adres" dangerouslySetInnerHTML={{__html: "&#128205;"}} /> {bedrijf.straatnaam} {bedrijf.huis_nr}{bedrijf.bus_nr && ` bus ${bedrijf.bus_nr}`}, {bedrijf.postcode} {bedrijf.gemeente}</p>
              <p key={`email-${bedrijf.bedrijf_id}`}><span role="img" aria-label="email" dangerouslySetInnerHTML={{__html: "&#128231;"}} /> <a href={`mailto:${bedrijf.email}`}>{bedrijf.email}</a></p>
              {bedrijf.bedrijf_URL && (
                <p key={`website-${bedrijf.bedrijf_id}`}><span role="img" aria-label="website" dangerouslySetInnerHTML={{__html: "&#127760;"}} /> <a href={bedrijf.bedrijf_URL.startsWith('http') ? bedrijf.bedrijf_URL : `https://${bedrijf.bedrijf_URL}`} target="_blank" rel="noopener noreferrer">{bedrijf.bedrijf_URL}</a></p>
              )}
            </div>
            <button
              className="reserveer-btn modern"
              onClick={() => navigate(`/speeddate/${bedrijf.bedrijf_id}`)}
            >
              <FaCalendarAlt className="btn-icon" style={{ marginRight: 8 }} /> Reserveer speeddate
            </button>
          </div>
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
          
          {/* Aangeraden voor jou sectie */}
          {user && user.type === 'student' && recommendedBedrijven.length > 0 && (
            <div className="recommended-section">
              <h2 className="recommended-title">
                <span role="img" aria-label="star">✨</span> Aangeraden voor jou
              </h2>
              <p className="recommended-subtitle">Bedrijven die het beste matchen op basis van jouw profiel</p>
              <div className="bedrijven-grid recommended-grid">
                {recommendedBedrijven.map((bedrijf, index) => (
                  <BedrijfCard key={bedrijf.bedrijf_id} bedrijf={bedrijf} index={index} isRecommended={true} />
                ))}
              </div>
              <div className="section-divider"></div>
            </div>
          )}
          
          {/* Alle bedrijven sectie */}
          <div className="all-bedrijven-section">
            <h2 className="all-bedrijven-title">Alle partnerbedrijven</h2>
            <div className="bedrijven-grid">
              {Array.isArray(bedrijven) && bedrijven
                .sort((a, b) => a.naam.localeCompare(b.naam))
                .map((bedrijf, index) => (
                  <BedrijfCard key={bedrijf.bedrijf_id} bedrijf={bedrijf} index={index} isRecommended={false} />
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentBedrijven; 