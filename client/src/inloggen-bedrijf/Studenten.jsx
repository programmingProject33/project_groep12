import React, { useState, useEffect } from "react";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import "./Studenten.css";

export default function Studenten() {
  const [studenten, setStudenten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpleiding, setFilterOpleiding] = useState("alle");
  const [filterDienstverband, setFilterDienstverband] = useState("alle");

  useEffect(() => {
    const fetchStudenten = async () => {
      try {
        const response = await fetch("/api/studenten");
        if (!response.ok) {
          throw new Error("Er is iets misgegaan bij het ophalen van de studenten");
        }
        const data = await response.json();
        setStudenten(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudenten();
  }, []);

  const filteredStudenten = studenten.filter(student => {
    const matchesSearch = 
      student.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.opleiding.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOpleiding = 
      filterOpleiding === "alle" || 
      student.opleiding.toLowerCase() === filterOpleiding.toLowerCase();

    const matchesDienstverband =
      filterDienstverband === "alle" ||
      (student.dienstverband && student.dienstverband.toLowerCase() === filterDienstverband.toLowerCase());

    return matchesSearch && matchesOpleiding && matchesDienstverband;
  });

  const opleidingen = ["alle", "Toegepaste Informatica", "Multimedia & Creative Technologies", "Programmeren", "Systeem- en Netwerkbeheer", "Internet of Things"];
  const dienstverbanden = [
    "alle",
    "Stage",
    "Studentenjob",
    "Volle werk",
    "Voltijds",
    "Deeltijds"
  ];

  if (loading) {
    return (
      <div>
        <BedrijfNavbar />
        <main className="studenten-main">
          <div className="studenten-loading">Laden...</div>
        </main>
        <BedrijfFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <BedrijfNavbar />
        <main className="studenten-main">
          <div className="studenten-error">{error}</div>
        </main>
        <BedrijfFooter />
      </div>
    );
  }

  return (
    <div>
      <BedrijfNavbar />
      <main className="studenten-main">
        <h1>Studenten</h1>
        <p className="studenten-intro">Bekijk hier alle studenten die zich hebben aangemeld voor het Career Launch evenement.</p>
        
        <div className="studenten-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Zoek op naam of opleiding..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="studenten-search"
            />
          </div>
          
          <div className="filter-container">
            <select
              value={filterOpleiding}
              onChange={(e) => setFilterOpleiding(e.target.value)}
              className="studenten-filter"
            >
              {opleidingen.map(opleiding => (
                <option key={opleiding} value={opleiding}>
                  {opleiding === "alle" ? "Alle opleidingen" : opleiding}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-container">
            <select
              value={filterDienstverband}
              onChange={(e) => setFilterDienstverband(e.target.value)}
              className="studenten-filter"
            >
              {dienstverbanden.map(dienstverband => (
                <option key={dienstverband} value={dienstverband}>
                  {dienstverband === "alle" ? "Alle dienstverbanden" : dienstverband}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="studenten-table-container">
          <table className="studenten-table">
            <thead>
              <tr>
                <th>Naam</th>
                <th>Opleiding</th>
                <th>Email</th>
                <th>Dienstverband</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudenten.map(student => (
                <tr key={student.id}>
                  <td>{student.naam}</td>
                  <td>{student.opleiding}</td>
                  <td>{student.email}</td>
                  <td>{student.dienstverbanden || '-'}</td>
                  <td>
                    <button 
                      className="studenten-action-btn"
                      onClick={() => window.location.href = `/bedrijf/student/${student.id}`}
                    >
                      Bekijk Profiel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudenten.length === 0 && (
          <div className="studenten-empty">
            Geen studenten gevonden die voldoen aan de zoekcriteria.
          </div>
        )}
      </main>
      <BedrijfFooter />
    </div>
  );
} 