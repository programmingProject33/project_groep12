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
        const uniekeJaren = [...new Set(data.map(s => s.opleiding_jaar).filter(j => Boolean(j) && j !== 1))];


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

  const handleVerwijderStudent = (id) => {
    const bevestig = window.confirm("Weet je zeker dat je deze student wilt verwijderen?");
    if (!bevestig) return;
  
    const token = localStorage.getItem('adminToken');
  
    fetch(`http://localhost:5000/api/admin/studenten/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Verwijderen mislukt');
        setStudenten(prev => prev.filter(s => s.gebruiker_id !== id));
        alert(" Student is succesvol verwijderd.");
      })
      .catch(err => {
        console.error('Fout bij verwijderen student:', err);
        alert(" Verwijderen is mislukt. Probeer opnieuw.");
      });
  };
  


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
            {opleidingen.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          <select value={jaar} onChange={(e) => setJaar(e.target.value)} style={{ marginLeft: '10px' }}>
            <option value="alle">Alle jaren</option>
            {jaren.map((j) => (
              <option key={j} value={j}>{j}</option>
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
                  <th>Acties</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.gebruiker_id}>
                    <td>{s.voornaam} {s.naam}</td>
                    <td>{s.email}</td>
                    <td>{s.opleiding}</td>
                    <td>{s.opleiding_jaar}</td>
                    <td>
                      <button className='verwijder-bedrijf-student-admin' onClick={() => handleVerwijderStudent(s.gebruiker_id)}>Verwijderen</button>
                    </td>
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
