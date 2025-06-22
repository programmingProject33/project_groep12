import React, { useEffect, useState } from "react";
import "./Home.css";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok, FaLocationDot, FaBus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [showLocationMap, setShowLocationMap] = useState(false);

  // Redirect only once on component mount if user is logged in
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        // Bepaal de juiste bestemming op basis van gebruikerstype
        const destination = user.type === 'student' ? '/student/dashboard' : '/bedrijf/home';
        navigate(destination, { replace: true });
      } catch (e) {
        // Vang fouten op als de data in localStorage corrupt is
        console.error("Kon gebruiker niet parsen uit localStorage", e);
        localStorage.removeItem("user");
      }
    }
  }, [navigate]); // De dependency array voorkomt de oneindige lus

  const toggleLocationMap = () => {
    setShowLocationMap(!showLocationMap);
  };

  return (
    <div>
      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-content">
          <h1>
            Career Launch &#39;25-&#39;26
          </h1>
          <p>
            Het evenement Career Launch &#39;25-&#39;26 aan de Erasmus Hogeschool Brussel biedt studenten van de EHB de kans om in contact te komen met bedrijven die op zoek zijn naar stagiairs en werknemers. Het richt zich op studenten van de opleidingen Toegepaste Informatica, Multimedia & Creative Technologies, Programmeren, Systeem- en Netwerkbeheer, en Internet of Things. 
            Tijdens de Career Launch kunnen studenten deelnemen aan groepsessies, speeddates en netwerkmomenten met vertegenwoordigers van diverse bedrijven. Organisaties zoals Accenture, Capgemini, Colruyt Group en vele anderen zijn aanwezig om hun werking toe te lichten en potentiële kandidaten te ontmoeten.
            Het doel van dit evenement is om studenten te helpen bij het vinden van stages en jobs, en bedrijven de kans te geven getalenteerde en gemotiveerde studenten te leren kennen.
          </p> 
        </div>

        {/* Hero image */}
        <img 
          src="/image.png" 
          alt="Career Launch visual" 
          className="hero-img"
        />
      </header>

      {/* LOCATION BUTTON SECTION */}
      <section className="location-button-section">
        <div className="location-button-container">
          <button
            className="location-toggle-btn"
            onClick={toggleLocationMap}
          >
            <FaLocationDot style={{ marginRight: '0.5rem' }} />
            {showLocationMap ? 'Verberg locatie' : 'Toon locatie'}
          </button>
          
          {showLocationMap && (
            <div className="location-map-container">
              <div className="location-map-info">
                <h3>
                  <FaLocationDot style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
                  Campus Kaai, Erasmushogeschool Brussel
                </h3>
                <p>Nijverheidskaai 170, 1070 Brussel, België</p>
                <div className="public-transport-info">
                  <h4><FaBus style={{ marginRight: '0.5rem' }}/>Openbaar Vervoer:</h4>
                  <ul>
                    <li><strong>Metro:</strong> Lijn 2 & 6 - Halte Delacroix (10 min. wandelen)</li>
                    <li><strong>Bus:</strong> Lijn 46 (Halte Albert I) of Lijn 89 (Halte Jacques Brel)</li>
                    <li><strong>Tram:</strong> Lijn 81 (Halte Conseil)</li>
                  </ul>
                </div>
              </div>
              <div className="location-map-wrapper">
                <iframe
                  title="Campus Kaai, Erasmushogeschool Brussel"
                  src="https://maps.google.com/maps?q=Nijverheidskaai%20170,%201070%20Brussel,%20Belgi%C3%AB&z=17&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '1rem' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* INFO CARDS SECTION */}
      <section className="info-section">
        <h2>
          Waarom deelnemen?
        </h2>
        <div className="cards">
          {[
            {
              title: "Voor Bedrijven:",
              content: "Ontmoet getalenteerde studenten, vind stagiairs en bouw aan je employer brand."
            },
            {
              title: "Voor 2de jaars studenten:",
              content: "Vind stages, maak kennis met bedrijven en ontdek carrièremogelijkheden."
            },
            {
              title: "Voor 3de jaars studenten:",
              content: "Deel je ervaringen, ontmoet topwerkgevers en geef je carrière een nieuwe boost!"
            }
          ].map((card, index) => (
            <div
              key={index}
              className="card"
            >
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
