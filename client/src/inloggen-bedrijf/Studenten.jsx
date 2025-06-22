import React, { useState, useEffect } from "react";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import "./Studenten.css";
import { FaLinkedin, FaEye, FaSearch } from "react-icons/fa";
import { useAuth } from "../AuthContext.jsx";

export default function Studenten() {
  const { user, isAuthLoading } = useAuth();
  const [studenten, setStudenten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpleiding, setFilterOpleiding] = useState("alle");
  const [selectedDienstverbanden, setSelectedDienstverbanden] = useState([]);
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
    "Stage",
    "Voltijds",
    "Deeltijds",
    "Bijbaan",
    "Freelance",
    "Geen voorkeuren"
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

  const toggleDienstverband = (type) => {
    setSelectedDienstverbanden((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const filteredStudenten = studenten.filter(student => {
    const dienstverbandRaw = student.dienstverbanden || student.dienstverband || '';
    const dienstverbandArr = normalizeDienstverband(dienstverbandRaw);
    const fullName = `${student.voornaam || ''} ${student.naam || ''}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      student.opleiding.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOpleiding =
      filterOpleiding === '' || filterOpleiding === 'alle' || student.opleiding.toLowerCase() === filterOpleiding.toLowerCase();
    const matchesDienstverband =
      selectedDienstverbanden.length === 0 ||
      dienstverbandArr.some(d => selectedDienstverbanden.map(f => f.toLowerCase()).includes(d));
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

  const dienstverbandBadge = (type) => {
    const map = {
      stage: "bg-blue-100 text-blue-800",
      voltijds: "bg-gray-100 text-gray-800",
      deeltijds: "bg-gray-100 text-gray-800",
      bijbaan: "bg-gray-100 text-gray-800",
      freelance: "bg-gray-100 text-gray-800",
      "geen voorkeuren": "bg-gray-100 text-gray-800"
    };
    return map[type?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

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
    <div style={{ background: '#f3f4f6', minHeight: '100vh', paddingBottom: '2rem', position: 'relative' }}>
      <BedrijfNavbar />
      <main className="studenten-main-content" style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 1rem 0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 0 }}>Studentenprofielen</h1>
          <p style={{ color: '#64748b', marginBottom: '2rem', marginTop: '0.7rem' }}>Bekijk studentenprofielen en kom in contact met potentiële kandidaten voor uw team.</p>
        </div>
        {/* Filterbox */}
        <div className="filterbox">
          <div className="filterbox-row">
            <input
              type="text"
              placeholder="Zoek op voornaam of achternaam"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              value={filterOpleiding}
              onChange={e => setFilterOpleiding(e.target.value)}
            >
              <option value="">Selecteer opleiding</option>
              {OPLEIDINGEN.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="pillbar">
            {DIENSTVERBANDEN.map(type => (
              <button
                key={type}
                type="button"
                className={`pill${selectedDienstverbanden.includes(type) ? ' active' : ''}`}
                onClick={() => toggleDienstverband(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        {/* Studentenlijst */}
        <div className="studenten-kaarten-container">
          {sortedStudenten.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem 0', width: '100%' }}>Geen studenten gevonden.</div>
          )}
          {sortedStudenten.map(student => {
            const dienstverbandRaw = student.dienstverbanden || student.dienstverband || '';
            const arr = normalizeDienstverband(dienstverbandRaw);
            return (
              <div key={student.gebruiker_id} className="studenten-kaart">
                {arr.length ? (
                  <span className="dienstverband-badge"><strong>Dienstverband:</strong> {arr[0]}</span>
                ) : null}
                <div className="student-naam"><strong>Naam:</strong> {student.voornaam} {student.naam}</div>
                <div className="student-opleiding"><strong>Opleiding:</strong> {student.opleiding}</div>
                <button
                  className="studenten-action-btn"
                  onClick={() => fetchStudent(student.gebruiker_id)}
                >
                  Bekijk profiel
                </button>
              </div>
            );
          })}
        </div>
        {/* Modal voor studentprofiel */}
        {selectedStudent && (
          <div className="student-detail-modal">
            <div className="student-detail-content">
              <button className="close-modal-btn" onClick={() => setSelectedStudent(null)} style={{position:'absolute',top:18,right:18,fontSize:'1.2rem',background:'none',border:'none',cursor:'pointer'}}>×</button>
              {studentLoading ? (
                <div>Laden...</div>
              ) : studentError ? (
                <div>{studentError}</div>
              ) : (
                <>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>
                    {selectedStudent.voornaam} {selectedStudent.naam}
                  </h2>
                  <div className="student-detail-grid">
                    <p><strong>Email:</strong> {selectedStudent.email}</p>
                    <p><strong>Opleiding:</strong> {selectedStudent.opleiding}</p>
                    <p><strong>Jaar:</strong> {selectedStudent.opleiding_jaar}</p>
                    <p><strong>Dienstverband:</strong> {
                      (normalizeDienstverband(selectedStudent.dienstverbanden || selectedStudent.dienstverband || '')).join(', ') || 'N.v.t.'
                    }</p>
                  </div>
                  {selectedStudent.linkedin && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                      <a
                        href={selectedStudent.linkedin.startsWith('http') ? selectedStudent.linkedin : `https://${selectedStudent.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="linkedin-profiel-btn"
                      >
                        <FaLinkedin style={{ marginRight: '8px' }} />
                        Bekijk LinkedIn Profiel
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <BedrijfFooter />
    </div>
  );
} 