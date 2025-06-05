import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test API call
    fetch('http://localhost:5000/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <h1>Vite + React + Express</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : data ? (
        <div>
          <h2>Data van server:</h2>
          <p>{data.data}</p>
          <p><small>Tijd: {data.timestamp}</small></p>
        </div>
      ) : (
        <p>Geen data ontvangen</p>
      )}
    </div>
  )
}

export default App