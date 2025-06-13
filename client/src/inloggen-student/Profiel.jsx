import React, { useState, useEffect } from "react";
import "./Profiel.css";
import { useAuth } from "../AuthContext.jsx";

const Profiel = () => {
  const { user, setUser } = useAuth();

  const [profile, setProfile] = useState({
    naam: "",
    studierichting: "",
    dienstverbanden: "",
    email: "",
    competenties: "",
    linkedinUrl: "",
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        naam: user.voornaam && user.naam ? `${user.voornaam} ${user.naam}` : user.naam || user.voornaam || "",
        studierichting: user.opleiding || "",
        dienstverbanden: "",
        email: user.email || "",
        competenties: "",
        linkedinUrl: user.linkedinUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Open LinkedIn link in new tab if not empty
  const handleLinkedinClick = () => {
    if (profile.linkedinUrl) {
      // add https:// if not included to prevent broken links
      const url = profile.linkedinUrl.startsWith("http")
        ? profile.linkedinUrl
        : `https://${profile.linkedinUrl}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="profiel-container">
      <div className="sidebar">
        <div className="profile-icon">icoon</div>
        <div className="gebruikersnaam">{profile.naam}</div>

        {editMode ? (
          <input
            type="text"
            name="linkedinUrl"
            value={profile.linkedinUrl}
            onChange={handleChange}
            placeholder="Voer je LinkedIn URL in"
            className="linkedin-input"
          />
        ) : (
          <button
            className="linkedin-btn"
            onClick={handleLinkedinClick}
            disabled={!profile.linkedinUrl}
            title={profile.linkedinUrl ? "Open LinkedIn profiel" : "Geen LinkedIn URL ingesteld"}
          >
            IN LinkedIn
          </button>
        )}
      </div>

      <div className="content">
        <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
          wijzigingen
        </button>

        <div className="info-box">
          <div>
            <strong>Naam:</strong>{" "}
            {editMode ? (
              <input name="naam" value={profile.naam} onChange={handleChange} />
            ) : (
              profile.naam
            )}
          </div>
          <div>
            <strong>Studierichting:</strong>{" "}
            {editMode ? (
              <input
                name="studierichting"
                value={profile.studierichting}
                onChange={handleChange}
              />
            ) : (
              profile.studierichting
            )}
          </div>
          <div>
            <strong>Dienstverbanden:</strong>{" "}
            {editMode ? (
              <input
                name="dienstverbanden"
                value={profile.dienstverbanden}
                onChange={handleChange}
              />
            ) : (
              profile.dienstverbanden
            )}
          </div>
          <div>
            <strong>E-mailadres:</strong>{" "}
            {editMode ? (
              <input name="email" value={profile.email} onChange={handleChange} />
            ) : (
              profile.email
            )}
          </div>
          <div>
            <strong>Competenties:</strong>{" "}
            {editMode ? (
              <input
                name="competenties"
                value={profile.competenties}
                onChange={handleChange}
              />
            ) : (
              profile.competenties
            )}
          </div>
          <div>
            <strong>Wachtwoord wijzigen:</strong>
          </div>
        </div>

        <button
          className="logout-btn"
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
