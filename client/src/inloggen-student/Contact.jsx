import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

export default function Contact() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

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
        <form className="contact-form">
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
        </form>
      </main>
    </div>
  );
} 