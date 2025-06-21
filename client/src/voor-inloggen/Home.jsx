import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok, FaLocationDot, FaBus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

// Animation variants
const heroVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const cardHoverVariants = {
  hover: {
    scale: 1.03,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

const mapsVariants = {
  hidden: { 
    opacity: 0, 
    y: 30
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

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
      <motion.header 
        className="hero"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Career Launch &#39;25-&#39;26
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Het evenement Career Launch &#39;25-&#39;26 aan de Erasmus Hogeschool Brussel biedt studenten van de EHB de kans om in contact te komen met bedrijven die op zoek zijn naar stagiairs en werknemers. Het richt zich op studenten van de opleidingen Toegepaste Informatica, Multimedia & Creative Technologies, Programmeren, Systeem- en Netwerkbeheer, en Internet of Things. 
            Tijdens de Career Launch kunnen studenten deelnemen aan groepsessies, speeddates en netwerkmomenten met vertegenwoordigers van diverse bedrijven. Organisaties zoals Accenture, Capgemini, Colruyt Group en vele anderen zijn aanwezig om hun werking toe te lichten en potentiële kandidaten te ontmoeten.
            Het doel van dit evenement is om studenten te helpen bij het vinden van stages en jobs, en bedrijven de kans te geven getalenteerde en gemotiveerde studenten te leren kennen.
          </motion.p> 
        </motion.div>

        {/* Hero image with animation */}
        <motion.img 
          src="/image.png" 
          alt="Career Launch visual" 
          className="hero-img"
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.02 }}
        />
      </motion.header>

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
            <FaLocationDot style={{ marginRight: '0.5rem' }} />
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* INFO CARDS SECTION */}
      <motion.section 
        className="info-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Waarom deelnemen?
        </motion.h2>
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
            <motion.div
              key={index}
              className="card"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              hoverVariants={cardHoverVariants}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                ease: "easeOut"
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
