import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bedrijven.css";

function Bedrijven() {
  const [bedrijven, setBedrijven] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/bedrijven")
      .then((res) => res.json())
      .then((data) => setBedrijven(data))
      .catch((err) => console.error("Fout bij ophalen:", err));
  }, []);

  return (
    <div className="page-container">
      {/* MAIN CONTENT */}
      <main className="content-wrap">
        <div className="bedrijven-container">
          <h1 className="bedrijven-title">Ontdek Onze Partnerbedrijven</h1>
          <div className="bedrijven-grid">
            {bedrijven.map((bedrijf, index) => (
              <div 
                key={bedrijf.bedrijf_id} 
                className="bedrijf-card"
                style={{ 
                  '--animation-order': index,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <h2 className="bedrijf-naam">
                  <a href={bedrijf.bedrijf_URL.startsWith('http') ? bedrijf.bedrijf_URL : `https://${bedrijf.bedrijf_URL}`} 
                     target="_blank" 
                     rel="noopener noreferrer">
                    {bedrijf.naam}
                  </a>
                </h2>
                <div className="bedrijf-info">
                  <p className="bedrijf-sector">{bedrijf.sector}</p>
                  <div className="bedrijf-details">
                    <p><strong>BTW-nummer:</strong> {bedrijf.BTW_nr}</p>
                    <p><strong>Adres:</strong> {bedrijf.straatnaam} {bedrijf.huis_nr}
                      {bedrijf.bus_nr && ` bus ${bedrijf.bus_nr}`}, {bedrijf.postcode} {bedrijf.gemeente}</p>
                    <p><strong>Telefoon:</strong> {bedrijf.telefoon_nr}</p>
                    <p><strong>Email:</strong> <a href={`mailto:${bedrijf.email}`}>{bedrijf.email}</a></p>
                    <p><strong>Website:</strong> <a href={bedrijf.bedrijf_URL.startsWith('http') ? bedrijf.bedrijf_URL : `https://${bedrijf.bedrijf_URL}`} 
                       target="_blank" 
                       rel="noopener noreferrer">
                      {bedrijf.bedrijf_URL}
                    </a></p>
                  </div>
                  <button 
                    className="reserveer-btn"
                    onClick={() => navigate(`/speeddate/${bedrijf.bedrijf_id}`)}
                  >
                    Reserveer speeddate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Bedrijven; 