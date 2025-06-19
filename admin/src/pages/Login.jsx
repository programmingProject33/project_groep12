import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Client-side validation and sanitization before sending
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim and sanitize inputs
    const user = username.trim();
    const pass = password;

    // Username: 3-20 alphanumeric characters
    const usernameRegex = /^[A-Za-z0-9]{3,20}$/;
    if (!usernameRegex.test(user)) {
      setError('Gebruikersnaam moet 3-20 alfanumerieke tekens bevatten.');
      return;
    }

    // Password: at least 8 characters
    if (pass.length < 8) {
      setError('Wachtwoord moet minstens 8 tekens bevatten.');
      return;
    }

    // Clear any previous error
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login mislukt');
      }
    } catch (err) {
      setError('Fout bij verbinden met de server.');
    }
  };

  return (
     
    <div className='login-container'>
    <form className="loginForm" onSubmit={handleSubmit} noValidate>
      <h1>Admin Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label htmlFor="username">Gebruikersnaam</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Gebruikersnaam"
          value={username}
          onChange={(e) => setUsername(e.target.value.trimStart())}
          required
          minLength={3}
          maxLength={20}
          pattern="[A-Za-z0-9]+"
        />
      </div>

      <div>
        <label htmlFor="password">Wachtwoord</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>

      <button type="submit">Inloggen</button>
    </form>
    </div>
    
  );
}

export default AdminLogin;


