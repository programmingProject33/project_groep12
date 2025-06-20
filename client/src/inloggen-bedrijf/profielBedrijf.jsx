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
    wachtwoord: user?.wachtwoord || "",
    sector: user?.sector || "",
    beschrijving: user?.beschrijving || "",
    zoeken_we: user?.zoeken_we || "",
    created_at: user?.created_at || "",
    lokaal: user?.lokaal || "",
    verdieping: user?.verdieping || ""
  });

  useEffect(() => {
    if (user) {
      setProfile({
        bedrijf_id: user.bedrijf_id || "",
        bedrijf_URL: user.bedrijf_URL || "",
        naam: user.naam || "",
        BTW_nr: user.BTW_nr || "",
        straatnaam: user.straatnaam || "",
        huis_nr: user.huis_nr || "",
        bus_nr: user.bus_nr || "",
        postcode: user.postcode || "",
        gemeente: user.gemeente || "",
        telefoon_nr: user.telefoon_nr || "",
        email: user.email || "",
        contact_voornaam: user.contact_voornaam || "",
        contact_naam: user.contact_naam || "",
        contact_specialisatie: user.contact_specialisatie || "",
        contact_email: user.contact_email || "",
        contact_telefoon: user.contact_telefoon || "",
        gebruikersnaam: user.gebruikersnaam || "",
        wachtwoord: user.wachtwoord || "",
        sector: user.sector || "",
        beschrijving: user.beschrijving || "",
        zoeken_we: user.zoeken_we || "",
        created_at: user.created_at || "",
        lokaal: user.lokaal || "",
        verdieping: user.verdieping || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
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

    const postData = { ...profile, gebruikerId: parseInt(profile.bedrijf_id, 10) };
    console.log('POST profiel:', postData);
    try {
      const res = await fetch("/api/bedrijf/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });
      if (res.ok) {
        setSuccess("Profiel succesvol bijgewerkt.");
        setEditMode(false);
        setUser({ ...user, ...profile });
      } else {
        setError("Er is iets misgegaan bij het opslaan.");
      }
    } catch (err) {
      setError("Er is iets misgegaan bij het opslaan.");
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
              <div className="bedrijfprofiel-info-item profiel-grid-full"><span className="bedrijfprofiel-label">Beschrijving</span><textarea name="beschrijving" value={profile.beschrijving} onChange={handleChange} /></div>
              <div className="bedrijfprofiel-info-item profiel-grid-full"><span className="bedrijfprofiel-label">Wat zoeken we?</span><textarea name="zoeken_we" value={profile.zoeken_we} onChange={handleChange} /></div>
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
            <div className="bedrijfprofiel-info-item profiel-grid-full"><span className="bedrijfprofiel-label">Beschrijving</span><span className="bedrijfprofiel-value">{profile.beschrijving}</span></div>
            <div className="bedrijfprofiel-info-item profiel-grid-full"><span className="bedrijfprofiel-label">Wat zoeken we?</span><span className="bedrijfprofiel-value">{profile.zoeken_we}</span></div>
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