import { NavLink } from 'react-router-dom';
import './AdminNav.css';

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

          </ul>
        </nav>
      </aside>
    </header>
  );
}

export default AdminNav;




// import { NavLink } from 'react-router-dom';
// import './AdminNav.css'; // optioneel voor styling
// import tandweilPng from '../images/house-Tandwiel.png';
// import profielIcon from '../images/profiel-icon.png';

// const navItems = [
//   { name: 'Dashboard', path: '/dashboard' },
//   { name: 'Lijst van bedrijven', path: '/bedrijven' },
//   { name: 'Lijst van Studenten', path: '/studenten' },
//   { name: 'Speeddate', path: '/speeddates' },
//   { name: 'Profiel', path: '/profile' },
// ];

// function AdminNav() {
//   return (
//     <nav className="admin-nav">
//       <ul>
//       <img className="logo" src={tandweilPng} alt="house tandwiel icon" />
//         {navItems.map((item) => (
//           <li key={item.path}>
//             <NavLink
//               to={item.path}
//               className={({ isActive }) => (isActive ? 'active' : '')}
//             >
//               {item.name}
//             </NavLink>
//           </li>
//         ))}
//         <img className="profielIcon" src={profielIcon} alt="profiel icon" />
//       </ul>
//     </nav>
//   );
// }

// export default AdminNav;

