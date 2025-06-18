import React, { useState, useEffect, useRef } from "react";
import "./Profiel.css";
import { useAuth } from "../AuthContext.jsx";
import { MdPerson, MdEmail, MdSchool } from "react-icons/md";
import { FaLinkedin, FaStar, FaPuzzlePiece } from "react-icons/fa6";

const OPLEIDINGEN = [
  "Multimedia & Creatieve Technologie (bachelor)",
  "Toegepaste Informatica (bachelor)",
  "Graduaat Elektromechanische Systemen",
  "Graduaat Programmeren",
  "Graduaat Systeem- en Netwerkbeheer",
  "Postgraduaat Coding (online)",
  "Postgraduaat Toegepaste Artificial Intelligence"
];

const DIENSTVERBANDEN = [
  "Voltijds",
  "Deeltijds",
  "Freelance",
  "Stage"
];

const Profiel = () => {
  const { user, setUser, isAuthLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    voornaam: "",
    naam: "",
    gebruikersnaam: "",
    opleiding: "",
    opleiding_jaar: "",
    email: "",
    dienstverbanden: [],
    linkedin: "",
    foto: ""
  });
  const fileInputRef = useRef();

  useEffect(() => {
    if (user) {
      setProfile({
        voornaam: user.voornaam || "",
        naam: user.naam || "",
        gebruikersnaam: user.gebruikersnaam || "",
        opleiding: user.opleiding || "",
        opleiding_jaar: user.opleiding_jaar || "",
        email: user.email || "",
        dienstverbanden: user.dienstverbanden || [],
        linkedin: user.linkedin || "",
        foto: user.foto || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // PATCH-ready: stuur profiel naar backend
    setUser({ ...user, ...profile });
    setEditMode(false);
  };

  // Avatar: profielfoto of eerste letter
  const avatar = profile.foto
    ? <img src={profile.foto} alt="Profielfoto" className="profiel-avatar-img" />
    : <div className="profiel-avatar-letter">{(profile.voornaam || profile.naam || "").charAt(0).toUpperCase()}</div>;

  // Dienstverbanden altijd als array parsen
  const getDienstverbandenArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const arr = JSON.parse(val);
        if (Array.isArray(arr)) return arr;
      } catch {
        // fallback: split op komma
        return val.replace(/\[|\]|"/g, '').split(',').map(d => d.trim()).filter(Boolean);
      }
    }
    return [];
  };
  const dienstverbandenArray = getDienstverbandenArray(profile.dienstverbanden);

  if (isAuthLoading) return null;

  return (
    <div className="profiel-bg">
      <div className="profiel-card-new">
        <div className="profiel-avatar-box">
          {avatar}
          {editMode && (
            <>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFotoChange}
              />
              <button className="profiel-foto-btn" onClick={() => fileInputRef.current.click()}>
                Profielfoto wijzigen
              </button>
            </>
          )}
        </div>
        <div className="profiel-naam-box">
          <div className="profiel-naam-new">{profile.voornaam} {profile.naam}</div>
          {profile.linkedin && profile.linkedin.trim() !== "" && !editMode && (
            <a
              href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="profiel-linkedin-btn-new"
            >
              <FaLinkedin style={{ marginRight: 6 }} /> Bekijk LinkedIn-profiel
            </a>
          )}
        </div>
        <button className="profiel-edit-btn-new" onClick={() => setEditMode((v) => !v)}>
          {editMode ? "Annuleren" : "Profiel bewerken"}
        </button>
        <div className="profiel-info-list-new">
          <div className="profiel-info-item-new">
            <MdPerson size={22} color="#3b82f6" />
            <div>
              <div className="profiel-label-new">Naam</div>
              {editMode ? (
                <input
                  name="naam"
                  value={profile.naam}
                  onChange={handleChange}
                  className="profiel-input"
                  placeholder="Naam"
                />
              ) : (
                <div className="profiel-value-new">{profile.voornaam} {profile.naam}</div>
              )}
            </div>
          </div>
          <div className="profiel-info-item-new">
            <MdPerson size={22} color="#3b82f6" />
            <div>
              <div className="profiel-label-new">Gebruikersnaam</div>
              {editMode ? (
                <input
                  name="gebruikersnaam"
                  value={profile.gebruikersnaam}
                  onChange={handleChange}
                  className="profiel-input"
                  placeholder="Gebruikersnaam"
                />
              ) : (
                <div className="profiel-value-new">{profile.gebruikersnaam}</div>
              )}
            </div>
          </div>
          <div className="profiel-info-item-new">
            <MdEmail size={22} color="#3b82f6" />
            <div>
              <div className="profiel-label-new">E-mailadres</div>
              {editMode ? (
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="profiel-input"
                  placeholder="E-mailadres"
                />
              ) : (
                <div className="profiel-value-new">{profile.email}</div>
              )}
            </div>
          </div>
          <div className="profiel-info-item-new">
            <MdSchool size={22} color="#3b82f6" />
            <div>
              <div className="profiel-label-new">Opleiding</div>
              {editMode ? (
                <select
                  name="opleiding"
                  value={profile.opleiding}
                  onChange={handleChange}
                  className="profiel-input"
                >
                  <option value="">Kies je opleiding</option>
                  {OPLEIDINGEN.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <div className="profiel-value-new">{profile.opleiding}</div>
              )}
            </div>
          </div>
          <div className="profiel-info-item-new">
            <FaStar size={20} color="#3b82f6" />
            <div>
              <div className="profiel-label-new">Opleiding jaar</div>
              {editMode ? (
                <input
                  name="opleiding_jaar"
                  value={profile.opleiding_jaar}
                  onChange={handleChange}
                  className="profiel-input"
                  placeholder="Opleiding jaar"
                />
              ) : (
                <div className="profiel-value-new">{profile.opleiding_jaar}</div>
              )}
            </div>
          </div>
          {dienstverbandenArray.length > 0 && (
            <div className="profiel-info-item-new">
              <FaPuzzlePiece size={20} color="#3b82f6" />
              <div>
                <div className="profiel-label-new">Dienstverband</div>
                <div className="profiel-value-new">{dienstverbandenArray.join(", ")}</div>
              </div>
            </div>
          )}
          {editMode && (
            <div className="profiel-info-item-new">
              <FaPuzzlePiece size={20} color="#3b82f6" />
              <div>
                <div className="profiel-label-new">Dienstverband</div>
                <div className="profiel-dienstverbanden-edit-new">
                  {DIENSTVERBANDEN.map(opt => (
                    <label key={opt} className="profiel-checkbox-label-new">
                      <input
                        type="checkbox"
                        checked={dienstverbandenArray.includes(opt)}
                        onChange={() => {
                          setProfile(prev => {
                            const arr = dienstverbandenArray.includes(opt)
                              ? dienstverbandenArray.filter(d => d !== opt)
                              : [...dienstverbandenArray, opt];
                            return { ...prev, dienstverbanden: arr };
                          });
                        }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          {editMode && (
            <div className="profiel-info-item-new">
              <FaLinkedin size={22} color="#3b82f6" />
              <div>
                <div className="profiel-label-new">LinkedIn-profiel</div>
                <input
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleChange}
                  className="profiel-input"
                  placeholder="Voer je LinkedIn-profiel URL in"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}
        </div>
        {editMode && (
          <button className="profiel-save-btn-new" onClick={handleSave} style={{ marginTop: 18 }}>
            Opslaan
          </button>
        )}
        {/* Uitlog-knop onderaan, binnen de kaart */}
        <button
          className="profiel-logout-btn-new"
          style={{ margin: '2.2rem auto 0 auto', display: 'block' }}
          onClick={() => {
            setUser(null);
            window.location.href = "/login";
          }}
        >
          Uitloggen
        </button>
      </div>
    </div>
  );
};

export default Profiel;
