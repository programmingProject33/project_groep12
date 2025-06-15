import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

export default function Contact() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">
      <main className="contact-main">
        <h1>Contact</h1>
        <p>Heb je vragen? Neem gerust contact op met het Careerlaunch team!</p>
        <div className="contact-info">
          <p><b>Email:</b> support-careerlaunch@ehb.be</p>
          <p><b>Telefoon:</b> +32 494 77 08 550</p>
          <p><b>Adres:</b> Nijverheidskaai 170, 1070 Anderlecht</p>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Naam:
            <input type="text" required />
          </label>
          <label>
            E-mail:
            <input type="email" required />
          </label>
          <label>
            Bericht:
            <textarea rows={4} required />
          </label>
          <button type="submit">Verzenden</button>
          {sent && (
            <div style={{ color: "green", marginTop: "1rem", fontWeight: 600 }}>
              Je bericht werd goed verstuurd!
            </div>
          )}
        </form>
      </main>
    </div>
  );
} 