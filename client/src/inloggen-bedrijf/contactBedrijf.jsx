import React, { useState } from "react";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import "./contactBedrijf.css";

export default function ContactBedrijf() {
  const [form, setForm] = useState({ naam: "", email: "", onderwerp: "", bericht: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    setLoading(false);
  };

  return (
    <div>
      <BedrijfNavbar />
      <div className="contactbedrijf-container">
        <h1 className="contactbedrijf-title">Contact Us</h1>
        <p className="contactbedrijf-subtitle">We helpen je graag! Neem contact met ons op als je vragen of opmerkingen hebt.</p>
        <div className="contactbedrijf-info-table">
          <div className="contactbedrijf-info-row">
            <span className="contactbedrijf-info-label">Email</span>
            <span className="contactbedrijf-info-value">support-careerlaunch@ehb.be</span>
          </div>
          <div className="contactbedrijf-info-row">
            <span className="contactbedrijf-info-label">Telefoonnummer</span>
            <span className="contactbedrijf-info-value">+32 494 77 08 550</span>
          </div>
          <div className="contactbedrijf-info-row">
            <span className="contactbedrijf-info-label">Adres</span>
            <span className="contactbedrijf-info-value">Nijverheidskaai 170, 1070 Anderlecht.</span>
          </div>
        </div>
        <hr className="contactbedrijf-divider" />
        <h2 className="contactbedrijf-form-title">Send us a Message</h2>
        <form className="contactbedrijf-form" onSubmit={handleSubmit}>
          <label>
            Voornaam + Achternaam
            <input type="text" name="naam" value={form.naam} onChange={handleChange} placeholder="Enter your name" required />
          </label>
          <label>
            E-mail
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
          </label>
          <label>
            Onderwerp
            <input type="text" name="onderwerp" value={form.onderwerp} onChange={handleChange} placeholder="Enter the subject" required />
          </label>
          <label>
            Message
            <textarea name="bericht" value={form.bericht} onChange={handleChange} placeholder="Enter your message" required />
          </label>
          <button type="submit" className="contactbedrijf-btn" disabled={loading}>{loading ? "Verzenden..." : "Verzenden"}</button>
          {success && <div className="contactbedrijf-success">{success}</div>}
          {error && <div className="contactbedrijf-error">{error}</div>}
        </form>
      </div>
      <BedrijfFooter />
    </div>
  );
} 