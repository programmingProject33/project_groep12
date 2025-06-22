const express = require('express');
const router = express.Router();
const db = require('../db');
const authAdmin = require('../middleware/adminAuth');

// GET /api/admin/speeddates
// Haalt alle speeddate-reserveringen op, met optionele filtering en sortering
router.get('/speeddates', authAdmin, (req, res) => {
  const { bedrijven, studenten, soort } = req.query;
  let conditions = [];
  let values = [];

  // Filter op bedrijfsnaam
  if (bedrijven) {
    conditions.push('b.naam LIKE ?');
    values.push(`%${bedrijven}%`);
  }

  // Filter op studentnaam
  if (studenten) {
    conditions.push('CONCAT(s.voornaam, " ", s.naam) LIKE ?');
    values.push(`%${studenten}%`);
  }

  // Basis SQL-query met joins
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

  // WHERE-clausules toevoegen indien nodig
  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  // Sorteer op tijd
  if (soort === 'time_desc') {
    sql += ' ORDER BY r.starttijd DESC, r.eindtijd DESC';
  } else {
    sql += ' ORDER BY r.starttijd ASC, r.eindtijd ASC';
  }

  // Query uitvoeren
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Fout bij ophalen speeddates:', err);
      return res.status(500).json({ message: 'Serverfout bij ophalen speeddates' });
    }
    res.json(results);
  });
});

module.exports = router;
