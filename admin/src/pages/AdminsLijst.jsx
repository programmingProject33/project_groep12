import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminsList() {
  const [admins, setAdmins] = useState([]);
  const [me, setMe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    // Haal eigen profiel op om id en role te weten
    fetch('http://localhost:5000/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMe(data))
      .catch(err => console.error('Fout bij laden profiel:', err));

    // Haal lijst van admins op
    fetch('http://localhost:5000/api/admin/admins', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAdmins(data))
      .catch(err => setError('Fout bij ophalen admins'));
  }, []);

  // Functie om admin te verwijderen
  const deleteAdmin = async (id) => {
    if (!window.confirm('Weet je zeker dat je deze admin wilt verwijderen?')) return;
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`http://localhost:5000/api/admin/admins/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Fout bij verwijderen');
      } else {
        // Ververs de admins-lijst
        setAdmins(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      setError('Fout bij verbinden met server');
    }
  };

  return (
    <div>
    
      <main>
      <h1>Overzicht Admins</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {admins.map(a => (
          <li key={a.id} style={{ marginBottom: '8px' }}>
            {a.username} ({a.email}) – aangemaakt op {new Date(a.created_at).toLocaleDateString()}
            {/* Toon delete-knop alleen voor superadmin en niet voor jezelf */}
            {me?.role === 'superadmin' && a.id !== me.id && (
              <button
                onClick={() => deleteAdmin(a.id)}
                style={{ marginLeft: '12px' }}
              >
                Verwijderen
              </button>
            )}
          </li>
        ))}
      </ul>
      </main>
    </div>
  );
}
