import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "./homeBedrijf.css";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";

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
  const bedrijfsnaam = user?.naam || user?.bedrijfsnaam || "[Bedrijf]";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  }

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
