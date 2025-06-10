import React, { useState } from "react";
import "./registreer.css"; // Dit importeert de styling (kleuren, lay-out, lettertypes) van de pagina.
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
// Dit importeert iconen van sociale media die je kan gebruiken in de pagina.
import { useNavigate } from "react-router-dom";
// useNavigate is een hook (speciale functie) die je gebruikt om te navigeren (pagina veranderen) zonder dat de pagina helemaal opnieuw laadt.

export default function Registreer()   // Dit is een functionele component in React. Het maakt de registratiepagina.
 {
   const [activeTab, setActiveTab] = useState("student");  // Hier gebruiken we een hook (useState) om bij te houden welke tab actief is (student of bedrijf).
  // activeTab is de naam van de huidige tab, setActiveTab is een functie om die te veranderen.
  // Beginwaarde is "student".
  const navigate = useNavigate();   // useNavigate geeft ons een functie (navigate) waarmee we naar andere pagina's kunnen gaan.
  const goToHome = () => {
    navigate("/");
  };  // Deze functie zorgt ervoor dat je naar de startpagina ("/") wordt gebracht 
  // als je deze functie gebruikt. 'navigate' is een manier om van pagina te veranderen 
  // binnen je app zonder dat je de hele website opnieuw hoeft te laden.

  return (
    <div>
      {/* Bovenste navigatiebalk met logo en knoppen */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          {/* Klikbaar logo dat naar home navigeert */}
          <span className="navbar-title">Careerlaunch</span>
        </div>
        <ul className="navbar-links">
          <li><a onClick={() => navigate("/")}>Home</a></li> 
          {/* Home knop, brengt naar startpagina */}
          <li><a>Bedrijven</a></li> 
          {/* Deze knop doet nu nog niks (kan later worden toegevoegd) */}
          <li onClick={() => navigate("/contactNavbalk")}>Contact</li> 
          {/* Contact knop navigeert naar contactpagina */}
          <li>
            <button className="navbar-btn register" onClick={() => navigate("/registreer")}>Registreer</button>
            {/* Knop om naar registreerpagina te gaan */}
          </li>
          <li>
            <button className="navbar-btn login" onClick={() => navigate("/login")}>Login</button>
            {/* Knop om naar loginpagina te gaan */}
          </li>
        </ul>
      </nav>

      {/* Hoofdinhoud van de registratiepagina */}
      <main className="registreer-main">
        <div className="registreer-tabs">
          {/* Twee knoppen om te kiezen tussen Student of Bedrijf registratie */}
          <button
            className={activeTab === "student" ? "tab active" : "tab"} 
            // Als activeTab "student" is, krijgt deze knop een extra stijl "active"
            onClick={() => setActiveTab("student")} 
            // Klikken verandert activeTab naar "student"
          >
            Student
          </button>
          <button
            className={activeTab === "bedrijf" ? "tab active" : "tab"} 
            // Zelfde principe voor "bedrijf"
            onClick={() => setActiveTab("bedrijf")}
          >
            Bedrijf
          </button>
        </div>

        <div className="registerstudent-content">
          {/* Dit stukje toont een formulier afhankelijk van welke tab actief is */}

          {activeTab === "student" && (
            <form className="registerstudent-form">
              {/* Formulier voor studenten registratie */}
              <h1 className="registerstudent-title">Account maken als Student</h1>
              <label>
                Voornaam:
                <input type="text" name="voornaam" />
                {/* Invulveld voor voornaam */}
              </label>
              <label>
                Naam:
                <input type="text" name="naam" />
              </label>
              <label>
                E-mailadres:
                <input type="email" name="email" />
                {/* Email invoerveld */}
              </label>
              <label>
                Gebruikersnaam:
                <input type="text" name="gebruikersnaam" />
              </label>
              <label>
                Wachtwoord:
                <input type="password" name="wachtwoord" />
                {/* Wachtwoord wordt niet zichtbaar ingevoerd */}
              </label>
              <label>
                Wachtwoord bevestiging:
                <input type="password" name="wachtwoord2" />
              </label>
              <button type="submit" className="registerstudent-btn student-btn">
                Account maken
              </button>
              {/* Knop om het formulier te versturen */}
            </form>
          )}

          {activeTab === "bedrijf" && (
            <form className="registerbedrijf-form">
              {/* Formulier voor bedrijf registratie */}
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

              <button type="submit" className="registerbedrijf-btn bedrijf-btn">
                Account maken
              </button>
            </form>
          )}
        </div>
      </main>

      {/* FOOTER onderaan de pagina */}
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
              <li onClick={() => navigate("/registreer")} style={{ cursor: "pointer" }}>Registreer</li>
              <li onClick={() => navigate("/contactNavbalk")} style={{ cursor: "pointer" }}>Contact</li>
              <li onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>Login</li>
            </ul>
          </div>

           <div className="footer-col right">
                      <div className="footer-socials">
                        <a
                          href="https://www.linkedin.com/company/meterasmusplus/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="icon"
                          title="LinkedIn"
                        >
                          <FaLinkedin />
                        </a>
                        <a
                          href="https://www.instagram.com/erasmushogeschool/?hl=en"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="icon"
                          title="Instagram"
                        >
                          <FaInstagram />
                        </a>
                        <a
                          href="https://x.com/EUErasmusPlus?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="icon"
                          title="X"
                        >
                          <FaXTwitter />
                        </a>
                        <a
                          href="https://www.tiktok.com/@erasmushogeschool"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="icon"
                          title="TikTok"
                        >
                          <FaTiktok />
                        </a>
                      </div>
                    </div>
        </div>
      </footer>
    </div>
  );
}