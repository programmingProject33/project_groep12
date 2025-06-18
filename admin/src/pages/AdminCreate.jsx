import { useState } from 'react';


export default function AdminCreate() {
  const [form, setForm] = useState({
    username: '', first_name: '', last_name: '', email: '', password: ''
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Client-side validatie
    if (form.username.length < 3) {
      return setError('Gebruikersnaam te kort');
    }
    if (!form.password.match(/^(?=.*\d).{8,}$/)) {
      return setError('Wachtwoord moet minstens 8 tekens en één cijfer bevatten');
    }

    const token = localStorage.getItem('adminToken');
    const res = await fetch('http://localhost:5000/api/admin/admins', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      return setError(data.message || data.errors?.[0]?.msg || 'Fout bij aanmaken');
    }
    alert('Admin aangemaakt');
  }

  return (
    <div>

      <main>
      <h2>Nieuwe Admin Aanmaken</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Gebruikersnaam:
          <input name="username" value={form.username} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Voornaam:
          <input name="first_name" value={form.first_name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Achternaam:
          <input name="last_name" value={form.last_name} onChange={handleChange} />
        </label>
        <br />
        <label>
          E-mail:
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Wachtwoord:
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Aanmaken</button>
      </form>
      </main>
    </div>
  );
}
