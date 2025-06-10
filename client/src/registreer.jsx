import React, { useState } from "react";
import "./registreer.css";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function Registreer() {
   const [activeTab, setActiveTab] = useState("student");
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

  return (
    <div> 
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <span className="navbar-title">Careerlaunch</span>
        </div>
        <ul className="navbar-links">
          <li><a onClick={() => navigate("/")}>Home</a></li>
          <li><a>Bedrijven</a></li>
          <li onClick={() => navigate("/contactNavbalk")}>Contact</li>
          <li>
            <button className="navbar-btn register" onClick={() => navigate("/registreer")}>Registreer</button>
          </li>
          <li>
            <button className="navbar-btn login" onClick={() => navigate("/login")}>Login</button>
          </li>
        </ul>
      </nav>
      <main className="registreer-mai n">
        <div className="registreer-tabs">
          <button
            className={activeTab === "student" ? "tab active" : "tab"}
            onClick={() => setActiveTab("student")}
          >
            Student
          </button>
          <button
            className={activeTab === "bedrijf" ? "tab active" : "tab"}
            onClick={() => setActiveTab("bedrijf")}
          >
            Bedrijf
          </button>
        </div>

        <div className="registerstudent-content">
          {activeTab === "student" && (
            <form className="registerstudent-form">
              <h1 className="registerstudent-title">Account maken als Student</h1>
              <label>
                Voornaam:
                <input type="text" name="voornaam" />
              </label>
              <label>
                Naam:
                <input type="text" name="naam" />
              </label>
              <label>
                E-mailadres:
                <input type="email" name="email" />
              </label>
              <label>
                Gebruikersnaam:
                <input type="text" name="gebruikersnaam" />
              </label>
              <label>
                Wachtwoord:
                <input type="password" name="wachtwoord" />
              </label>
              <label>
                Wachtwoord bevestiging:
                <input type="password" name="wachtwoord2" />
              </label>
              <button type="submit" className="registerstudent-btn student-btn">Account maken</button>
            </form>
          )}

          {activeTab === "bedrijf" && (
            <form className="registerbedrijf-form">
              <h1 className="registerbedrijf-title">Account maken als Bedrijf</h1>

              <h2 className="registerbedrijf-section-title">Bedrijfsgegevens:</h2>
              <label>
                Bedrijfsnaam:
                <input type="text" name="bedrijfsnaam" />
              </label>
              <label>
                KVK-nummer:
                <input type="text" name="kvk" />
              </label>
              <label>
                BTW-nummer:
                <input type="text" name="btw" />
              </label>
              <div className="registerbedrijf-address-row">
                <label>
                  Straatnaam en huisnummer:
                  <input type="text" name="straat" />
                </label>
                <label>
                  Gemeente en postcode:
                  <input type="text" name="gemeente" />
                </label>
              </div>
              <label>
                Telefoonnummer:
                <input type="text" name="telbedrijf" />
              </label>
              <label>
                Bedrijf e-mailadres:
                <input type="email" name="emailbedrijf" />
              </label>
              <h2 className="registerbedrijf-section-title">Contactpersoon:</h2>
              <label>
                Voornaam:
                <input type="text" name="voornaam_contact" />
              </label>
              <label>
                Naam:
                <input type="text" name="naam_contact" />
              </label>
              <label>
                Specialisatie:
                <input type="text" name="specialisatie" />
              </label>
              <label>
                E-mailadres:
                <input type="email" name="email_contact" />
              </label>
              <label>
                Telefoonnummer:
                <input type="text" name="tel_contact" />
              </label>

              <h2 className="registerbedrijf-section-title">Accountgegevens</h2>
              <label>
                Gebruikersnaam:
                <input type="text" name="gebruikersnaam_bedrijf" />
              </label>
              <label>
                Wachtwoord:
                <input type="password" name="wachtwoord_bedrijf" />
              </label>
              <label>
                Wachtwoord bevestiging:
                <input type="password" name="wachtwoord2_bedrijf" />
              </label>
              <button type="submit" className="registerbedrijf-btn bedrijf-btn">Account maken</button>
            </form>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-row">
          <div className="footer-col left">
            <div className="footer-logo-box"></div>
            <div className="footer-mail">
              E-mailadres: support-careerlaunch@ehb.be<br />
              Telefoonnummer: +32 494 77 08 550
            </div>
          </div>
          <div className="footer-col middle">
            <ul className="footer-menu">
              <li onClick={goToHome} style={{ cursor: "pointer" }}>Home</li>
              <li>Registreer</li>
              <li>Contact</li>
              <li onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>Login</li>
            </ul>
          </div>
          <div className="footer-col right">
            <div className="footer-socials">
              <a href="#" className="icon" title="LinkedIn"><FaLinkedin /></a>
              <a href="#" className="icon" title="Instagram"><FaInstagram /></a>
              <a href="#" className="icon" title="X"><FaXTwitter /></a>
              <a href="#" className="icon" title="TikTok"><FaTiktok /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
