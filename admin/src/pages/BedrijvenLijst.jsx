import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; //  importeer dit

function BedrijvenLijst() {
  const [bedrijven, setBedrijven] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [zoekterm, setZoekterm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sector, setSector] = useState('alle');
  const [sectoren, setSectoren] = useState([]);

  const navigate = useNavigate(); // initializeer navigate

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    fetch('http://localhost:5000/api/admin/bedrijven', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setBedrijven(data);
        setFiltered(data);

        const uniekeSectoren = [...new Set(data.map(b => b.sector).filter(Boolean))];
        setSectoren(uniekeSectoren);
      })
      .catch(err => console.error('Fout bij ophalen bedrijven:', err));
  }, []);

  useEffect(() => {
    let data = [...bedrijven];

    if (zoekterm) {
      data = data.filter(b =>
        b.naam.toLowerCase().includes(zoekterm.toLowerCase())
      );
    }

    if (sector !== 'alle') {
      data = data.filter(b => b.sector === sector);
    }

    data.sort((a, b) => {
      return sortOrder === 'asc'
        ? a.naam.localeCompare(b.naam)
        : b.naam.localeCompare(a.naam);
    });

    setFiltered(data);
  }, [zoekterm, sortOrder, sector, bedrijven]);

  const handleVerwijderBedrijf = (id) => {
    const bevestig = window.confirm("Weet je zeker dat je dit bedrijf wilt verwijderen?");
    if (!bevestig) return;

    const token = localStorage.getItem('adminToken');

    fetch(`http://localhost:5000/api/admin/bedrijven/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Verwijderen mislukt');
        setBedrijven(prev => prev.filter(b => b.bedrijf_id !== id));
        alert(" Bedrijf is succesvol verwijderd.");
      })
      .catch(err => {
        console.error('Fout bij verwijderen bedrijf:', err);
        alert(" Verwijderen is mislukt. Probeer opnieuw.");
      });
  };



  return (
    <div>
      <main>
        <h1>Bedrijven</h1>

        <div className="filterbar">
          <input
            type="text"
            placeholder="Zoek op naam..."
            value={zoekterm}
            onChange={(e) => setZoekterm(e.target.value)}
            style={{ marginRight: '10px' }}
          />

          <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
            <option value="asc">Sorteer A-Z</option>
            <option value="desc">Sorteer Z-A</option>
          </select>

          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            style={{ marginLeft: '10px' }}
          >
            <option value="alle">Alle sectoren</option>
            {sectoren.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="table-container">
          {filtered.length === 0 ? (
            <p>Geen bedrijven gevonden.</p>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Naam</th>
                  <th>Sector</th>
                  <th>Email</th>
                  <th>Acties</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr
                    key={b.bedrijf_id}
                    onClick={() => navigate(`/pages/bedrijven/${b.bedrijf_id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{b.naam}</td>
                    <td>{b.sector || '-'}</td>
                    <td>{b.email}</td>
                    <td>
                      <button className='verwijder-bedrijf-student-admin'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerwijderBedrijf(b.bedrijf_id);
                        }}
                      >
                        Verwijderen
                      </button>
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

export default BedrijvenLijst;
