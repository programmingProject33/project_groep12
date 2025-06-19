import { useEffect, useState } from 'react';

import '../App.css'
function Dashboard() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      },
    })
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Toegang geweigerd'));
  }, []);

  return (
    <div>
      <main>
      <h1>Admin Dashboard</h1>
      <p>{message}</p>
      </main>
    </div>
  );
}

export default Dashboard;

 



