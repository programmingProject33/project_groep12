import React, { useState } from "react";
import "./Profiel.css";
import { useAuth } from "../AuthContext.jsx";
import { MdPerson, MdEmail, MdSchool, MdGrade, MdLogout } from "react-icons/md";

const DIENSTVERBAND_OPTIES = [
  "Voltijds",
  "Deeltijds",
  "Stage",
  "Flexi-job",
  "Vrijwilliger"
];

export default function Profiel() {
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    voornaam: user?.voornaam || "",
    naam: user?.naam || "",
    gebruikersnaam: user?.gebruikersnaam || "",
    email: user?.email || "",
    opleiding: user?.opleiding || "",
    opleiding_jaar: user?.opleiding_jaar || "",
    dienstverbanden: user?.dienstverbanden || []
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get first letter of name for avatar
  const getInitials = () => {
    if (!user?.voornaam) return "?";
    return user.voornaam.charAt(0).toUpperCase();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "dienstverbanden") {
      setForm((prev) => {
        let newArr = prev.dienstverbanden || [];
        if (checked) {
          newArr = [...newArr, value];
        } else {
          newArr = newArr.filter((v) => v !== value);
        }
        return { ...prev, dienstverbanden: newArr };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = () => {
    setForm({
      voornaam: user?.voornaam || "",
      naam: user?.naam || "",
      gebruikersnaam: user?.gebruikersnaam || "",
      email: user?.email || "",
      opleiding: user?.opleiding || "",
      opleiding_jaar: user?.opleiding_jaar || "",
      dienstverbanden: user?.dienstverbanden || []
    });
    setEditMode(true);
    setError("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/profiel/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fout bij opslaan");
      }
      // Profiel opnieuw ophalen
      const profRes = await fetch(`/api/profiel/${user.id}`);
      const profData = await profRes.json();
      setUser((prev) => ({ ...prev, ...profData }));
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profiel-page">
      <div className="profiel-hero">
        <svg
          className="profiel-wave"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#eef4ff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <main className="profiel-main">
        <div className="profiel-header">
          <h1>Mijn Profiel</h1>
          <div className="avatar-hero profiel-avatar-hero">
            {getInitials()}
          </div>
        </div>

        {!editMode ? (
          <>
            <div className="profiel-info left-align">
              <div className="profiel-info-item">
                <MdPerson className="profiel-icon" />
                <div>
                  <span className="profiel-label">Naam</span>
                  <p>{user?.voornaam} {user?.naam}</p>
                </div>
              </div>
              <div className="profiel-info-item">
                <MdPerson className="profiel-icon" />
                <div>
                  <span className="profiel-label">Gebruikersnaam</span>
                  <p>{user?.gebruikersnaam}</p>
                </div>
              </div>
              <div className="profiel-info-item">
                <MdEmail className="profiel-icon" />
                <div>
                  <span className="profiel-label">E-mail</span>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div className="profiel-info-item">
                <MdSchool className="profiel-icon" />
                <div>
                  <span className="profiel-label">Opleiding</span>
                  <p>{user?.opleiding}</p>
                </div>
              </div>
              <div className="profiel-info-item">
                <MdGrade className="profiel-icon" />
                <div>
                  <span className="profiel-label">Opleiding jaar</span>
                  <p>{user?.opleiding_jaar}</p>
                </div>
              </div>
              <div className="profiel-info-item">
                <span className="profiel-label">Voorkeursdienstverband</span>
                <p>{(() => {
                  let dienstverbanden = user?.dienstverbanden;
                  if (typeof dienstverbanden === 'string') {
                    try {
                      dienstverbanden = JSON.parse(dienstverbanden);
                    } catch {
                      dienstverbanden = dienstverbanden.split(',').map(v => v.trim()).filter(Boolean);
                    }
                  }
                  if (Array.isArray(dienstverbanden)) {
                    return dienstverbanden.length > 0
                      ? dienstverbanden.join(", ")
                      : <span style={{color:'#aaa'}}>Niet opgegeven</span>;
                  }
                  return <span style={{color:'#aaa'}}>Niet opgegeven</span>;
                })()}</p>
              </div>
            </div>
            <div className="profiel-actions">
              <button className="edit-profile-btn" onClick={handleEdit}><span dangerouslySetInnerHTML={{__html: "&#9998;"}} /> Bewerk profiel</button>
              <button
                className="logout-btn"
                onClick={() => {
                  setUser(null);
                  window.location.href = "/login";
                }}
              >
                <MdLogout className="logout-icon" />
                <span>Uitloggen</span>
              </button>
            </div>
          </>
        ) : (
          <form className="profiel-info left-align" onSubmit={handleSubmit} style={{marginBottom:24}}>
            <div className="profiel-edit-row">
              <label>
                Voornaam
                <input className="profiel-input" name="voornaam" value={form.voornaam} onChange={handleChange} required />
              </label>
              <label>
                Naam
                <input className="profiel-input" name="naam" value={form.naam} onChange={handleChange} required />
              </label>
            </div>
            <div className="profiel-edit-row">
              <label>
                Gebruikersnaam
                <input className="profiel-input" name="gebruikersnaam" value={form.gebruikersnaam} onChange={handleChange} required />
              </label>
              <label>
                E-mail
                <input className="profiel-input" name="email" value={form.email} onChange={handleChange} required />
              </label>
            </div>
            <div className="profiel-edit-row">
              <label>
                Opleiding
                <input className="profiel-input" name="opleiding" value={form.opleiding} onChange={handleChange} required />
              </label>
              <label>
                Opleiding jaar
                <input className="profiel-input" name="opleiding_jaar" value={form.opleiding_jaar} onChange={handleChange} required />
              </label>
            </div>
            <div style={{marginTop:16, marginBottom:8}}>
              <span className="profiel-label" style={{fontWeight:600}}>Voorkeursdienstverband</span>
              <div style={{display:'flex', gap:'1.2rem', flexWrap:'wrap', marginTop:8}}>
                {DIENSTVERBAND_OPTIES.map(opt => (
                  <label key={opt} style={{display:'flex',alignItems:'center',gap:6,fontWeight:500}}>
                    <input
                      type="checkbox"
                      name="dienstverbanden"
                      value={opt}
                      checked={form.dienstverbanden.includes(opt)}
                      onChange={handleChange}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            {error && <div className="profiel-error">{error}</div>}
            <div className="profiel-actions">
              <button type="submit" className="edit-profile-btn" disabled={loading}>{loading ? "Opslaan..." : "Opslaan"}</button>
              <button type="button" className="logout-btn" onClick={handleCancel} disabled={loading}>Annuleren</button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
} 