import React, { useEffect, useState } from "react";
import "./bedrijven.css";

export default function Bedrijven() {
  const [bedrijven, setBedrijven] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bedrijven")
      .then((res) => res.json())
      .then((data) => setBedrijven(data))
      .catch((error) => console.error("Error fetching bedrijven:", error));
  }, []);

  return (
    <div className="bedrijven-container">
      <div className="bedrijven-header">
        <h1>Onze Partner Bedrijven</h1>
        <p>Ontdek de bedrijven die samenwerken met onze stageplaatsen</p>
      </div>
      
      <div className="bedrijven-grid">
        {bedrijven.length === 0 ? (
          <p>Geen bedrijven gevonden.</p>
        ) : (
          bedrijven.map((bedrijf) => (
            <div className="bedrijf-card" key={bedrijf.bedrijf_id}>
              <h2 className="bedrijf-naam">
                <a href={bedrijf.bedrijf_URL.startsWith('http') ? bedrijf.bedrijf_URL : `https://${bedrijf.bedrijf_URL}`} 
                   target="_blank" 
                   rel="noopener noreferrer">
                  {bedrijf.naam}
                </a>
              </h2>
              <div className="bedrijf-info">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
} 