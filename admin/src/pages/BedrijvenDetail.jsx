import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function BedrijfDetail() {
  const { id } = useParams();
  const [bedrijf, setBedrijf] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    fetch(`http://localhost:5000/api/admin/bedrijven/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
    })
      .then(res => res.json())
      .then(data => setBedrijf(data))
      .catch(err => console.error('Fout bij ophalen bedrijf:', err));
  }, [id]);

   
  

  if (!bedrijf) return <p>Bezig met laden...</p>;

  return (
    <div >
     
      <h1>{bedrijf.naam}</h1>
      

      <div className="bedrijf-deteail-columns">
        {/* Linkerkolom - Bedrijfsinfo */}
        <div className="top-columns">
        <div className="col">
            <h2>bedrijfsgegevens</h2>
          <p><span className="label">Bedrijfsnaam:</span> {bedrijf.naam}</p>
          <p><span className="label">BTW-nummer:</span> {bedrijf.BTW_nr}</p>
          <p><span className="label">Email:</span> {bedrijf.email}</p>
          <p><span className="label">Telefoon:</span> {bedrijf.telefoon_nr}</p>
          <p><span className="label">Adres:</span> {bedrijf.straatnaam} {bedrijf.huis_nr} {bedrijf.bus_nr}, {bedrijf.postcode} {bedrijf.gemeente}</p>
          <p><span className="label">Sector:</span> {bedrijf.sector}</p>
          <p><span className="label">Aangemaakt op:</span> {new Date(bedrijf.created_at).toLocaleDateString()}</p>
        </div>

        {/* Rechterkolom - Contactpersoon */}
        <div className="col">
            <h2>Contactpersoon</h2>

          <p><span className="label">Naam:</span> {bedrijf.contact_voornaam} {bedrijf.contact_naam}</p>
          <p><span className="label">Specialisatie:</span> {bedrijf.contact_specialisatie}</p>
          <p><span className="label">E-mailadres:</span> {bedrijf.contact_email}</p>
          <p><span className="label">Telefoon:</span> {bedrijf.contact_telefoon}</p>
        
     </div>
     </div>
        {/* Careerlaunch gegevens */}
         <div className="bottom-column">
         <h2>Careerlaunch gegevens</h2>
         <p><span className="label">Aantal vertegenwoordigers:</span> {bedrijf.number_of_representatives}</p>
         <p><span className="label">Verdieping / lokaal:</span> {bedrijf.verdieping} / {bedrijf.lokaal}</p>
         <p><span className="label">Beschrijving:</span> <br />{bedrijf.beschrijving}</p>
         <p><span className="label">Gezochte opleidingen:</span> <br />{bedrijf.gezochte_opleidingen}</p>
          <p><span className="label">Gezocht profiel:</span> <br />{bedrijf.gezocht_profiel_omschrijving}</p>
         </div>
      </div>
    </div>
  );
  
}

export default BedrijfDetail;
