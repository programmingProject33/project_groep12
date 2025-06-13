import React, { useState, useEffect } from "react";
import "./Profiel.css";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  FaLinkedin,
  FaInstagram,
  FaXTwitter,
  FaTiktok
} from "react-icons/fa6";

const Profiel = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

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
        naam:
          user.voornaam && user.naam
            ? `${user.voornaam} ${user.naam}`
            : user.naam || user.voornaam || "",
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

  const handleLinkedinClick = () => {
    if (profile.linkedinUrl) {
      const url = profile.linkedinUrl.startsWith("http")
        ? profile.linkedinUrl
        : `https://${profile.linkedinUrl}`;
      window.open(url, "_blank");
    }
  };

  return (
    <>
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
              title={
                profile.linkedinUrl
                  ? "Open LinkedIn profiel"
                  : "Geen LinkedIn URL ingesteld"
              }
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

      {/* Footer */}
      <footer className="footer">
        <div className="footer-row">
          <div className="footer-col left">
            <div className="footer-logo-box"></div>
            <div className="footer-mail">
              E-mailadres: support-careerlaunch@ehb.be
              <br />
              Telefoonnummer: +32 494 77 08 550
            </div>
          </div>
          <div className="footer-col middle">
            <ul className="footer-menu">
              <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                Home
              </li>
              <li onClick={() => navigate("/bedrijven")} style={{ cursor: "pointer" }}>
                Bedrijven
              </li>
              <li onClick={() => navigate("/Reservaties")} style={{ cursor: "pointer" }}>
                Reservaties
              </li>
              <li onClick={() => navigate("/contact")} style={{ cursor: "pointer" }}>
                Contact
              </li>
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
    </>
  );
};

export default Profiel;
