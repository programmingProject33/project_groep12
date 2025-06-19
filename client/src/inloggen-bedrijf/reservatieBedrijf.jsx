import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import "./reservatieBedrijf.css";
import "./Studenten.css";
import { FaLinkedin } from "react-icons/fa";

function mapKlasToAula(val) {
  if (!val) return val;
  const match = String(val).match(/^klas\s?(\d)$/i);
  if (match) {
    return `aula ${match[1]}`;
  }
  return val;
}

export default function Reservaties() {
  const { user, isAuthLoading } = useAuth();
  const [reservaties, setReservaties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");

  if (isAuthLoading) return null;

  useEffect(() => {
    const fetchReservaties = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bedrijf/reservaties/${user.bedrijf_id}`);
        if (!response.ok) {
          throw new Error('Fout bij het ophalen van de reservaties');
        }
        const data = await response.json();
        console.log('API reservaties response:', data);
        setReservaties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.bedrijf_id) {
      fetchReservaties();
    }
  }, [user]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-BE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div>
      <BedrijfNavbar />
      <main className="reservatiebedrijf-main">
        <h1>Reservaties</h1>
        
        {loading ? (
          <p>Reservaties laden...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            {reservaties.length === 0 ? (
              <p>Geen reservaties gevonden</p>
            ) : (
              <div className="reservaties-table-container">
                <table className="reservaties-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Datum</th>
                      <th>Tijdstip</th>
                      <th>LinkedIn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservaties.map((reservatie) => (
                      <tr key={reservatie.speed_id}>
                        <td>{`${reservatie.voornaam} ${reservatie.naam}`}</td>
                        <td>{formatDate(reservatie.starttijd)}</td>
                        <td>{formatTime(reservatie.starttijd)}</td>
                        <td>
                          {reservatie.linkedin && reservatie.linkedin.startsWith("https://www.linkedin.com/") ? (
                            <a href={reservatie.linkedin} target="_blank" rel="noopener noreferrer" title="Bekijk LinkedIn-profiel">
                              LinkedIn
                            </a>
                          ) : (
                            <span style={{ color: '#aaa', fontStyle: 'italic' }}>Geen profiel beschikbaar</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

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
      </main>
      <BedrijfFooter />
    </div>
  );
} 