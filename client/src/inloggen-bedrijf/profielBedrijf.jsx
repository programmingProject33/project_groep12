import React, { useState, useEffect, useRef } from "react";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import "./profielBedrijf.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { FaBuilding, FaEye, FaEyeSlash } from "react-icons/fa";

// Mapping functie voor lokaal/klas naar aula
function mapKlasToAula(val) {
  if (!val) return val;
  const match = String(val).match(/^klas\s?(\d)$/i);
  if (match) {
    return `aula ${match[1]}`;
  }
  return val;
}

export default function Profiel() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef();

  // Alle bedrijfsvelden
  const [profile, setProfile] = useState({
    bedrijf_id: user?.bedrijf_id || "",
    bedrijf_URL: user?.bedrijf_URL || "",
    naam: user?.naam || "",
    BTW_nr: user?.BTW_nr || "",
    straatnaam: user?.straatnaam || "",
    huis_nr: user?.huis_nr || "",
    bus_nr: user?.bus_nr || "",
    postcode: user?.postcode || "",
    gemeente: user?.gemeente || "",
    telefoon_nr: user?.telefoon_nr || "",
    email: user?.email || "",
    contact_voornaam: user?.contact_voornaam || "",
    contact_naam: user?.contact_naam || "",
    contact_specialisatie: user?.contact_specialisatie || "",
    contact_email: user?.contact_email || "",
    contact_telefoon: user?.contact_telefoon || "",
    gebruikersnaam: user?.gebruikersnaam || "",
    wachtwoord: "", // Start met een leeg wachtwoordveld
    sector: user?.sector || "",
    beschrijving: user?.beschrijving || "",
    gezocht_profiel_omschrijving: user?.gezocht_profiel_omschrijving || "",
    gezochte_opleidingen: user?.gezochte_opleidingen || "",
    dienstverbanden: user?.dienstverbanden || [],
    created_at: user?.created_at || "",
    lokaal: user?.lokaal || "",
    verdieping: user?.verdieping || ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.bedrijf_id) {
        try {
          const res = await fetch(`/api/bedrijf/profiel/${user.bedrijf_id}`);
          if (res.ok) {
            const data = await res.json();
            setProfile({
              ...data,
              wachtwoord: "", // Wachtwoord niet meesturen, dus leeg houden
            });
          } else {
            setError("Profielgegevens konden niet worden geladen.");
          }
        } catch (err) {
          setError("Netwerkfout bij het laden van profielgegevens.");
        }
      }
    };
    fetchProfile();
  }, [user?.bedrijf_id]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleDienstverbandChange = (e) => {
    const { value, checked } = e.target;
    const { dienstverbanden } = profile;

    if (checked) {
      setProfile({ ...profile, dienstverbanden: [...dienstverbanden, value] });
    } else {
      setProfile({
        ...profile,
        dienstverbanden: dienstverbanden.filter((item) => item !== value),
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    // Validate password length if it's being changed
    if (profile.wachtwoord && profile.wachtwoord.length < 6) {
      setError("Wachtwoord moet minimaal 6 tekens bevatten");
      return;
    }

    // Clone het profiel object om het veilig aan te passen voor de POST request
    const postData = { ...profile };

    // Als het wachtwoordveld leeg is, verwijder het dan uit de data
    // zodat het niet wordt geüpdatet naar een lege string.
    if (!postData.wachtwoord) {
      delete postData.wachtwoord;
    }

    try {
      const res = await fetch("/api/bedrijf/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });
      if (res.ok) {
        setSuccess("Profiel succesvol bijgewerkt.");
        setEditMode(false);
        // Update de user context met de nieuwe data (zonder wachtwoord)
        const updatedUser = { ...user, ...profile };
        if (postData.wachtwoord) {
          updatedUser.wachtwoord = postData.wachtwoord; // Update wachtwoord in context als het is gewijzigd
        } else {
          delete updatedUser.wachtwoord;
        }
        setUser(updatedUser);

      } else {
        const errData = await res.json();
        setError(errData.error || "Er is iets misgegaan bij het opslaan.");
      }
    } catch (err) {
      setError("Netwerkfout bij het opslaan.");
    }
  };

  // Avatar: eerste letter bedrijfsnaam
  const avatar = (
    <div className="bedrijfprofiel-avatar-letter">
      {(profile.naam || "").charAt(0).toUpperCase() || <FaBuilding />}
    </div>
  );

  return (
    <div className="bedrijfprofiel-bg">
      <BedrijfNavbar />
      <div className="bedrijfprofiel-card">
        <div className="bedrijfprofiel-avatar-box">{avatar}</div>
        <div className="bedrijfprofiel-title">{profile.naam}</div>
        <div className="bedrijfprofiel-sub">{profile.sector}</div>
        {success && <div className="bedrijfprofiel-success">{success}</div>}
        {error && <div className="bedrijfprofiel-error">{error}</div>}
        <button className="profielbedrijf-edit-btn" onClick={() => setEditMode((v) => !v)}>
          {editMode ? "Annuleren" : "Profiel bewerken"}
        </button>
        {editMode ? (
          <form className="bedrijfprofiel-form" onSubmit={handleSave}>
            <div className="bedrijfprofiel-info-list profiel-grid">
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Bedrijfsnaam</span><input name="naam" value={profile.naam} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">BTW-nummer</span><input name="BTW_nr" value={profile.BTW_nr} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Website</span><input name="bedrijf_URL" value={profile.bedrijf_URL} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Straatnaam</span><input name="straatnaam" value={profile.straatnaam} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Huisnummer</span><input name="huis_nr" value={profile.huis_nr} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Busnummer</span><input name="bus_nr" value={profile.bus_nr} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Postcode</span><input name="postcode" value={profile.postcode} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Gemeente</span><input name="gemeente" value={profile.gemeente} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Telefoon</span><input name="telefoon_nr" value={profile.telefoon_nr} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">E-mail</span><input name="email" value={profile.email} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Contact voornaam</span><input name="contact_voornaam" value={profile.contact_voornaam} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Contact naam</span><input name="contact_naam" value={profile.contact_naam} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Contact specialisatie</span><input name="contact_specialisatie" value={profile.contact_specialisatie} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Contact e-mail</span><input name="contact_email" value={profile.contact_email} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Contact telefoon</span><input name="contact_telefoon" value={profile.contact_telefoon} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Gebruikersnaam</span><input name="gebruikersnaam" value={profile.gebruikersnaam} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item">
                <span className="bedrijfprofiel-label">Wachtwoord</span>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="wachtwoord" 
                    value={profile.wachtwoord} 
                    onChange={handleChange}
                    placeholder="Laat leeg om niet te wijzigen"
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Sector</span><input name="sector" value={profile.sector} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item profiel-grid-full"><span className="bedrijfprofiel-label">Bedrijfsbeschrijving</span><textarea name="beschrijving" value={profile.beschrijving} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item profiel-grid-full"><span className="bedrijfprofiel-label">Omschrijving gezocht profiel</span><textarea name="gezocht_profiel_omschrijving" value={profile.gezocht_profiel_omschrijving} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item profiel-grid-full"><span className="bedrijfprofiel-label">Gezochte opleidingen (voor matching)</span><textarea name="gezochte_opleidingen" value={profile.gezochte_opleidingen} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item profiel-grid-full">
                <span className="bedrijfprofiel-label">Aangeboden dienstverbanden</span>
                <div className="checkbox-group">
                  {['Voltijds', 'Deeltijds', 'Freelance', 'Stage'].map(dienstverband => (
                    <label key={dienstverband} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="dienstverbanden"
                        value={dienstverband}
                        checked={profile.dienstverbanden.includes(dienstverband)}
                        onChange={handleDienstverbandChange}
                      />
                      {dienstverband}
                    </label>
                  ))}
                </div>
              </div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Lokaal</span><span className="bedrijfprofiel-value">{mapKlasToAula(profile.lokaal) || 'Niet toegewezen'}</span></div>
              <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Verdieping</span><span className="bedrijfprofiel-value">{mapKlasToAula(profile.verdieping) || 'Onbekend'}</span></div>
            </div>
            <button type="submit" className="bedrijfprofiel-save-btn">Opslaan</button>
          </form>
        ) : (
          <div className="bedrijfprofiel-info-list profiel-grid">
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Bedrijfsnaam</span><span className="bedrijfprofiel-value">{profile.naam}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">BTW-nummer</span><span className="bedrijfprofiel-value">{profile.BTW_nr}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Website</span><span className="bedrijfprofiel-value">{profile.bedrijf_URL}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Straatnaam</span><span className="bedrijfprofiel-value">{profile.straatnaam}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Huisnummer</span><span className="bedrijfprofiel-value">{profile.huis_nr}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Busnummer</span><span className="bedrijfprofiel-value">{profile.bus_nr}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Postcode</span><span className="bedrijfprofiel-value">{profile.postcode}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Gemeente</span><span className="bedrijfprofiel-value">{profile.gemeente}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Telefoon</span><span className="bedrijfprofiel-value">{profile.telefoon_nr}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">E-mail</span><span className="bedrijfprofiel-value">{profile.email}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Contact voornaam</span><span className="bedrijfprofiel-value">{profile.contact_voornaam}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Contact naam</span><span className="bedrijfprofiel-value">{profile.contact_naam}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Contact specialisatie</span><span className="bedrijfprofiel-value">{profile.contact_specialisatie}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Contact e-mail</span><span className="bedrijfprofiel-value">{profile.contact_email}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Contact telefoon</span><span className="bedrijfprofiel-value">{profile.contact_telefoon}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Gebruikersnaam</span><span className="bedrijfprofiel-value">{profile.gebruikersnaam}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Sector</span><span className="bedrijfprofiel-value">{profile.sector}</span></div>
            <div className="bedrijfprofiel-info-item profiel-grid-full"><span className="bedrijfprofiel-label">Bedrijfsbeschrijving</span><span className="bedrijfprofiel-value">{profile.beschrijving}</span></div>
            <div className="bedrijfprofiel-info-item profiel-grid-full"><span className="bedrijfprofiel-label">Omschrijving gezocht profiel</span><span className="bedrijfprofiel-value">{profile.gezocht_profiel_omschrijving}</span></div>
            <div className="bedrijfprofiel-info-item profiel-grid-full"><span className="bedrijfprofiel-label">Gezochte opleidingen</span><span className="bedrijfprofiel-value">{profile.gezochte_opleidingen}</span></div>
            <div className="bedrijfprofiel-info-item profiel-grid-full"><span className="bedrijfprofiel-label">Aangeboden dienstverbanden</span><span className="bedrijfprofiel-value">{(profile.dienstverbanden || []).join(', ')}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Lokaal</span><span className="bedrijfprofiel-value">{mapKlasToAula(profile.lokaal) || 'Niet toegewezen'}</span></div>
            <div className="bedrijfprofiel-info-item"><span className="bedrijfprofiel-label">Verdieping</span><span className="bedrijfprofiel-value">{mapKlasToAula(profile.verdieping) || 'Onbekend'}</span></div>
          </div>
        )}
        <button
          onClick={() => {
            setUser(null);
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="profielbedrijf-logout-btn"
        >
          Uitloggen
        </button>
      </div>
      <BedrijfFooter />
    </div>
  );
} 