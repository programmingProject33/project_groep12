import { useEffect, useState } from 'react';
import '../App.css';

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    companies: 0,
    students: 0,
    reservations: 0,
    questions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Geen toegang');
      setLoading(false);
      return;
    }

    // Haal profiel op
    fetch('http://localhost:5000/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAdmin(data))
      .catch(() => setError('Fout bij ophalen profiel'));

    // Haal statistieken op
    Promise.all([
      fetch('http://localhost:5000/api/admin/stats/companies', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch('http://localhost:5000/api/admin/stats/students', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch('http://localhost:5000/api/admin/stats/reservations', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      
    ])
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(([companies, students, reservations]) => {
        setStats({
          companies: companies.count,
          students: students.count,
          reservations: reservations.count
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Fout bij ophalen statistieken');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Bezig met laden...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h1>Welkom terug, {admin.first_name || admin.username} 👋</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Bedrijven</h3>
          <p>{stats.companies}</p>
        </div>
        <div className="stat-card">
          <h3>Studenten</h3>
          <p>{stats.students}</p>
        </div>
        <div className="stat-card">
          <h3>Speeddates</h3>
          <p>{stats.reservations}</p>
        </div>
        <div className="stat-card">
          <h3>Vragen</h3>
          <p>{stats.questions}</p>
        </div>
      </div>
    </div>
  );
}


 



