import React from 'react';
import { Link } from 'react-router-dom';
import './StudentFooter.css';

export default function StudentFooter() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Careerlaunch</h3>
          <p>Verbind studenten met hun toekomstige werkgevers</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/student-dashboard">Home</Link></li>
            <li><Link to="/student/bedrijven">Bedrijven</Link></li>
            <li><Link to="/reservaties">Reservaties</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@careerlaunch.be</p>
          <p>Tel: +32 123 45 67 89</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Careerlaunch. Alle rechten voorbehouden.</p>
      </div>
    </footer>
  );
} 