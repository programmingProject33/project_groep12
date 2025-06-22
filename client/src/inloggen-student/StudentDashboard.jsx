import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { useAuth } from "../AuthContext.jsx";
import { FaBuilding, FaCalendarAlt, FaBus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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

const events = [
  {
    time: "Morgen, 10:00",
    title: "Speeddate Workshop",
    desc: "Leer hoe je jezelf kort en krachtig voorstelt aan bedrijven.",
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
  },
  {
    time: "Volgende week, 14:00",
    title: "CV Check Sessie",
    desc: "Laat je CV nakijken door een professional.",
    img: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
  }
];

const tips = [
  {
    emoji: "&#129309;",
    title: "Netwerk slim",
    desc: "Bouw je professionele netwerk op via LinkedIn en tijdens events op school of stage.",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80"
  },
  {
    emoji: "&#128483;&#65039;",
    title: "Bereid je pitch voor",
    desc: "Oefen hoe je jezelf in 1 minuut voorstelt – duidelijk, enthousiast en zelfzeker.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
  },
  {
    emoji: "&#128196;",
    title: "Houd je CV up-to-date",
    desc: "Voeg nieuwe ervaringen en vaardigheden meteen toe aan je CV. Zo ben je altijd klaar om te solliciteren.",
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
  },
  {
    emoji: "&#10067;",
    title: "Stel vragen tijdens gesprekken",
    desc: "Toon interesse door vragen te stellen. Zo laat je zien dat je initiatief toont en goed voorbereid bent.",
    img: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
  }
];

export default function StudentDashboard() {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [showLocationMap, setShowLocationMap] = useState(false);
  
  if (isAuthLoading) return null;
  const voornaam = user?.voornaam || "Student";
  const initiaal = voornaam[0]?.toUpperCase() || "S";

  const toggleLocationMap = () => {
    setShowLocationMap(!showLocationMap);
  };

  return (
    <div className="student-dashboard clean-hero">
      {/* Hero golfvorm bovenaan */}
      <div className="hero-wave-bg">
        <svg viewBox="0 0 1440 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#eef2ff" d="M0,80 C320,180 1120,0 1440,100 L1440,0 L0,0 Z" />
        </svg>
      </div>
      <motion.section
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="hero-row">
          <motion.div
            className="avatar-hero"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>{initiaal}</span>
          </motion.div>
          <div className="hero-texts">
            <h1>Welkom, {voornaam}!</h1>
            <div className="hero-sub">Klaar voor de volgende stap in je carrière?</div>
          </div>
        </div>
        <div className="hero-actions">
          <button className="hero-btn bedrijven" onClick={() => navigate("/student/bedrijven")}> <FaBuilding className="btn-icon" /> Bekijk bedrijven</button>
          <button className="hero-btn reservaties" onClick={() => navigate("/student/reservaties")}> <FaCalendarAlt className="btn-icon" /> Bekijk reservaties</button>
        </div>
      </motion.section>

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

      <section className="tips-section career-tips-block">
        <h2>&#128161; Carrière Tips</h2>
        <ul className="career-tips-list with-images">
          {tips.map((tip, i) => (
            <li key={i} className="career-tip-row">
              <div className="career-tip-text">
                <span className="tip-emoji" dangerouslySetInnerHTML={{__html: tip.emoji}} />
                <div>
                  <strong>{tip.title}</strong><br />
                  {tip.desc}
                </div>
              </div>
              <div className="career-tip-img-wrap">
                <img className="career-tip-img" src={tip.img} alt={tip.title} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
} 