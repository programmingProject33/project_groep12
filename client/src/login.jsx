import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";
import "./Login.css";

function Navigation({ onLoginClick }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <span className="navbar-title">Careerlaunch</span>
      </div>
      <ul className="navbar-links">
        <li><a onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</a></li>
        <li><a onClick={() => navigate("/bedrijven")} style={{ cursor: "pointer" }}>Bedrijven</a></li>
        <li onClick={() => navigate("/contactNavbalk")} style={{ cursor: "pointer" }}>
          Contact
        </li>
        <li><button className="navbar-btn register" onClick={() => navigate("/registreer")}>Registreer</button></li>
        <li><button className="navbar-btn login" onClick={() => navigate("/login")}>Login</button></li>
      </ul>
    </nav>
  );
}

function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer className="footer">
      <div className="footer-row">
        <div className="footer-col left">
          <div className="footer-logo-box"></div>
          <div className="footer-mail">
            E-mailadres: pp-test@ehb.be<br />
            +32 494 77 08 550
          </div>
        </div>
        <div className="footer-col middle">
          <ul className="footer-menu">
            <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              Home
            </li>
            <li onClick={() => navigate("/registreer")} style={{ cursor: "pointer" }}>
              Registreer
            </li>
            <li onClick={() => navigate("/contactNavbalk")} style={{ cursor: "pointer" }}>
              Contact
            </li>
            <li onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
              Login
            </li>
          </ul>
        </div>
         <div className="footer-col right">
                    <div className="footer-socials">
                      <a
                        href="https://www.linkedin.com/company/meterasmusplus/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon"
                        title="LinkedIn"
                      >
                        <FaLinkedin />
                      </a>
                      <a
                        href="https://www.instagram.com/erasmushogeschool/?hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon"
                        title="Instagram"
                      >
                        <FaInstagram />
                      </a>
                      <a
                        href="https://x.com/EUErasmusPlus?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon"
                        title="X"
                      >
                        <FaXTwitter />
                      </a>
                      <a
                        href="https://www.tiktok.com/@erasmushogeschool"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon"
                        title="TikTok"
                      >
                        <FaTiktok />
                      </a>
                    </div>
                  </div>
      </div>
    </footer>
  );
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !wachtwoord) {
      return setError("Alle velden zijn verplicht.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Voer een geldig e-mailadres in.");
    }

    // Fake login check
    if (email === "student@ehb.be" && wachtwoord === "test123") {
      setError("");
      navigate("/dashboard");
    } else {
      setError("Ongeldige logingegevens.");
    }
  };

  return (
    <>
      <Navigation />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            E-mailadres:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="voorbeeld@ehb.be"
            />
          </label>

          <label>
            Wachtwoord:
            <input
              type="password"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              required
              placeholder="••••••••"
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn primary">Inloggen</button>

          <p className="register-link">
            Nog geen account? <Link to="/registreer">Registreer hier</Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;