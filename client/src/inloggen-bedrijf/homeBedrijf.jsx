import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "./homeBedrijf.css";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok, FaBus } from "react-icons/fa6";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";

// Location map variants
const mapVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
};

function mapKlasToAula(val) {
  if (!val) return val;
  const match = String(val).match(/^klas\s?(\d)$/i);
  if (match) {
    return `aula ${match[1]}`;
  }
  return val;
}

export default function HomeBedrijf() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLocationMap, setShowLocationMap] = useState(false);

  // Voeg een expliciete controle toe om de component te beschermen tegen een null user-object
  if (!user) {
    return null; // Of een <Loader /> component
  }

  const bedrijfsnaam = user.naam || user.bedrijfsnaam || "[Bedrijf]";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  }

  const toggleLocationMap = () => {
    setShowLocationMap(!showLocationMap);
  };

  return (
    <div className="bedrijf-home-wrapper">
      <BedrijfNavbar />
      {/* Hero Section */}
      <section className="bedrijf-hero">
        <div className="bedrijf-hero-content">
          <h1>Welkom, {bedrijfsnaam}!</h1>
          <p className="bedrijf-hero-sub">Beheer je reservaties en bekijk studentprofielen.</p>
          {/* Lokaal en verdieping info */}
          {user?.lokaal && user?.verdieping && (
            <div className="bedrijf-lokaal-info">
              <span className="bedrijf-lokaal-label">Jouw locatie tijdens Career Launch:</span>
              <div className="bedrijf-lokaal-badge">
                <span className="bedrijf-lokaal-naam">Lokaal: <b>{mapKlasToAula(user.lokaal)}</b></span>
                <span className="bedrijf-lokaal-verdieping">Verdieping: <b>{mapKlasToAula(user.verdieping)}</b></span>
              </div>
            </div>
          )}
          <button className="bedrijf-hero-btn" onClick={() => navigate("/bedrijf/reservaties")}>Bekijk reservaties</button>
        </div>
        <div className="bedrijf-hero-wave">
          {/* SVG golfvorm */}
          <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="wave-svg">
            <path d="M0,30 Q250,80 500,30 L500,100 L0,100 Z" fill="#e0e7ff" />
          </svg>
        </div>
      </section>

      {/* LOCATION BUTTON SECTION */}
      <motion.section 
        className="location-button-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="location-button-container">
          <motion.button
            className="location-toggle-btn"
            onClick={toggleLocationMap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span style={{ marginRight: '0.5rem' }}>📍</span>
            {showLocationMap ? 'Verberg locatie' : 'Toon locatie'}
          </motion.button>
          
          <AnimatePresence>
            {showLocationMap && (
              <motion.div
                className="location-map-container"
                variants={mapVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <div className="location-map-info">
                  <h3>
                    <span style={{ marginRight: '0.5rem', color: '#3b82f6' }}>📍</span>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <section className="bedrijf-quick-actions">
        <div className="bedrijf-action-card" onClick={() => navigate("/bedrijf/reservaties")}> 
          <span className="bedrijf-action-icon" role="img" aria-label="Beheer reservaties" dangerouslySetInnerHTML={{__html: "&#128197;"}} />
          <h3><b>Beheer reservaties</b></h3>
          <p>Bekijk en beheer je geplande speeddates met studenten.</p>
        </div>
        <div className="bedrijf-action-card" onClick={() => navigate("/bedrijf/studenten")}> 
          <span className="bedrijf-action-icon" role="img" aria-label="Bekijk studenten" dangerouslySetInnerHTML={{__html: "&#127891;"}} />
          <h3><b>Bekijk studenten</b></h3>
          <p>Blader door profielen van beschikbare studenten.</p>
        </div>
      </section>
      <BedrijfFooter />
    </div>
  );
}
