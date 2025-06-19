// server/routes/speeddates.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authAdmin = require('../middleware/adminAuth');

// GET /api/admin/speeddates
// Haalt speeddate-reserveringen op, met optionele filtering en sortering
// Query-parameters: company (naam), student (naam), sort (time_asc of time_desc)
router.get('/speeddates', authAdmin, (req, res) => {
  const { bedrijven, studenten, soort } = req.query;
  let conditions = [];
  let values = [];

  // Voeg filter op bedrijfsnaam toe indien meegegeven
  if (bedrijven) {
    conditions.push('b.naam LIKE ?');
    values.push(`%${bedrijven}%`);
  }

  // Voeg filter op studentnaam toe indien meegegeven
  if (studenten) {
    conditions.push('CONCAT(s.voornaam, " ", s.naam) LIKE ?');
    values.push(`%${studenten}%`);
  }

  // Basis SQL met joins naar studenten en bedrijven
  let sql = `
    SELECT 
      r.speed_id,
      s.voornaam AS student_voornaam,
      s.naam AS student_naam,
      b.naam AS bedrijf_naam,
      r.starttijd,
      r.eindtijd
    FROM speeddates r
    JOIN gebruikers s ON r.gebruiker_id = s.gebruiker_id
    JOIN bedrijven b ON r.bedrijf_id = b.bedrijf_id
  `;

  // Voeg WHERE-clausule toe als er filters zijn
  if (conditions.length) {  
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  // Voeg ORDER BY toe
  if (soort === 'time_desc') {
    sql += ' ORDER BY r.starttijd, r.eindtijd DESC';
  } else {
    sql += ' ORDER BY r.starttijd, r.eindtijd ASC';
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Fout bij ophalen speeddates:', err);
      return res.status(500).json({ message: 'Serverfout bij ophalen speeddates' });
    }
    res.json(results);
  });
});

module.exports = router;
