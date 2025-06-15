import React from "react";
import "./homeBedrijf.css";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import { useNavigate } from "react-router-dom";

export default function BedrijfHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div>
      <BedrijfNavbar />
      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-content">
          <h1>Career Launch '25-'26</h1>
          <p>
            Het evenement Career Launch '25-'26 aan de Erasmus Hogeschool Brussel biedt studenten van de EHB de kans om in contact te komen met bedrijven die op zoek zijn naar stagiairs en werknemers. Het richt zich op studenten van de opleidingen Toegepaste Informatica, Multimedia & Creative Technologies, Programmeren, Systeem- en Netwerkbeheer, en Internet of Things.
            Tijdens de Career Launch kunnen studenten deelnemen aan groepsessies, speeddates en netwerkmomenten met vertegenwoordigers van diverse bedrijven. Organisaties zoals Accenture, Capgemini, Colruyt Group en vele anderen zijn aanwezig om hun werking toe te lichten en potentiële kandidaten te ontmoeten.
            Het doel van dit evenement is om studenten te helpen bij het vinden van stages en jobs, en bedrijven de kans te geven getalenteerde en gemotiveerde studenten te leren kennen.
          </p>
        </div>
        <div className="hero-img">
          <div className="hero-info">
            <div className="hero-info-item"><b>Wanneer:</b> dinsdag 14 maart 2023, van 10:00 tot 16:00</div>
            <div className="hero-info-item"><b>Waar:</b> EHB Kaai Campus</div>
          </div>
        </div>
      </header>
      <BedrijfFooter />
    </div>
  );
}
