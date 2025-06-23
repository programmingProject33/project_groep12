import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [admin, setAdmin] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  });
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [editingField, setEditingField] = useState(null); // 'first_name', 'last_name', 'username', 'email', 'password'
  const navigate = useNavigate();

  // Token check & logout
  function logout() {
    localStorage.removeItem('adminToken');
    navigate('/login');
  }
  function checkTokenValid() {
    const token = localStorage.getItem('adminToken');
    if (!token) { logout(); return false; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp < Date.now() / 1000) { logout(); return false; }
      return true;
    } catch {
      logout(); return false;
    }
  }

  // Laad profiel
  useEffect(() => {
    if (!checkTokenValid()) return;
    fetch('http://localhost:5000/api/admin/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
    })
      .then(res => {
        if (res.status === 401) { logout(); return; }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        setAdmin(data);
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          username: data.username || '',
          email: data.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      })
      .catch(() => alert('Fout bij laden van profielgegevens'));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Opslaan per veld
  const handleSave = async (field) => {
    // Bouw payload
    const payload = { currentPassword: form.currentPassword };
    if (field === 'password') {
      payload.newPassword = form.newPassword;
      payload.confirmPassword = form.confirmPassword;
    } else {
      payload[field] = form[field];
    }

    try {
      const res = await fetch('http://localhost:5000/api/admin/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Fout bij opslaan');

      // Update lokale state
      if (field !== 'password') {
        setAdmin({ ...admin, [field]: form[field] });
      }
      alert( data.message);
      // Reset alleen wachtwoord-velden
      setForm({
        ...form,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setEditingField(null);

    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = () => {
    // bij cancel terug naar origineel
    setForm({
      ...form,
      first_name: admin.first_name,
      last_name: admin.last_name,
      username: admin.username,
      email: admin.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setEditingField(null);
  };

  return (
    <div className="profile-container">
      <h1>Admin Profiel</h1>

      {/* Eerst: per veld tonen of bewerken */}
      {['first_name','last_name','username','email'].map((field) => (
        <div key={field} className="profile-field">
          {!editingField || editingField !== field ? (
            <>
              <label>
                {field === 'first_name' ? 'Voornaam' :
                 field === 'last_name'  ? 'Achternaam' :
                 field === 'username'   ? 'Gebruikersnaam' :
                 'E-mail'}:&nbsp;
                <strong>{admin[field]}</strong>
              </label>
              <button
                className="wijzigen"
                onClick={() => setEditingField(field)}
              >
                Wijzigen
              </button>
            </>
          ) : (
            <>
              <label>
                {field === 'first_name' ? 'Voornaam' :
                 field === 'last_name'  ? 'Achternaam' :
                 field === 'username'   ? 'Gebruikersnaam' :
                 'E-mail'}:
                <input
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Huidig wachtwoord:
                <input
                  name="currentPassword"
                  type="password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                />
              </label>
              <div className="profile-buttons">
                <button
                  type="button"
                  className="save"
                  onClick={() => handleSave(field)}
                >
                  Opslaan
                </button>
                <button
                  type="button"
                  className="cancel"
                  onClick={handleCancel}
                >
                  Annuleren
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Wachtwoord apart */}
      <div className="profile-field">
        {!editingField || editingField !== 'password' ? (
          <button
            className="wijzigen"
            onClick={() => setEditingField('password')}
          >
            Wachtwoord wijzigen
          </button>
        ) : (
          <>
            <label>
              Nieuw wachtwoord:
              <input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Bevestig nieuw wachtwoord:
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Huidig wachtwoord:
              <input
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
                required
              />
            </label>
            <div className="profile-buttons">
              <button
                type="button"
                className="save"
                onClick={() => handleSave('password')}
              >
                Opslaan
              </button>
              <button
                type="button"
                className="cancel"
                onClick={handleCancel}
              >
                Annuleren
              </button>
            </div>
          </>
        )}
      </div>

      <button className="uitloggen" onClick={logout}>
        Uitloggen
      </button>
    </div>
  );
}

export default Profile;
