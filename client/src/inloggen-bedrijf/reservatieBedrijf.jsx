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
  const [actionLoading, setActionLoading] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showAlternativeModal, setShowAlternativeModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  if (isAuthLoading) return null;

  useEffect(() => {
    console.log('User object in Reservaties component:', user);
    console.log('User bedrijf_id:', user?.bedrijf_id);
    
    const fetchReservaties = async () => {
      try {
        const response = await fetch(`/api/bedrijf/reservaties/${user.bedrijf_id}`);
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

    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch(`/api/speeddates/${user.bedrijf_id}`);
        if (response.ok) {
          const data = await response.json();
          
          // Haal alle reserveringen op voor dit bedrijf om te bepalen welke tijdsloten echt bezet zijn
          const reservationsResponse = await fetch(`/api/bedrijf/reservaties/${user.bedrijf_id}`);
          const reservations = await reservationsResponse.ok ? await reservationsResponse.json() : [];
          
          // Filter alleen beschikbare tijdsloten (niet bezet door geaccepteerde reserveringen)
          const available = data.filter(slot => {
            // Check of er een geaccepteerde reservering is voor dit tijdslot
            const hasAcceptedReservation = reservations.some(reservation => 
              reservation.speed_id === slot.speed_id && reservation.status === 'accepted'
            );
            return !hasAcceptedReservation;
          });
          
          setAvailableSlots(available);
        }
      } catch (err) {
        console.error('Error fetching available slots:', err);
      }
    };

    if (user?.bedrijf_id) {
      fetchReservaties();
      fetchAvailableSlots();
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Wacht op bevestiging', color: '#f59e0b', bgColor: '#fef3c7' },
      accepted: { text: 'Bevestigd', color: '#059669', bgColor: '#d1fae5' },
      rejected: { text: 'Afgewezen', color: '#dc2626', bgColor: '#fee2e2' },
      alternative: { text: 'Alternatief voorstel', color: '#7c3aed', bgColor: '#ede9fe' }
    };
    
    const config = statusConfig[status] || { text: status, color: '#6b7280', bgColor: '#f3f4f6' };
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        color: config.color,
        backgroundColor: config.bgColor
      }}>
        {config.text}
      </span>
    );
  };

  // Controleer of er al een geaccepteerde reservering is voor hetzelfde tijdslot
  const isSlotAlreadyAccepted = (currentReservation) => {
    return reservaties.some(reservation => 
      reservation.speed_id === currentReservation.speed_id && 
      reservation.status === 'accepted' && 
      reservation.reservering_id !== currentReservation.reservering_id
    );
  };

  const handleAccept = async (reserveringId) => {
    setActionLoading(reserveringId);
    try {
      const response = await fetch(`/api/reservaties/${reserveringId}/accepteren`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fout bij accepteren van reservering');
      }
      
      // Refresh de reserveringen
      const refreshResponse = await fetch(`/api/bedrijf/reservaties/${user.bedrijf_id}`);
      const data = await refreshResponse.json();
      setReservaties(data);
      
      alert('Reservering succesvol geaccepteerd!');
    } catch (err) {
      alert(`Er is een fout opgetreden bij het accepteren van de reservering: ${err.message}`);
      console.error('Error accepting reservation:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reserveringId) => {
    if (!rejectionReason.trim()) {
      alert('Geef een reden op voor de afwijzing.');
      return;
    }
    
    setActionLoading(reserveringId);
    try {
      const response = await fetch(`/api/reservaties/${reserveringId}/afwijzen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejection_reason: rejectionReason })
      });
      
      if (!response.ok) {
        throw new Error('Fout bij afwijzen van reservering');
      }
      
      // Refresh de reserveringen
      const refreshResponse = await fetch(`/api/bedrijf/reservaties/${user.bedrijf_id}`);
      const data = await refreshResponse.json();
      setReservaties(data);
      
      setRejectionReason("");
      alert('Reservering succesvol afgewezen!');
    } catch (err) {
      alert('Er is een fout opgetreden bij het afwijzen van de reservering.');
      console.error('Error rejecting reservation:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleProposeAlternative = async (reserveringId, alternativeSpeedId) => {
    setActionLoading(reserveringId);
    try {
      const response = await fetch(`/api/reservaties/${reserveringId}/alternatief`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alternative_speed_id: alternativeSpeedId })
      });
      
      if (!response.ok) {
        throw new Error('Fout bij voorstellen van alternatief');
      }
      
      // Refresh de reserveringen
      const refreshResponse = await fetch(`/api/bedrijf/reservaties/${user.bedrijf_id}`);
      const data = await refreshResponse.json();
      setReservaties(data);
      
      setShowAlternativeModal(false);
      setSelectedReservation(null);
      alert('Alternatief tijdslot succesvol voorgesteld!');
    } catch (err) {
      alert('Er is een fout opgetreden bij het voorstellen van een alternatief.');
      console.error('Error proposing alternative:', err);
    } finally {
      setActionLoading(null);
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
                      <th>Status</th>
                      <th>LinkedIn</th>
                      <th>Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservaties.map((reservatie) => {
                      // Bepaal welke tijd te tonen (origineel of alternatief)
                      const showTime = reservatie.status === 'alternative' && reservatie.alt_starttijd 
                        ? { start: reservatie.alt_starttijd, end: reservatie.alt_eindtijd }
                        : { start: reservatie.starttijd, end: reservatie.eindtijd };
                      
                      return (
                        <tr key={reservatie.reservering_id}>
                          <td>{`${reservatie.voornaam} ${reservatie.naam}`}</td>
                          <td>{formatDate(showTime.start)}</td>
                          <td>{formatTime(showTime.start)} - {formatTime(showTime.end)}</td>
                          <td>{getStatusBadge(reservatie.status)}</td>
                          <td>
                            {reservatie.linkedin ? (
                              <a 
                                href={reservatie.linkedin.startsWith('http') ? reservatie.linkedin : `https://${reservatie.linkedin}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="linkedin-table-link"
                              >
                                <FaLinkedin />
                                <span className="linkedin-link-text">Profiel</span>
                              </a>
                            ) : (
                              <span style={{ color: '#aaa', fontStyle: 'italic' }}>Geen profiel</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {/* Toon acties op basis van status */}
                              {reservatie.status === 'pending' && (
                                <>
                                  {/* Toon accepteren knop alleen als het tijdslot nog niet geaccepteerd is door een andere reservering */}
                                  {!isSlotAlreadyAccepted(reservatie) ? (
                                    <button 
                                      className="accept-btn" 
                                      onClick={() => handleAccept(reservatie.reservering_id)}
                                      disabled={actionLoading === reservatie.reservering_id}
                                      style={{
                                        padding: '4px 8px',
                                        backgroundColor: '#059669',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {actionLoading === reservatie.reservering_id ? '...' : '✅ Accepteren'}
                                    </button>
                                  ) : (
                                    <div style={{
                                      padding: '4px 8px',
                                      backgroundColor: '#fee2e2',
                                      color: '#dc2626',
                                      border: '1px solid #fecaca',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      textAlign: 'center'
                                    }}>
                                      Tijdslot al bezet
                                    </div>
                                  )}
                                  
                                  <button 
                                    className="reject-btn" 
                                    onClick={() => {
                                      setSelectedReservation(reservatie);
                                      setRejectionReason("");
                                    }}
                                    disabled={actionLoading === reservatie.reservering_id}
                                    style={{
                                      padding: '4px 8px',
                                      backgroundColor: '#dc2626',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    ❌ Afwijzen
                                  </button>
                                  
                                  <button 
                                    className="alternative-btn" 
                                    onClick={() => {
                                      setSelectedReservation(reservatie);
                                      setShowAlternativeModal(true);
                                    }}
                                    disabled={actionLoading === reservatie.reservering_id}
                                    style={{
                                      padding: '4px 8px',
                                      backgroundColor: '#7c3aed',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    🔄 Alternatief
                                  </button>
                                </>
                              )}
                              
                              {reservatie.status === 'alternative' && (
                                <div style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#fef3c7',
                                  color: '#92400e',
                                  border: '1px solid #f59e0b',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  textAlign: 'center'
                                }}>
                                  Wacht op student
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Modal voor afwijzing */}
        {selectedReservation && !showAlternativeModal && (
          <div className="student-detail-modal">
            <div className="student-detail-content">
              <button className="close-modal-btn" onClick={() => setSelectedReservation(null)}>Sluiten</button>
              <h2>Reservering afwijzen</h2>
              <p><strong>Student:</strong> {selectedReservation.voornaam} {selectedReservation.naam}</p>
              <p><strong>Tijdstip:</strong> {formatTime(selectedReservation.starttijd)} - {formatTime(selectedReservation.eindtijd)}</p>
              
              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="rejection-reason" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <strong>Reden van afwijzing:</strong>
                </label>
                <textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Geef een reden op voor de afwijzing..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => handleReject(selectedReservation.reservering_id)}
                  disabled={actionLoading === selectedReservation.reservering_id}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {actionLoading === selectedReservation.reservering_id ? 'Bezig...' : 'Afwijzen'}
                </button>
                <button
                  onClick={() => setSelectedReservation(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Annuleren
                </button>
              </div>
            </div>
            <div className="modal-backdrop" onClick={() => setSelectedReservation(null)}></div>
          </div>
        )}

        {/* Modal voor alternatief voorstel */}
        {showAlternativeModal && selectedReservation && (
          <div className="student-detail-modal">
            <div className="student-detail-content">
              <button className="close-modal-btn" onClick={() => {
                setShowAlternativeModal(false);
                setSelectedReservation(null);
              }}>Sluiten</button>
              <h2>Alternatief tijdslot voorstellen</h2>
              <p><strong>Student:</strong> {selectedReservation.voornaam} {selectedReservation.naam}</p>
              <p><strong>Oorspronkelijk tijdstip:</strong> {formatTime(selectedReservation.starttijd)} - {formatTime(selectedReservation.eindtijd)}</p>
              
              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <strong>Selecteer alternatief tijdslot:</strong>
                </label>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px' }}>
                  {availableSlots.length === 0 ? (
                    <p style={{ padding: '1rem', color: '#666' }}>Geen beschikbare tijdsloten</p>
                  ) : (
                    availableSlots.map((slot) => (
                      <button
                        key={slot.speed_id}
                        onClick={() => handleProposeAlternative(selectedReservation.reservering_id, slot.speed_id)}
                        disabled={actionLoading === selectedReservation.reservering_id}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '0.5rem',
                          border: 'none',
                          borderBottom: '1px solid #eee',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        {formatDate(slot.starttijd)} - {formatTime(slot.starttijd)} - {formatTime(slot.eindtijd)}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="modal-backdrop" onClick={() => {
              setShowAlternativeModal(false);
              setSelectedReservation(null);
            }}></div>
          </div>
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