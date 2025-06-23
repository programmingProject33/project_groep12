import { NavLink } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function AdminNav() {
  
  return (
    <header>
      
      <aside className="sidebar">
        <nav className="admin-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/bedrijven" className={({ isActive }) => isActive ? 'active' : ''}>
                Lijst van bedrijven
              </NavLink>
            </li>

            <li>
              <NavLink to="/studenten" className={({ isActive }) => isActive ? 'active' : ''}>
                Lijst van Studenten
              </NavLink>
            </li>

            <li>
              <NavLink to="/speeddates" className={({ isActive }) => isActive ? 'active' : ''}>
                Speeddate
              </NavLink>
            </li>

            <li>
              <NavLink to="/admins" className={({ isActive }) => isActive ? 'active' : ''}>
                Admins
              </NavLink>
            </li>
             <li>
             <LogoutButton />
             </li>
          </ul>
        </nav>
      </aside>
    </header>
  );
}

export default AdminNav;


