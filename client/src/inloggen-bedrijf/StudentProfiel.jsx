import React, { useState, useEffect } from "react";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import { useParams, useNavigate } from "react-router-dom";
import "./StudentProfiel.css";

export default function StudentProfiel() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/studenten/${studentId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Student niet gevonden");
          }
          throw new Error("Er is iets misgegaan bij het ophalen van het studentenprofiel");
        }
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div>
        <BedrijfNavbar />
        <main className="studentprofiel-main">
          <div className="studentprofiel-loading">Laden...</div>
        </main>
        <BedrijfFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <BedrijfNavbar />
        <main className="studentprofiel-main">
          <div className="studentprofiel-error">{error}</div>
          <button 
            className="studentprofiel-back-btn"
            onClick={() => navigate('/bedrijf/studenten')}
          >
            Terug naar studentenlijst
          </button>
        </main>
        <BedrijfFooter />
      </div>
    );
  }

  if (!student) {
    return (
      <div>
        <BedrijfNavbar />
        <main className="studentprofiel-main">
          <div className="studentprofiel-error">Student niet gevonden</div>
          <button 
            className="studentprofiel-back-btn"
            onClick={() => navigate('/bedrijf/studenten')}
          >
            Terug naar studentenlijst
          </button>
        </main>
        <BedrijfFooter />
      </div>
    );
  }

  return (
    <div>
      <BedrijfNavbar />
      <main className="studentprofiel-main">
        <h1>Studentenprofiel</h1>
        <div className="studentprofiel-content">
          <div className="studentprofiel-section">
            <h2>Persoonlijke informatie</h2>
            <div className="studentprofiel-info">
              <p><strong>Naam:</strong> {student.voornaam} {student.naam}</p>
              <p><strong>Gebruikersnaam:</strong> {student.gebruikersnaam}</p>
              <p><strong>E-mail:</strong> {student.email}</p>
            </div>
          </div>

          <div className="studentprofiel-section">
            <h2>Opleiding</h2>
            <div className="studentprofiel-info">
              <p><strong>Opleiding:</strong> {student.opleiding}</p>
              <p><strong>Opleiding jaar:</strong> {student.opleiding_jaar}</p>
            </div>
          </div>

          <div className="studentprofiel-section">
            <h2>Dienstverbanden</h2>
            <div className="studentprofiel-info">
              <p><strong>Gewenste dienstverbanden:</strong></p>
              <ul>
                {student.dienstverbanden ? (
                  student.dienstverbanden.split(',').map((dienstverband, index) => (
                    <li key={index}><span dangerouslySetInnerHTML={{__html: "&#128188;"}} /> {dienstverband.trim()}</li>
                  ))
                ) : (
                  <li><span dangerouslySetInnerHTML={{__html: "&#10067;"}} /> Geen dienstverbanden opgegeven</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <button 
          className="studentprofiel-back-btn"
          onClick={() => navigate('/bedrijf/studenten')}
        >
          Terug naar studentenlijst
        </button>
      </main>
      <BedrijfFooter />
    </div>
  );
} 