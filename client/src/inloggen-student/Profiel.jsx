import React from "react";
import "./Profiel.css";

export default function Profiel() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="profiel-page">
      <main className="profiel-main">
        <h1>Mijn Profiel</h1>
        <p><b>Naam:</b> {user?.voornaam} {user?.naam}</p>
        <p><b>Gebruikersnaam:</b> {user?.gebruikersnaam}</p>
        <p><b>E-mail:</b> {user?.email}</p>
        <p><b>Opleiding:</b> {user?.opleiding}</p>
        <p><b>Opleiding jaar:</b> {user?.opleiding_jaar}</p>
        <button
          className="logout-btn"
          style={{
            marginTop: "2rem",
            background: "#fee2e2",
            color: "#dc2626",
            border: "none",
            borderRadius: "0.7rem",
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Uitloggen
        </button>
      </main>
    </div>
  );
} 