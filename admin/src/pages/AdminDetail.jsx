import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export default function AdminDetail() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`http://localhost:5000/api/admin/admins/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setAdmin)
      .catch(() => setAdmin(null));
  }, [id]);

  if (!admin) return <p>Bezig met laden of niet gevonden</p>;

  return (
    <div className="admin-detail-container">
      <h1>Admin Details</h1>
      <p><strong>Gebruikersnaam:</strong> {admin.username}</p>
      <p><strong>Voornaam:</strong> {admin.first_name || '-'}</p>
      <p><strong>Achternaam:</strong> {admin.last_name || '-'}</p>
      <p><strong>E-mail:</strong> {admin.email}</p>
      <p><strong>Rol:</strong> {admin.role}</p>
      <p><strong>Aangemaakt op:</strong> {new Date(admin.created_at).toLocaleString()}</p>
    </div>
  );
}