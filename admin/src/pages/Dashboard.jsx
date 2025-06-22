import { useEffect, useState } from 'react';
import '../App.css';

function Dashboard() {
  const [stats, setStats] = useState({
    companies: 0,
    students: 0,
    reservations: 0,
    avgPerCompany: 0,
    reservedStudents: 0,
    unreservedStudents: 0,
    totalSlots: 0,
    availableSlots: 0,
  });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('http://localhost:5000/api/admin/stats/companies', { headers }).then(r => r.json()),
      fetch('http://localhost:5000/api/admin/stats/students', { headers }).then(r => r.json()),
      fetch('http://localhost:5000/api/admin/stats/reservations', { headers }).then(r => r.json()),
      fetch('http://localhost:5000/api/admin/stats/reserved-students', { headers }).then(r => r.json()),
      fetch('http://localhost:5000/api/admin/stats/speeddateslots', { headers }).then(r => r.json()),
    ])
      .then(([companies, students, reservations, reserved, slots]) => {
        setStats({
          companies: companies.count,
          students: students.count,
          reservations: slots.gereserveerd,
          avgPerCompany: companies.count > 0 ? Math.round(slots.gereserveerd / companies.count) : 0,
          reservedStudents: reserved.count,
          unreservedStudents: students.count - reserved.count,
          totalSlots: slots.totaal,
          availableSlots: slots.beschikbaar,
        });
      })
      .catch(console.error);
  }, [token]);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="cards-wrapper">
        <div className="card">
          <h2>Bedrijven</h2>
          <p><strong>Totaal:</strong> <span className="stat-value">{stats.companies}</span></p>
          <p><strong>Gemiddelde speeddate per bedrijf:</strong> <span className="stat-value">{stats.avgPerCompany}</span></p>
        </div>
        <div className="card">
          <h2>Studenten</h2>
          <p><strong>Totaal:</strong> <span className="stat-value">{stats.students}</span></p>
          <p><strong>Met speeddate:</strong> <span className="stat-value">{stats.reservedStudents}</span></p>
          <p><strong>Zonder speeddate:</strong> <span className="stat-value">{stats.unreservedStudents}</span></p>
        </div>
        <div className="card">
          <h2>Speeddates</h2>
          <p><strong>Gereserveerd:</strong> <span className="stat-value">{stats.reservations}</span></p>
          <p><strong>Beschikbaar:</strong> <span className="stat-value">{stats.availableSlots}</span></p>
          <p><strong>Totaal slots:</strong> <span className="stat-value">{stats.totalSlots}</span></p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
