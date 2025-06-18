import React, { useState, useEffect } from "react";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import "./Studenten.css";
import { FaLinkedin } from "react-icons/fa";
import { useAuth } from "../AuthContext.jsx";

export default function Studenten() {
  const { user, isAuthLoading } = useAuth();
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

  const OPLEIDINGEN = [
    "Multimedia & Creatieve Technologie (bachelor)",
    "Toegepaste Informatica (bachelor)",
    "Graduaat Elektromechanische Systemen",
    "Graduaat Programmeren",
    "Graduaat Systeem- en Netwerkbeheer",
    "Postgraduaat Coding (online)",
    "Postgraduaat Toegepaste Artificial Intelligence"
  ];
  const DIENSTVERBANDEN = [
    "Voltijds",
    "Deeltijds",
    "Freelance",
    "Stage"
  ];

  if (isAuthLoading) return null;

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

  const normalizeDienstverband = (val) => {
    if (!val) return [];
    let arr = val;
    if (typeof arr === 'string') {
      try {
        arr = JSON.parse(arr);
      } catch {
        arr = arr.replace(/\\/g, '').replace(/\[|\]|"/g, '').split(',').map(d => d.trim()).filter(Boolean);
      }
    }
    if (!Array.isArray(arr)) arr = [String(arr)];
    const norm = arr.map(d => d.replace(/\\/g, '').replace(/"/g, '').trim().toLowerCase());
    return norm;
  };

  const filteredStudenten = studenten.filter(student => {
    const dienstverbandRaw = student.dienstverbanden || student.dienstverband || '';
    const dienstverbandArr = normalizeDienstverband(dienstverbandRaw);
    console.log('Student:', student.naam, '| Origineel:', dienstverbandRaw, '| Genormaliseerd:', dienstverbandArr);
    const filterDienstverbandNorm = filterDienstverband.toLowerCase();

    const matchesSearch = 
      student.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.opleiding.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOpleiding = 
      filterOpleiding === "alle" || 
      student.opleiding.toLowerCase() === filterOpleiding.toLowerCase();

    const matchesDienstverband =
      filterDienstverbandNorm === "alle" ||
      dienstverbandArr.includes(filterDienstverbandNorm);

    return matchesSearch && matchesOpleiding && matchesDienstverband;
  });

  // Sorteerfunctie
  const sortedStudenten = [...filteredStudenten].sort((a, b) => {
    if (sortField === "naam") {
      if (sortOrder === "asc") return a.naam.localeCompare(b.naam);
      else return b.naam.localeCompare(a.naam);
    } else if (sortField === "opleiding") {
      if (sortOrder === "asc") return (a.opleiding || "").localeCompare(b.opleiding || "");
      else return (b.opleiding || "").localeCompare(a.opleiding || "");
    } else if (sortField === "dienstverbanden") {
      // Sorteer op eerste dienstverband alfabetisch
      const aDienst = (Array.isArray(a.dienstverbanden) ? a.dienstverbanden[0] : (a.dienstverbanden || "")).toLowerCase();
      const bDienst = (Array.isArray(b.dienstverbanden) ? b.dienstverbanden[0] : (b.dienstverbanden || "")).toLowerCase();
      if (sortOrder === "asc") return aDienst.localeCompare(bDienst);
      else return bDienst.localeCompare(aDienst);
    } else if (sortField === "tijdstip") {
      if (!a.tijdstip || !b.tijdstip) return 0;
      if (sortOrder === "asc") return a.tijdstip.localeCompare(b.tijdstip);
      else return b.tijdstip.localeCompare(a.tijdstip);
    }
    return 0;
  });

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
            <select
              value={filterOpleiding}
              onChange={(e) => setFilterOpleiding(e.target.value)}
              className="studenten-filter"
            >
              <option value="alle">Alle opleidingen</option>
              {OPLEIDINGEN.map(opleiding => (
                <option key={opleiding} value={opleiding}>{opleiding}</option>
              ))}
            </select>
          </div>
          <div className="filter-container">
            <select
              value={filterDienstverband}
              onChange={(e) => setFilterDienstverband(e.target.value)}
              className="studenten-filter"
            >
              <option value="alle">Alle dienstverbanden</option>
              {DIENSTVERBANDEN.map(dienst => (
                <option key={dienst} value={dienst}>{dienst}</option>
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
                <tr key={student.gebruiker_id}>
                  <td>{student.naam}</td>
                  <td>{student.opleiding}</td>
                  <td>{
                    (() => {
                      const dienstverbandRaw = student.dienstverbanden || student.dienstverband || '';
                      const arr = normalizeDienstverband(dienstverbandRaw);
                      return arr.length ? arr.map((d, i) => <span key={d.trim() + i}>{d.trim()}{i < arr.length - 1 ? ', ' : ''}</span>) : <span style={{color:'#aaa'}}>Niet opgegeven</span>;
                    })()
                  }</td>
                  <td>
                    <button 
                      className="studenten-action-btn"
                      onClick={() => fetchStudent(student.gebruiker_id)}
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
          <div className="student-detail-modal" style={{zIndex: 2000}}>
            <div className="student-detail-content" style={{boxShadow: '0 8px 32px rgba(37,99,235,0.18)', border: '2.5px solid #2563eb', minWidth: 340, maxWidth: 420, background: '#f8fafc'}}>
              <button className="close-modal-btn" onClick={() => setSelectedStudent(null)}>Sluiten</button>
              <h2 style={{textAlign:'center', color:'#2563eb', marginBottom: '1.2rem'}}>Studentenprofiel</h2>
              {studentLoading ? (
                <div>Laden...</div>
              ) : studentError ? (
                <div style={{color: 'red'}}>{studentError}</div>
              ) : (
                <>
                  <p><strong>Naam:</strong> {selectedStudent.voornaam} {selectedStudent.naam}</p>
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
                        return arr.map((d, i) => <li key={d.trim() + i}>{d.trim()}</li>);
                      })()}
                    </ul>
                  </div>
                </>
              )}
            </div>
            <div className="modal-backdrop" style={{background:'rgba(30,41,59,0.32)', zIndex: 1999}} onClick={() => setSelectedStudent(null)}></div>
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