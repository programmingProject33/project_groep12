import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok, FaLocationDot } from "react-icons/fa6";
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

  // Redirect direct bij elke render als user is ingelogd
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/student-dashboard", { replace: true });
    }
  });

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
                </div>
                <div className="location-map-wrapper">
                  <iframe
                    title="Campus Kaai, Erasmushogeschool Brussel"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.574553427701!2d4.322502415745261!3d50.83641137953037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c48f5080d5b7%3A0x7fe25458db7a38ab!2sErasmushogeschool%20Brussel%20-%20Campus%20Kaai!5e0!3m2!1snl!2sbe!4v1687031759742!5m2!1snl!2sbe"
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

      {/* FOOTER */}
      <motion.footer 
        className="footer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="footer-row">
          <motion.div 
            className="footer-col left"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo-box"></div>
            <div className="footer-mail">
              E-mailadres: support-careerlaunch@ehb.be<br />
              Telefoonnummer: +32 494 77 08 550
            </div>
          </motion.div>
          <motion.div 
            className="footer-col middle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <ul className="footer-menu">
              <motion.li 
                onClick={() => navigate("/")} 
                style={{ cursor: "pointer" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.li>
              <motion.li 
                onClick={() => navigate("/registreer")} 
                style={{ cursor: "pointer" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Registreer
              </motion.li>
              <motion.li 
                onClick={() => navigate("/contactNavbalk")} 
                style={{ cursor: "pointer" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.li>
              <motion.li 
                onClick={() => navigate("/login")} 
                style={{ cursor: "pointer" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.li>
            </ul>
          </motion.div>
          <motion.div 
            className="footer-col right"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="footer-socials">
              {[
                { icon: FaLinkedin, href: "https://www.linkedin.com/company/meterasmusplus/", title: "LinkedIn" },
                { icon: FaInstagram, href: "https://www.instagram.com/erasmushogeschool/?hl=en", title: "Instagram" },
                { icon: FaXTwitter, href: "https://x.com/EUErasmusPlus?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor", title: "X" },
                { icon: FaTiktok, href: "https://www.tiktok.com/@erasmushogeschool", title: "TikTok" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon"
                  title={social.title}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
