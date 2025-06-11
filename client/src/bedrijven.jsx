import { useEffect, useState } from 'react';

function Bedrijven() {
  const [bedrijven, setBedrijven] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/bedrijven')
      .then(res => res.json())
      .then(data => setBedrijven(data))
      .catch(err => console.error('Fout bij ophalen:', err));
  }, []);

  return (
    <div>
      <h1>Bedrijven Lijst</h1>
      <ul>
        {bedrijven.map((bedrijf) => (
          <li key={bedrijf.id}>
            {bedrijf.naam} - {bedrijf.bedrijf_URL}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bedrijven;