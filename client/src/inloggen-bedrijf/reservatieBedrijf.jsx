import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import BedrijfNavbar from "./BedrijfNavbar";
import BedrijfFooter from "./bedrijfFooter";
import "./reservatieBedrijf.css";

export default function Reservaties() {
  const { user } = useAuth();
  const [reservaties, setReservaties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchReservaties = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bedrijf/reservaties/${user.bedrijf_id}`);
        if (!response.ok) {
          throw new Error('Fout bij het ophalen van de reservaties');
        }
        const data = await response.json();
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
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const nextMinutes = (parseInt(minutes) + 10).toString().padStart(2, '0');
    return `${hours}:${minutes} - ${hours}:${nextMinutes}`;
  };

  const filteredReservaties = filterDate
    ? reservaties.filter(res => formatDate(res.starttijd) === filterDate)
    : reservaties;

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
            <div className="filter-container">
              <label htmlFor="dateFilter">Filter op datum:</label>
              <input
                type="date"
                id="dateFilter"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              {filterDate && (
                <button 
                  className="clear-filter"
                  onClick={() => setFilterDate("")}
                >
                  Filter wissen
                </button>
              )}
            </div>

            {filteredReservaties.length === 0 ? (
              <p>Geen reservaties gevonden</p>
            ) : (
              <div className="reservaties-table-container">
                <table className="reservaties-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Datum</th>
                      <th>Tijdstip</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservaties.map((reservatie) => (
                      <tr key={reservatie.speed_id}>
                        <td>{`${reservatie.voornaam} ${reservatie.naam}`}</td>
                        <td>{formatDate(reservatie.starttijd)}</td>
                        <td>{formatTime(reservatie.starttijd)}</td>
                        <td>{reservatie.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
      <BedrijfFooter />
    </div>
  );
} 