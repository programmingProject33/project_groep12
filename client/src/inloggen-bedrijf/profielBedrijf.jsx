import React, { useState } from "react";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import "./profielBedrijf.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Profiel() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  console.log("user in profiel:", user); // Debug: toon het user-object in de browserconsole
  const [form, setForm] = useState({
    naam: user?.naam || "",
    email: user?.email || "",
    gebruikersnaam: user?.gebruikersnaam || "",
    beschrijving: user?.beschrijving || "",
    bedrijf_URL: user?.bedrijf_URL || ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
    setSuccess("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/bedrijf/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: user.bedrijf_id })
      });
      if (res.ok) {
        setSuccess("Profiel succesvol bijgewerkt.");
        setEditing(false);
        setUser({ ...user, ...form });
      } else {
        setError("Er is iets misgegaan bij het opslaan.");
      }
    } catch (err) {
      setError("Er is iets misgegaan bij het opslaan.");
    }
  };

  return (
    <div>
      <BedrijfNavbar />
      <main className="profielbedrijf-main">
        <h1>Profiel</h1>
        <p>Hier kun je de bedrijfsgegevens en contactinformatie bekijken of aanpassen.</p>
        {success && <div className="profielbedrijf-success">{success}</div>}
        {error && <div className="profielbedrijf-error">{error}</div>}
        {editing ? (
          <form className="profielbedrijf-form" onSubmit={handleSave}>
            <label>
              Bedrijfsnaam
              <input type="text" name="naam" value={form.naam} onChange={handleChange} />
            </label>
            <label>
              E-mail
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </label>
            <label>
              Gebruikersnaam
              <input type="text" name="gebruikersnaam" value={form.gebruikersnaam} onChange={handleChange} />
            </label>
            <label>
              Beschrijving
              <textarea name="beschrijving" value={form.beschrijving} onChange={handleChange} />
            </label>
            <label>
              Website
              <input type="text" name="bedrijf_URL" value={form.bedrijf_URL} onChange={handleChange} />
            </label>
            <button type="submit" className="profielbedrijf-save-btn">Opslaan</button>
          </form>
        ) : (
          <>
            <form className="profielbedrijf-form" onSubmit={e => e.preventDefault()}>
              <label>
                Bedrijfsnaam
                <input type="text" name="naam" value={form.naam} disabled />
              </label>
              <label>
                E-mail
                <input type="email" name="email" value={form.email} disabled />
              </label>
              <label>
                Gebruikersnaam
                <input type="text" name="gebruikersnaam" value={form.gebruikersnaam} disabled />
              </label>
              <label>
                Beschrijving
                <textarea name="beschrijving" value={form.beschrijving} disabled />
              </label>
              <label>
                Website
                <input type="text" name="bedrijf_URL" value={form.bedrijf_URL} disabled />
              </label>
            </form>
            <button type="button" className="profielbedrijf-edit-btn" onClick={handleEdit}>Bewerken</button>
          </>
        )}
        <button
          onClick={handleLogout}
          className="profielbedrijf-logout-btn"
        >
          Uitloggen
        </button>
      </main>
      <BedrijfFooter />
    </div>
  );
} 