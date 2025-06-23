import React, { useState } from "react";
import "./registreer.css"; // Dit importeert de styling (kleuren, lay-out, lettertypes) van de pagina.
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok, FaEye, FaEyeSlash } from "react-icons/fa6";
// Dit importeert iconen van sociale media die je kan gebruiken in de pagina.
import { useNavigate, Link } from "react-router-dom";
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

const opleidingOpties = [
  "Toegepaste Informatica (Bachelor)",
  "Postgraduaat Coding (online)",
  "Multimedia & Creatieve Technologie (Bachelor)",
  "Digitale Vormgeving (Bachelor)",
  "Elektronica-ICT (Bachelor)",
  "Bedrijfsmanagement (Bachelor)",
  "Communicatie (Bachelor)",
  "Toerisme- en Recreatiemanagement (Bachelor)",
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

  // State for password
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showStudentPassword2, setShowStudentPassword2] = useState(false);
  const [showCompanyPassword, setShowCompanyPassword] = useState(false);
  const [showCompanyPassword2, setShowCompanyPassword2] = useState(false);

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
    btw: '',
    website_url: '',
    straat: '',
    huis_nr: '',
    bus_nr: '',
    postcode: '',
    gemeente: '',
    telbedrijf: '',
    emailbedrijf: '',
    contact_voornaam: '',
    contact_naam: '',
    contact_specialisatie: '',
    contact_email: '',
    contact_telefoon: '',
    gebruikersnaam_bedrijf: '',
    wachtwoord_bedrijf: '',
    wachtwoord2_bedrijf: '',
    sector: '',
    beschrijving: '',
    gezocht_profiel_omschrijving: '',
    gezochte_opleiding: '',
    dienstverband: '',
  });

  // Error state
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State voor succesbericht

  const handleStudentChange = (e) => {
    setStudentForm({
      ...studentForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm({ ...companyForm, [name]: value });
  };

  const handleDienstverbandChange = (e) => {
    const { value, checked } = e.target;
    const { dienstverbanden } = companyForm;

    if (checked) {
      setCompanyForm({
        ...companyForm,
        dienstverbanden: [...dienstverbanden, value],
      });
    } else {
      setCompanyForm({
        ...companyForm,
        dienstverbanden: dienstverbanden.filter((item) => item !== value),
      });
    }
  };

  // LinkedIn URL validation function
  const validateLinkedInUrl = (url) => {
    if (!url) return true; // Empty is valid (optional field)
    
    // Remove whitespace
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return true;
    
    // Check if it's a valid LinkedIn URL
    const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedInPattern.test(trimmedUrl);
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // Reset berichten bij nieuwe poging

    // Validate passwords match
    if (studentForm.wachtwoord !== studentForm.wachtwoord2) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    // Validate password length
    if (studentForm.wachtwoord.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten');
      return;
    }

    // Validate LinkedIn URL
    if (!validateLinkedInUrl(studentForm.linkedin)) {
      setError('Voer een geldige LinkedIn URL in (bijvoorbeeld: https://www.linkedin.com/in/voornaam-achternaam)');
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
          ...studentForm,
          dienstverbanden: []
        }),
      });
      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response body:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Er is iets misgegaan');
      }

      // Registration successful
      setSuccessMessage('🎉 Registratie succesvol! We hebben een verificatie-e-mail gestuurd naar je inbox. Klik op de link in de e-mail om je account te activeren. Controleer ook je spam-folder als je de e-mail niet ziet.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStudentForm({
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
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // === ROBUUSTE VALIDATIE ===
    if (!companyForm.wachtwoord_bedrijf || !companyForm.wachtwoord2_bedrijf) {
      setError('Wachtwoordvelden mogen niet leeg zijn.');
      return;
    }
    
    if (companyForm.wachtwoord_bedrijf !== companyForm.wachtwoord2_bedrijf) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    if (companyForm.wachtwoord_bedrijf.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'bedrijf',
          ...companyForm
        }),
      });
      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response body:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Er is iets misgegaan');
      }

      // Registratie succesvol
      setSuccessMessage('✅ Je bent succesvol geregistreerd! Je wordt nu doorgestuurd naar de loginpagina.');
      
      // Reset het formulier
      setCompanyForm({
        bedrijfsnaam: '', btw: '', straat: '', gemeente: '', telbedrijf: '',
        emailbedrijf: '', contact_voornaam: '', contact_naam: '', contact_specialisatie: '',
        contact_email: '', contact_telefoon: '', gebruikersnaam_bedrijf: '', wachtwoord_bedrijf: '',
        wachtwoord2_bedrijf: '', sector: '', beschrijving: '', gezocht_profiel_omschrijving: '',
        gezochte_opleiding: '', dienstverband: '', website_url: '', postcode: '',
        huis_nr: '', bus_nr: '',
      });

      // Stuur gebruiker door na 3 seconden
      setTimeout(() => {
        navigate('/login');
      }, 3000);

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
        {successMessage && <div className="success-message">{successMessage}</div>}

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
                <div className="password-input-container">
                  <input 
                    type={showStudentPassword ? "text" : "password"}
                    name="wachtwoord" 
                    value={studentForm.wachtwoord}
                    onChange={handleStudentChange}
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                  >
                    {showStudentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
              <label>
                Wachtwoord bevestiging:
                <div className="password-input-container">
                  <input 
                    type={showStudentPassword2 ? "text" : "password"}
                    name="wachtwoord2" 
                    value={studentForm.wachtwoord2}
                    onChange={handleStudentChange}
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowStudentPassword2(!showStudentPassword2)}
                  >
                    {showStudentPassword2 ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
              <label>
                LinkedIn-profiel (optioneel):
                <input
                  type="url"
                  name="linkedin"
                  value={studentForm.linkedin || ''}
                  onChange={handleStudentChange}
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
            <div className="register-form-container"> {/* Extra container voor de layout */}
              <form className="register-form" onSubmit={handleCompanySubmit}>
                <h1 className="form-title">Account maken als Bedrijf</h1>

                <fieldset className="form-fieldset">
                  <legend className="fieldset-legend">Bedrijfsgegevens</legend>
                  <div className="form-grid">
                    <label className="form-label grid-col-span-2">
                      <span>Officiële bedrijfsnaam:</span>
                      <input type="text" name="bedrijfsnaam" value={companyForm.bedrijfsnaam} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>BTW-nummer:</span>
                      <input type="text" name="btw" value={companyForm.btw} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Website:</span>
                      <input type="url" name="website_url" value={companyForm.website_url} onChange={handleCompanyChange} className="form-input" placeholder="https://www.voorbeeld.be" />
                    </label>
                     <label className="form-label">
                      <span>Telefoonnummer bedrijf:</span>
                      <input type="tel" name="telbedrijf" value={companyForm.telbedrijf} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Sector:</span>
                      <input type="text" name="sector" value={companyForm.sector} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                  </div>
                </fieldset>
                
                <fieldset className="form-fieldset">
                  <legend className="fieldset-legend">Adresgegevens</legend>
                  <div className="form-grid">
                    <label className="form-label grid-col-span-2">
                      <span>Straat:</span>
                      <input type="text" name="straat" value={companyForm.straat} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Huisnummer:</span>
                      <input type="text" name="huis_nr" value={companyForm.huis_nr} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                     <label className="form-label">
                      <span>Bus (optioneel):</span>
                      <input type="text" name="bus_nr" value={companyForm.bus_nr} onChange={handleCompanyChange} className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Postcode:</span>
                      <input type="text" name="postcode" value={companyForm.postcode} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Gemeente:</span>
                      <input type="text" name="gemeente" value={companyForm.gemeente} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                  </div>
                </fieldset>

                <fieldset className="form-fieldset">
                  <legend className="fieldset-legend">Profiel voor Studenten</legend>
                  <p className="fieldset-description">Deze informatie is zichtbaar op jullie bedrijfspagina voor de studenten.</p>
                  <div className="form-grid">
                    <label className="form-label grid-col-span-2">
                      <span>Korte bedrijfsbeschrijving:</span>
                      <textarea name="beschrijving" value={companyForm.beschrijving} onChange={handleCompanyChange} className="form-input" rows="4" placeholder="Wat doet jullie bedrijf?"></textarea>
                    </label>
                    <label className="form-label grid-col-span-2">
                      <span>Omschrijving gezocht profiel:</span>
                      <textarea name="gezocht_profiel_omschrijving" value={companyForm.gezocht_profiel_omschrijving} onChange={handleCompanyChange} className="form-input" rows="4" placeholder="Naar welke vaardigheden en persoonlijkheid zijn jullie op zoek?"></textarea>
                    </label>
                    <div className="form-label grid-col-span-2">
                      <span>In welke opleidingen hebben jullie interesse?</span>
                      <div className="checkbox-group">
                        {opleidingOpties.map((opleiding) => (
                          <label key={opleiding} className="checkbox-label">
                            <input
                              type="radio"
                              name="gezochte_opleiding"
                              value={opleiding}
                              checked={companyForm.gezochte_opleiding === opleiding}
                              onChange={handleCompanyChange}
                            />
                            {opleiding}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-label grid-col-span-2">
                      <span>Welk type dienstverband bieden jullie aan?</span>
                      <div className="checkbox-group">
                        {['Voltijds', 'Deeltijds', 'Freelance', 'Stage'].map((dienstverband) => (
                          <label key={dienstverband} className="checkbox-label">
                            <input
                              type="radio"
                              name="dienstverband"
                              value={dienstverband}
                              checked={companyForm.dienstverband === dienstverband}
                              onChange={handleCompanyChange}
                            />
                            {dienstverband}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="form-fieldset">
                  <legend className="fieldset-legend">Contactpersoon voor Speeddates</legend>
                  <p className="fieldset-description">Deze persoon zal de primaire contactpersoon zijn voor studenten en de organisatie.</p>
                  <div className="form-grid">
                    <label className="form-label">
                      <span>Voornaam:</span>
                      <input type="text" name="contact_voornaam" value={companyForm.contact_voornaam} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Naam:</span>
                      <input type="text" name="contact_naam" value={companyForm.contact_naam} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Functie/Specialisatie:</span>
                      <input type="text" name="contact_specialisatie" value={companyForm.contact_specialisatie} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Professioneel E-mailadres:</span>
                      <input type="email" name="contact_email" value={companyForm.contact_email} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Telefoonnummer:</span>
                      <input type="tel" name="contact_telefoon" value={companyForm.contact_telefoon} onChange={handleCompanyChange} className="form-input" />
                    </label>
                  </div>
                </fieldset>

                <fieldset className="form-fieldset">
                  <legend className="fieldset-legend">Accountgegevens</legend>
                  <p className="fieldset-description">Deze gegevens worden gebruikt om in te loggen op het Career Launch platform.</p>
                  <div className="form-grid">
                    <label className="form-label">
                      <span>Algemeen e-mailadres (voor verificatie):</span>
                      <input type="email" name="emailbedrijf" value={companyForm.emailbedrijf} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Gebruikersnaam:</span>
                      <input type="text" name="gebruikersnaam_bedrijf" value={companyForm.gebruikersnaam_bedrijf} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Wachtwoord:</span>
                      <input type="password" name="wachtwoord_bedrijf" value={companyForm.wachtwoord_bedrijf} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                    <label className="form-label">
                      <span>Herhaal wachtwoord:</span>
                      <input type="password" name="wachtwoord2_bedrijf" value={companyForm.wachtwoord2_bedrijf} onChange={handleCompanyChange} required className="form-input" />
                    </label>
                  </div>
                </fieldset>
                
                <button type="submit" className="registreer-button">Registreren</button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
