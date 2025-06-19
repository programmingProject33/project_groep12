import AdminNav from './AdminNav';
import tandweilPng from '../images/home-tandwiel.png';
import profielIcon from '../images/user_icon.png';
import { NavLink } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <>
      {/* Top navigatiebalk */}
      <div className="headerBalk">
        <ul>
          <li>
            <img className="logo" src={tandweilPng} alt="house tandwiel icon" />
            <span>Careerlaunch</span>
          </li>

          <li>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
              <span>Profiel</span>
              <img className="profielIcon" src={profielIcon} alt="profiel icon" />
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Layout met sidebar en content */}
      <div className="layout">
        <aside className="sidebar">
          <AdminNav />
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
}
