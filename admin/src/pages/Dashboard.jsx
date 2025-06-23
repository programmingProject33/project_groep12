import { useEffect, useState } from 'react';
import '../App.css';

function Dashboard() {
  const [stats, setStats] = useState({
    bedrijfCount: 0,
    avgSlotsPerBedrijf: 0,
    studentCount: 0,
    studentsWithReservation: 0,
    studentsWithoutReservation: 0,
    reservedSlots: 0,
    availableSlots: 0,
    totalSlots: 0,
  });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('http://localhost:5000/api/admin/stats/bedrijven-en-slots', { headers }).then(r => r.json()),
      fetch('http://localhost:5000/api/admin/stats/studenten', { headers }).then(r => r.json()),
      fetch('http://localhost:5000/api/admin/stats/speeddateslots', { headers }).then(r => r.json()),
    ])
      .then(([bedrijven, studenten, slots]) => {
        setStats({
          bedrijfCount: bedrijven.bedrijf_count,
          avgSlotsPerBedrijf: bedrijven.gemiddeld_per_bedrijf,
          studentCount: studenten.student_count,
          studentsWithReservation: studenten.students_with_reservation,
          studentsWithoutReservation: studenten.student_count - studenten.students_with_reservation,
          reservedSlots: slots.gereserveerd,
          availableSlots: slots.beschikbaar,
          totalSlots: slots.totaal,
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="cards-wrapper">
        <div className="card">
          <h2>Bedrijven</h2>
          <p><strong>Totaal:</strong> <span className="stat-value">{stats.bedrijfCount}</span></p>
          <p><strong>Gemiddeld speeddates per bedrijf:</strong> <span className="stat-value">{Math.round(stats.avgSlotsPerBedrijf)}</span></p>
        </div>

        <div className="card">
          <h2>Studenten</h2>
          <p><strong>Totaal:</strong> <span className="stat-value">{stats.studentCount}</span></p>
          <p><strong>Met reservatie:</strong> <span className="stat-value">{stats.studentsWithReservation}</span></p>
          <p><strong>Zonder reservatie:</strong> <span className="stat-value">{stats.studentsWithoutReservation}</span></p>
        </div>

        <div className="card">
          <h2>Speeddates</h2>
          <p><strong>Gereserveerde slots:</strong> <span className="stat-value">{stats.reservedSlots}</span></p>
          <p><strong>Beschikbare slots:</strong> <span className="stat-value">{stats.availableSlots}</span></p>
          <p><strong>Totaal slots:</strong> <span className="stat-value">{stats.totalSlots}</span></p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
