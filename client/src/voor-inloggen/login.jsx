import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok, FaEye, FaEyeSlash } from "react-icons/fa6";
import "./login.css";
import { useAuth } from "../AuthContext.jsx";

const Login = () => {
  const [gebruikersnaam, setGebruikersnaam] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [type, setType] = useState("student");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
  if(!gebruikersnaam && ! wachtwoord) {
      return setError("gebruikersnaam en wachtwoord verplicht")
    }
    if(!gebruikersnaam) {
      return setError("gebruikersnaam verplicnt!")
    }
    if(!wachtwoord) {
      return setError("wachtwoord is verplicht")
    }

    // Minimum wachtwoordlengte validatie
    if (wachtwoord.length < 6) {
      return setError("Wachtwoord moet minimaal 6 tekens bevatten");
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gebruikersnaam,
          wachtwoord,
          type
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response body:", data);

      console.log("Login response user:", data.user);

      if (!response.ok) {
        throw new Error(data.message || 'Er is iets misgegaan');
      }

      // Store user data using context (alleen als data.user of data.userType bestaat)
      if (data.user) {
        setUser(data.user);
      }
      
      // Redirect based on user type (alleen als userType bestaat)
      if (data.user && data.user.type === 'student') {
        navigate('/student/dashboard');
      } else if (data.user && data.user.type === 'bedrijf') {
        navigate('/bedrijf/home');
      } else if (data.userType) {
        // fallback voor oude backend response
        if (data.userType === 'student') {
          navigate('/student/dashboard');
        } else if (data.userType === 'bedrijf') {
          navigate('/bedrijf/home');
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="login-bg">
        <div className="login-hero">
          <svg className="login-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#eef4ff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
          <h1 className="login-hero-title">Inloggen</h1>
        </div>
        <div className="login-container login-anim">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-type-selector">
              <button
                type="button"
                className={`type-btn ${type === 'student' ? 'active' : ''}`}
                onClick={() => setType('student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`type-btn ${type === 'bedrijf' ? 'active' : ''}`}
                onClick={() => setType('bedrijf')}
              >
                Bedrijf
              </button>
            </div>
            <label>
              Gebruikersnaam:
              <input
                type="text"
                value={gebruikersnaam}
                onChange={(e) => setGebruikersnaam(e.target.value)}
                required
                placeholder="Voer je gebruikersnaam in"
              />
            </label>
            <label>
              Wachtwoord:
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={wachtwoord}
                  onChange={(e) => setWachtwoord(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength="6"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn primary login-btn">Inloggen</button>
            <p className="register-link">
              Nog geen account? <Link to="/registreer">Registreer hier</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;