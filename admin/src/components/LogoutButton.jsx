import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Weet je zeker dat je wilt uitloggen?');
    if (!confirmLogout) return;

    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Uitloggen
    </button>
  );
}

export default LogoutButton;
