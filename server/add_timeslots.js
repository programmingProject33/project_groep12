const db = require('./db');

// Genereer tijdsloten van 10 min tussen 10:00-13:00 en 14:00-18:00
const generateTimeslots = (date) => {
  const slots = [];
  // Ochtend: 10:00 - 13:00
  for (let hour = 10; hour < 13; hour++) {
    for (let min = 0; min < 60; min += 10) {
      const start = new Date(date);
      start.setHours(hour, min, 0, 0);
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + 10);
      slots.push({ starttijd: start, eindtijd: end });
    }
  }
  // Middag: 14:00 - 18:00
  for (let hour = 14; hour < 18; hour++) {
    for (let min = 0; min < 60; min += 10) {
      const start = new Date(date);
      start.setHours(hour, min, 0, 0);
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + 10);
      slots.push({ starttijd: start, eindtijd: end });
    }
  }
  return slots;
};

async function addTimeslotsForAllCompanies() {
  try {
    // Haal alle bedrijven op met bedrijf_id
    const [bedrijven] = await db.promise().query('SELECT bedrijf_id FROM bedrijven');
    if (!bedrijven.length) {
      console.log('Geen bedrijven gevonden.');
      return;
    }
    // Stel de dag in waarop de speeddates plaatsvinden (pas aan indien nodig)
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    for (const bedrijf of bedrijven) {
      // Controleer of er al tijdsloten zijn voor dit bedrijf
      const [bestaande] = await db.promise().query('SELECT COUNT(*) as aantal FROM speeddates WHERE bedrijf_id = ?', [bedrijf.bedrijf_id]);
      if (bestaande[0].aantal > 0) {
        console.log(`Bedrijf_id ${bedrijf.bedrijf_id} heeft al tijdsloten, overslaan.`);
        continue;
      }
      const slots = generateTimeslots(date);
      for (const slot of slots) {
        await db.promise().query(
          'INSERT INTO speeddates (bedrijf_id, starttijd, eindtijd, is_bezet) VALUES (?, ?, ?, 0)',
          [bedrijf.bedrijf_id, slot.starttijd.toISOString().slice(0, 19).replace('T', ' '), slot.eindtijd.toISOString().slice(0, 19).replace('T', ' ')]
        );
      }
      console.log(`Tijdsloten toegevoegd voor bedrijf_id: ${bedrijf.bedrijf_id}`);
    }
    console.log('Alle tijdsloten toegevoegd!');
    process.exit(0);
  } catch (err) {
    console.error('Fout bij toevoegen tijdsloten:', err);
    process.exit(1);
  }
}

addTimeslotsForAllCompanies(); 