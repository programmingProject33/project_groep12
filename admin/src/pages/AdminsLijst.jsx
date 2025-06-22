
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function AdminsList() {
  const [admins, setAdmins] = useState([]);
  const [me, setMe] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    fetch('http://localhost:5000/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMe(data))
      .catch(() => console.error('Fout bij ophalen profiel'));

    fetch('http://localhost:5000/api/admin/admins', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAdmins(data))
      .catch(() => setError('Fout bij ophalen admins'));
  }, []);

  const deleteAdmin = async (id) => {
    if (!window.confirm('Weet je zeker dat je deze admin wilt verwijderen?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/admins/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Fout bij verwijderen');
      setAdmins(prev => prev.filter(a => a.id !== id));
    } catch {
      setError('Verbinding met server mislukt');
    }
  };



  return (
    <div className="admin-list-container">
      <h1>Overzicht Admins</h1>
      {error && <p className="error-message">{error}</p>}

      {me?.role === 'superadmin' && (
        <button className="create-btn" onClick={() => navigate('/admins/nieuw')}>
           Nieuwe Admin Aanmaken
        </button>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Naam</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(a => (
            <tr key={a.id} onClick={() => navigate(`/admins/${a.id}`)}>
              <td>{a.first_name} {a.last_name}</td>
              <td>{a.email}</td>
              <td>{a.role}</td>
              <td>
                
                {me?.role === 'superadmin' && a.id !== me.id && (
                  <>
                    <button onClick={() => deleteAdmin(a.id)}> Verwijderen</button>
                
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}