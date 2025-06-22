import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./contactNavbalk.css";
import { FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa6";
import emailjs from "emailjs-com";

export default function Contact() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("admin_groep12", "admin_12", formRef.current, "hR1SrVH5iBfyJtEzM")
      .then(
        (result) => {
          console.log("Email successfully sent!", result.text);
          setSent(true);
        },
        (error) => {
          console.error("Email send error:", error.text);
          setSent(false);
        }
      );
  };

  return (
    <div>
      {/* body van contact */}
      <main className="contact-container">
        <h1>Contact Us</h1>
        <p className="subtitle">
          We helpen je graag! Neem contact met ons op als je vragen of opmerkingen hebt.
        </p>

        <section className="contact-info">
          <h2>Contact Informaties</h2>
          <div className="contact-table">
            <div>
              <span>Email</span>
              <span>support-careerlaunch@ehb.be</span>
            </div>
            <div>
              <span>Telefoonnummer</span>
              <span>+32 494 77 08 550</span>
            </div>
            <div>
              <span>Adres</span>
              <span>Nijverheidskaai 170, 1070 Anderlecht.</span>
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <h2>Send us a Message</h2>
          <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
            <label>
              Voornaam + Achternaam
              <input name="user_name" type="text" placeholder="Enter your name" required />
            </label>
            <label>
              E-mail
              <input name="user_email" type="email" placeholder="Enter your email" required />
            </label>
            <label>
              Onderwerp
              <input name="subject" type="text" placeholder="Enter the subject" required />
            </label>
            <label>
              Message
              <textarea name="message" placeholder="Enter your message" rows={5} required />
            </label>
            <button type="submit" className="contact-btn">
              Verzenden
            </button>
            {sent && (
              <div style={{ color: "green", marginTop: "1rem", fontWeight: 600 }}>
                Je bericht werd goed verstuurd!
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}
