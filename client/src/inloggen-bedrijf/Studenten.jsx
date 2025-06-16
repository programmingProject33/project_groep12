import React, { useState, useEffect } from "react";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import "./Studenten.css";
import { FaLinkedin } from "react-icons/fa";

export default function Studenten() {
  const [studenten, setStudenten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpleiding, setFilterOpleiding] = useState("alle");
  const [filterDienstverband, setFilterDienstverband] = useState("alle");
  const [sortField, setSortField] = useState("naam");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");

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

  const fetchStudent = async (studentId) => {
    setStudentLoading(true);
    setStudentError("");
    try {
      const response = await fetch(`/api/studenten/${studentId}`);
      if (!response.ok) {
        throw new Error("Student niet gevonden");
      }
      const data = await response.json();
      setSelectedStudent(data);
    } catch (err) {
      setStudentError(err.message);
    } finally {
      setStudentLoading(false);
    }
  };

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

  // Sorteerfunctie
  const sortedStudenten = [...filteredStudenten].sort((a, b) => {
    if (sortField === "naam") {
      if (sortOrder === "asc") return a.naam.localeCompare(b.naam);
      else return b.naam.localeCompare(a.naam);
    } else if (sortField === "tijdstip") {
      // Sorteer op tijdstip (ervan uitgaande dat er een tijdstip veld is, anders overslaan)
      if (!a.tijdstip || !b.tijdstip) return 0;
      if (sortOrder === "asc") return a.tijdstip.localeCompare(b.tijdstip);
      else return b.tijdstip.localeCompare(a.tijdstip);
    }
    return 0;
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

  function formatTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

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
              placeholder="Zoek op naam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="studenten-search"
            />
          </div>
          <div className="filter-container">
            <label>Sorteer op: </label>
            <select value={sortField} onChange={e => setSortField(e.target.value)}>
              <option value="naam">Naam</option>
              <option value="tijdstip">Tijdstip</option>
            </select>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option value="asc">Oplopend (A-Z / Vroegste)</option>
              <option value="desc">Aflopend (Z-A / Laatste)</option>
            </select>
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
                <th>Dienstverbanden</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudenten.map(student => (
                <tr key={student.id}>
                  <td>{student.naam}</td>
                  <td>{student.opleiding}</td>
                  <td>{
                    (() => {
                      if (!student.dienstverbanden) return <span style={{color:'#aaa'}}>Niet opgegeven</span>;
                      if (Array.isArray(student.dienstverbanden)) return student.dienstverbanden.join(', ');
                      try {
                        const arr = JSON.parse(student.dienstverbanden);
                        if (Array.isArray(arr)) return arr.map(d => d.trim()).join(', ');
                        return String(student.dienstverbanden).replace(/\[|\]|"/g, '');
                      } catch {
                        return String(student.dienstverbanden).replace(/\[|\]|"/g, '').split(',').map(d => d.trim()).filter(Boolean).join(', ');
                      }
                    })()
                  }</td>
                  <td>
                    <button 
                      className="studenten-action-btn"
                      onClick={() => fetchStudent(student.id)}
                    >
                      Bekijk Profiel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedStudent && (
          <div className="student-detail-modal">
            <div className="student-detail-content">
              <button className="close-modal-btn" onClick={() => setSelectedStudent(null)}>Sluiten</button>
              {studentLoading ? (
                <div>Laden...</div>
              ) : studentError ? (
                <div style={{color: 'red'}}>{studentError}</div>
              ) : (
                <>
                  <h2>{selectedStudent.voornaam} {selectedStudent.naam}</h2>
                  <p><strong>Gebruikersnaam:</strong> {selectedStudent.gebruikersnaam}</p>
                  <p><strong>E-mail:</strong> {selectedStudent.email}</p>
                  <p><strong>Opleiding:</strong> {selectedStudent.opleiding}</p>
                  <p><strong>Opleiding jaar:</strong> {selectedStudent.opleiding_jaar}</p>
                  <p><strong>LinkedIn:</strong> {selectedStudent.linkedin && selectedStudent.linkedin.startsWith("https://www.linkedin.com/") ? (
                    <a href={selectedStudent.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin style={{ color: '#0a66c2', fontSize: '1.3em' }} /></a>
                  ) : (
                    <span style={{ color: '#aaa', fontStyle: 'italic' }}>Geen profiel beschikbaar</span>
                  )}</p>
                  <div style={{marginTop: '1.2rem'}}>
                    <strong>Dienstverbanden:</strong>
                    <ul style={{marginTop: '0.5rem'}}>
                      {(() => {
                        if (!selectedStudent.dienstverbanden) return <li style={{color:'#aaa'}}>Niet opgegeven</li>;
                        let arr = selectedStudent.dienstverbanden;
                        if (typeof arr === 'string') {
                          try {
                            arr = JSON.parse(arr);
                          } catch {
                            arr = arr.replace(/\[|\]|"/g, '').split(',').map(d => d.trim()).filter(Boolean);
                          }
                        }
                        if (!Array.isArray(arr)) arr = [String(arr)];
                        return arr.map((d, i) => <li key={i}>{d.trim()}</li>);
                      })()}
                    </ul>
                  </div>
                </>
              )}
            </div>
            <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}></div>
          </div>
        )}

        {sortedStudenten.length === 0 && (
          <div className="studenten-empty">
            Geen studenten gevonden die voldoen aan de zoekcriteria.
          </div>
        )}
      </main>
      <BedrijfFooter />
    </div>
  );
} 