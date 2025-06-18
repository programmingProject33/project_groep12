import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminNav from '../components/AdminNav';


export default function AdminDetail() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`http://localhost:5000/api/admin/admins/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Niet gevonden');
        return res.json();
      })
      .then(setAdmin)
      .catch(() => setAdmin(null));
  }, [id]);

  if (admin === null) return <p>Bezig met laden of niet gevonden</p>;

  return (
    <div>
      <AdminNav />
      <main>
      <h1>Admin: {admin.username}</h1>
      <p>Voornaam: {admin.first_name || '-'}</p>
      <p>Achternaam: {admin.last_name || '-'}</p>
      <p>E-mail: {admin.email}</p>
      <p>Aangemaakt op: {new Date(admin.created_at).toLocaleString()}</p>
      </main>
    </div>
  );
}
