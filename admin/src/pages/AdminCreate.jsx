import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';


function AdminCreate() {
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validatie
    if (form.username.length < 3) return setError('Gebruikersnaam te kort');
    if (!form.password.match(/^(?=.*\d).{8,}$/)) return setError('Wachtwoord moet minstens 8 tekens en één cijfer bevatten');
    if (!['admin', 'superadmin'].includes(form.role)) return setError('Ongeldige rolkeuze');

    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch('http://localhost:5000/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || data.errors?.[0]?.msg || 'Fout bij aanmaken');

      // E-mail verzenden (optioneel)
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          username: form.username,
          first_name: form.first_name || form.username,
          password: form.password,
          email: form.email
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      alert('Admin succesvol aangemaakt');
      navigate('/admins');
    } catch (err) {
      console.error(err);
      setError('Er is iets misgegaan bij het aanmaken of verzenden');
    }
  };

  return (
    <div className="admin-create-container">
      <h2>Nieuwe Admin Aanmaken</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <label>Gebruikersnaam:</label>
        <input name="username" value={form.username} onChange={handleChange} required />

        <label>Voornaam:</label>
        <input name="first_name" value={form.first_name} onChange={handleChange} />

        <label>Achternaam:</label>
        <input name="last_name" value={form.last_name} onChange={handleChange} />

        <label>E-mail:</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Wachtwoord:</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
        
       <button type="submit">Aanmaken</button>
      </form>
    </div>
  );
}

export default AdminCreate;