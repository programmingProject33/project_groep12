import { useEffect, useState } from 'react';

function StudentenLijst() {
  const [studenten, setStudenten] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [zoekterm, setZoekterm] = useState('');
  const [opleiding, setOpleiding] = useState('alle');
  const [jaar, setJaar] = useState('alle');
  const [opleidingen, setOpleidingen] = useState([]);
  const [jaren, setJaren] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    fetch('http://localhost:5000/api/admin/studenten', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setStudenten(data);
        setFiltered(data);

        const uniekeOpleidingen = [...new Set(data.map(s => s.opleiding).filter(Boolean))];
        const uniekeJaren = [...new Set(data.map(s => s.opleiding_jaar).filter(Boolean))];

        setOpleidingen(uniekeOpleidingen);
        setJaren(uniekeJaren);
      })
      .catch(err => console.error('Fout bij ophalen studenten:', err));
  }, []);

  useEffect(() => {
    let data = [...studenten];

    if (zoekterm) {
      data = data.filter(s =>
        `${s.voornaam} ${s.naam}`.toLowerCase().includes(zoekterm.toLowerCase())
      );
    }

    if (opleiding !== 'alle') {
      data = data.filter(s => s.opleiding === opleiding);
    }

    if (jaar !== 'alle') {
      data = data.filter(s => String(s.opleiding_jaar) === jaar);
    }

    data.sort((a, b) => {
      const naamA = `${a.voornaam} ${a.naam}`;
      const naamB = `${b.voornaam} ${b.naam}`;
      return sortOrder === 'asc'
        ? naamA.localeCompare(naamB)
        : naamB.localeCompare(naamA);
    });

    setFiltered(data);
  }, [zoekterm, opleiding, jaar, sortOrder, studenten]);

  return (
    <div>
      <main>
      <h1>Studenten</h1>

      <div className="filterbar" >
        <input
          type="text"
          placeholder="Zoek op naam..."
          value={zoekterm}
          onChange={(e) => setZoekterm(e.target.value)}
          style={{ marginRight: '10px' }}
        />

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Sorteer A-Z</option>
          <option value="desc">Sorteer Z-A</option>
        </select>

        <select value={opleiding} onChange={(e) => setOpleiding(e.target.value)} style={{ marginLeft: '10px' }}>
          <option value="alle">Alle opleidingen</option>
          {opleidingen.map((o, i) => (
            <option key={i} value={o}>{o}</option>
          ))}
        </select>

        <select value={jaar} onChange={(e) => setJaar(e.target.value)} style={{ marginLeft: '10px' }}>
          <option value="alle">Alle jaren</option>
          {jaren.map((j, i) => (
            <option key={i} value={j}>{j}</option>
          ))}
        </select>
      </div>
      <div className="table-container">
      {filtered.length === 0 ? (
        <p>Geen studenten gevonden.</p>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>E-mail</th>
              <th>Opleiding</th>
              <th>Jaar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>{s.voornaam} {s.naam}</td>
                <td>{s.email}</td>
                <td>{s.opleiding}</td>
                <td>{s.opleiding_jaar}</td>
              </tr>
            ))}
          </tbody>
        </table>  
      )}
      </div>
      </main>
    </div>
  );
}

export default StudentenLijst;
