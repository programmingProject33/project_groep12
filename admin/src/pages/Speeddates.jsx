import { useEffect, useState } from 'react';

function Speeddates() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [zoekterm, setZoekterm] = useState('');
  const [bedrijfFilter, setBedrijfFilter] = useState('alle');
  const [studentFilter, setStudentFilter] = useState('alle');
  const [sortOrder, setSortOrder] = useState('asc');
  const [bedrijven, setBedrijven] = useState([]);
  const [studenten, setStudenten] = useState([]);

  // Ophalen van data bij het laden
  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    fetch('http://localhost:5000/api/admin/speeddates', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(result => {
        setData(result);
        setFiltered(result);

        const uniekeBedrijven = [...new Set(result.map(r => r.bedrijf_naam))];
        const uniekeStudenten = [...new Set(result.map(r => `${r.student_voornaam} ${r.student_naam}`))];

        setBedrijven(uniekeBedrijven);
        setStudenten(uniekeStudenten);
      })
      .catch(err => console.error('Fout bij ophalen speeddates:', err));
  }, []);

  // Filteren en sorteren
  useEffect(() => {
    let result = [...data];

    if (zoekterm) {
      result = result.filter(r =>
        r.bedrijf_naam.toLowerCase().includes(zoekterm.toLowerCase()) ||
        `${r.student_voornaam} ${r.student_naam}`.toLowerCase().includes(zoekterm.toLowerCase())
      );
    }

    if (bedrijfFilter !== 'alle') {
      result = result.filter(r => r.bedrijf_naam === bedrijfFilter);
    }

    if (studentFilter !== 'alle') {
      result = result.filter(r => `${r.student_voornaam} ${r.student_naam}` === studentFilter);
    }

    result.sort((a, b) => {
      const tijdA = new Date(a.starttijd);
      const tijdB = new Date(b.starttijd);
      return sortOrder === 'asc' ? tijdA - tijdB : tijdB - tijdA;
    });

    setFiltered(result);
  }, [zoekterm, bedrijfFilter, studentFilter, sortOrder, data]);

  // Gegroepeerde weergave per student
  const gegroepeerd = {};
  filtered.forEach(r => {
    const sleutel = `${r.student_voornaam} ${r.student_naam}`;
    if (!gegroepeerd[sleutel]) {
      gegroepeerd[sleutel] = [];
    }
    gegroepeerd[sleutel].push({
      bedrijf: r.bedrijf_naam,
      tijd: `${new Date(r.starttijd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(r.eindtijd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });
  });

  return (
    <div>
      <main>
        <h1>Speeddate-reserveringen</h1>

        {/* Filterbalk */}
        <div className="filterbar">
          <input
            type="text"
            placeholder="Zoek student of bedrijf..."
            value={zoekterm}
            onChange={(e) => setZoekterm(e.target.value)}
            style={{ marginRight: '10px' }}
          />

          <select value={bedrijfFilter} onChange={(e) => setBedrijfFilter(e.target.value)}>
            <option value="alle">Alle bedrijven</option>
            {bedrijven.map((b, i) => (
              <option key={i} value={b}>{b}</option>
            ))}
          </select>

          <select value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)} style={{ marginLeft: '10px' }}>
            <option value="alle">Alle studenten</option>
            {studenten.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>

          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ marginLeft: '10px' }}>
            <option value="asc">Tijdstip: vroeg → laat</option>
            <option value="desc">Tijdstip: laat → vroeg</option>
          </select>
        </div>

        {/* Tabelweergave */}
        <div className="table-container">
          {filtered.length === 0 ? (
            <p>Geen speeddate-reserveringen gevonden.</p>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Bedrijven</th>
                  <th>Tijdstippen</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(gegroepeerd).map(([student, afspraken], i) => (
                  <tr key={i}>
                    <td>{student}</td>
                    <td>
                      {afspraken.map((a, j) => (
                        <div key={j}>{a.bedrijf}</div>
                      ))}
                    </td>
                    <td>
                      {afspraken.map((a, j) => (
                        <div key={j}>{a.tijd}</div>
                      ))}
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

export default Speeddates;
