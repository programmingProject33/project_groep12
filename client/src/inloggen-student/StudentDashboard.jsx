import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { useAuth } from "../AuthContext.jsx";
import { FaBuilding, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
    emoji: "🤝",
    title: "Netwerk slim",
    desc: "Bouw je professionele netwerk op via LinkedIn en tijdens events op school of stage.",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80"
  },
  {
    emoji: "🗣️",
    title: "Bereid je pitch voor",
    desc: "Oefen hoe je jezelf in 1 minuut voorstelt – duidelijk, enthousiast en zelfzeker.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
  },
  {
    emoji: "📄",
    title: "Houd je CV up-to-date",
    desc: "Voeg nieuwe ervaringen en vaardigheden meteen toe aan je CV. Zo ben je altijd klaar om te solliciteren.",
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
  },
  {
    emoji: "❓",
    title: "Stel vragen tijdens gesprekken",
    desc: "Toon interesse door vragen te stellen. Zo laat je zien dat je initiatief toont en goed voorbereid bent.",
    img: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
  }
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const voornaam = user?.voornaam || "Student";
  const initiaal = voornaam[0]?.toUpperCase() || "S";

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
          <button className="hero-btn bedrijven" onClick={() => navigate("/bedrijven")}> <FaBuilding className="btn-icon" /> Bekijk bedrijven</button>
          <button className="hero-btn reservaties" onClick={() => navigate("/reservaties")}> <FaCalendarAlt className="btn-icon" /> Bekijk reservaties</button>
        </div>
      </motion.section>
      <section className="tips-section career-tips-block">
        <h2>💡 Carrière Tips</h2>
        <ul className="career-tips-list with-images">
          {tips.map((tip, i) => (
            <li key={i} className="career-tip-row">
              <div className="career-tip-text">
                <span className="tip-emoji">{tip.emoji}</span>
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