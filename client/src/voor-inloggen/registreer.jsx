import React, { useState } from "react";
import "./registreer.css"; // Dit importeert de styling (kleuren, lay-out, lettertypes) van de pagina.
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
// Dit importeert iconen van sociale media die je kan gebruiken in de pagina.
import { useNavigate } from "react-router-dom";
// useNavigate is een hook (speciale functie) die je gebruikt om te navigeren (pagina veranderen) zonder dat de pagina helemaal opnieuw laadt.

const OPLEIDINGEN = [
  "Multimedia & Creatieve Technologie (bachelor)",
  "Toegepaste Informatica (bachelor)",
  "Graduaat Elektromechanische Systemen",
  "Graduaat Programmeren",
  "Graduaat Systeem- en Netwerkbeheer",
  "Postgraduaat Coding (online)",
  "Postgraduaat Toegepaste Artificial Intelligence"
];

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

  // State for student form
  const [studentForm, setStudentForm] = useState({
    voornaam: '',
    naam: '',
    email: '',
    gebruikersnaam: '',
    wachtwoord: '',
    wachtwoord2: '',
    opleiding: '',
    opleiding_jaar: '',
    linkedin: ''
  });

  // State for company form
  const [companyForm, setCompanyForm] = useState({
    bedrijfsnaam: '',
    kvk: '',
    btw: '',
    straat: '',
    gemeente: '',
    telbedrijf: '',
    emailbedrijf: '',
    voornaam_contact: '',
    naam_contact: '',
    specialisatie: '',
    email_contact: '',
    tel_contact: '',
    gebruikersnaam_bedrijf: '',
    wachtwoord_bedrijf: '',
    wachtwoord2_bedrijf: '',
    sector: '',
    beschrijving: '',
    zoeken_we: ''
  });

  // Error state
  const [error, setError] = useState('');

  const handleStudentChange = (e) => {
    setStudentForm({
      ...studentForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCompanyChange = (e) => {
    setCompanyForm({
      ...companyForm,
      [e.target.name]: e.target.value
    });
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (studentForm.wachtwoord !== studentForm.wachtwoord2) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'student',
          ...studentForm
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Er is iets misgegaan');
      }

      // Registration successful
      alert('Account succesvol aangemaakt!');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (companyForm.wachtwoord_bedrijf !== companyForm.wachtwoord2_bedrijf) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    // Always use gebruikersnaam from localStorage if available
    const gebruikersnaam = localStorage.getItem('gebruikersnaam') || companyForm.gebruikersnaam;

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'bedrijf',
          ...companyForm,
          gebruikersnaam // override or add
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Er is iets misgegaan');
      }

      // Registration successful
      alert('Bedrijfsaccount succesvol aangemaakt!');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="registreer-bg">
      <div className="registreer-hero">
        <svg className="registreer-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#eef4ff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <h1 className="registreer-hero-title">Registreren</h1>
      </div>
      <main className="registreer-main registreer-anim">
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

        {error && <div className="error-message">{error}</div>}

        <div className="registerstudent-content">
          {/* Dit stukje toont een formulier afhankelijk van welke tab actief is */}

          {activeTab === "student" && (
            <form className="registerstudent-form" onSubmit={handleStudentSubmit}>
              {/* Formulier voor studenten registratie */}
              <h1 className="registerstudent-title">Account maken als Student</h1>
              <label>
                Voornaam:
                <input 
                  type="text" 
                  name="voornaam" 
                  value={studentForm.voornaam}
                  onChange={handleStudentChange}
                  required
                />
              </label>
              <label>
                Naam:
                <input 
                  type="text" 
                  name="naam" 
                  value={studentForm.naam}
                  onChange={handleStudentChange}
                  required
                />
              </label>
              <label>
                E-mailadres:
                <input 
                  type="email" 
                  name="email" 
                  value={studentForm.email}
                  onChange={handleStudentChange}
                  required
                />
              </label>
              <label>
                Gebruikersnaam:
                <input 
                  type="text" 
                  name="gebruikersnaam" 
                  value={studentForm.gebruikersnaam}
                  onChange={handleStudentChange}
                  required
                />
              </label>
              <label>
                Opleiding:
                <select 
                  name="opleiding" 
                  value={studentForm.opleiding}
                  onChange={handleStudentChange}
                  required
                  className="registerstudent-form select"
                >
                  <option value="">Kies je opleiding</option>
                  {OPLEIDINGEN.map((opleiding) => (
                    <option key={opleiding} value={opleiding}>{opleiding}</option>
                  ))}
                </select>
              </label>
              <label>
                Opleiding Jaar:
                <select 
                  name="opleiding_jaar" 
                  value={studentForm.opleiding_jaar}
                  onChange={handleStudentChange}
                  required
                  className="registerstudent-form select"
                >
                  <option value="2">Jaar 2</option>
                  <option value="3">Jaar 3</option>
                </select>
              </label>
              <label>
                Wachtwoord:
                <input 
                  type="password" 
                  name="wachtwoord" 
                  value={studentForm.wachtwoord}
                  onChange={handleStudentChange}
                  required
                />
              </label>
              <label>
                Wachtwoord bevestiging:
                <input 
                  type="password" 
                  name="wachtwoord2" 
                  value={studentForm.wachtwoord2}
                  onChange={handleStudentChange}
                  required
                />
              </label>
              <label>
                LinkedIn-profiel (optioneel):
                <input
                  type="url"
                  name="linkedin"
                  value={studentForm.linkedin || ''}
                  onChange={handleStudentChange}
                  pattern="https://www.linkedin.com/*"
                  placeholder="Bijvoorbeeld: https://www.linkedin.com/in/voornaam-achternaam"
                  className="registerstudent-form input"
                />
                <span className="form-helper">Bijvoorbeeld: https://www.linkedin.com/in/voornaam-achternaam</span>
              </label>
              <button type="submit" className="registerstudent-btn student-btn">
                Account maken
              </button>
              {/* Knop om het formulier te versturen */}
            </form>
          )}
 
          {activeTab === "bedrijf" && (
            <form className="registerbedrijf-form" onSubmit={handleCompanySubmit}>
              {/* Formulier voor bedrijf registratie */}
              <h1 className="registerbedrijf-title">Account maken als Bedrijf</h1>

              <h2 className="registerbedrijf-section-title">Bedrijfsgegevens:</h2>
              <label>
                Bedrijfsnaam:
                <input 
                  type="text" 
                  name="bedrijfsnaam" 
                  value={companyForm.bedrijfsnaam}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                Sector:
                <input
                  type="text"
                  name="sector"
                  value={companyForm.sector}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                Wie zijn we:
                <textarea
                  name="beschrijving"
                  value={companyForm.beschrijving}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                Dit zoeken we:
                <textarea
                  name="zoeken_we"
                  value={companyForm.zoeken_we}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                KVK-nummer:
                <input 
                  type="text" 
                  name="kvk" 
                  value={companyForm.kvk}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                BTW-nummer:
                <input 
                  type="text" 
                  name="btw" 
                  value={companyForm.btw}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <div className="registerbedrijf-address-row">
                <label>
                  Straatnaam en huisnummer:
                  <input 
                    type="text" 
                    name="straat" 
                    value={companyForm.straat}
                    onChange={handleCompanyChange}
                    required
                  />
                </label>
                <label>
                  Gemeente en postcode:
                  <input 
                    type="text" 
                    name="gemeente" 
                    value={companyForm.gemeente}
                    onChange={handleCompanyChange}
                    required
                  />
                </label>
              </div>
              <label>
                Telefoonnummer:
                <input 
                  type="text" 
                  name="telbedrijf" 
                  value={companyForm.telbedrijf}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                Bedrijf e-mailadres:
                <input 
                  type="email" 
                  name="emailbedrijf" 
                  value={companyForm.emailbedrijf}
                  onChange={handleCompanyChange}
                  required
                />
              </label>

              <h2 className="registerbedrijf-section-title">Contactpersoon:</h2>
              <label>
                Voornaam:
                <input 
                  type="text" 
                  name="voornaam_contact" 
                  value={companyForm.voornaam_contact}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                Naam:
                <input 
                  type="text" 
                  name="naam_contact" 
                  value={companyForm.naam_contact}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                Specialisatie:
                <input 
                  type="text" 
                  name="specialisatie" 
                  value={companyForm.specialisatie}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                E-mailadres:
                <input 
                  type="email" 
                  name="email_contact" 
                  value={companyForm.email_contact}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                Telefoonnummer:
                <input 
                  type="text" 
                  name="tel_contact" 
                  value={companyForm.tel_contact}
                  onChange={handleCompanyChange}
                  required
                />
              </label>

              <h2 className="registerbedrijf-section-title">Accountgegevens</h2>
              <label>
                Gebruikersnaam:
                <input 
                  type="text" 
                  name="gebruikersnaam_bedrijf" 
                  value={companyForm.gebruikersnaam_bedrijf}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                Wachtwoord:
                <input 
                  type="password" 
                  name="wachtwoord_bedrijf" 
                  value={companyForm.wachtwoord_bedrijf}
                  onChange={handleCompanyChange}
                  required
                />
              </label>
              <label>
                Wachtwoord bevestiging:
                <input 
                  type="password" 
                  name="wachtwoord2_bedrijf" 
                  value={companyForm.wachtwoord2_bedrijf}
                  onChange={handleCompanyChange}
                  required
                />
              </label>

              <button type="submit" className="registerbedrijf-btn bedrijf-btn">
                Account maken
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}