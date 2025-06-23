const express = require('express');
const router = express.Router();
const db = require('../db');
const authAdmin = require('../middleware/adminAuth');

// 1. Bedrijven en hun slot-gemiddelde
router.get('/stats/bedrijven-en-slots', authAdmin, (req, res) => {
  const sql = `
    SELECT 
      COUNT(DISTINCT b.bedrijf_id) AS bedrijf_count,
      COUNT(s.speed_id) AS totaal_slots,
      ROUND(COUNT(s.speed_id) / COUNT(DISTINCT b.bedrijf_id), 2) AS gemiddeld_per_bedrijf
    FROM bedrijven b
    LEFT JOIN speeddates s ON s.bedrijf_id = b.bedrijf_id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fout bij bedrijven-en-slots:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }
    res.json(results[0]);
  });
});

// 2. Studenten & reservatie status
router.get('/stats/studenten', authAdmin, (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM gebruikers) AS student_count,
      (SELECT COUNT(DISTINCT gebruiker_id) FROM speeddates WHERE gebruiker_id IS NOT NULL) AS students_with_reservation
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fout bij stats/studenten:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }
    res.json(results[0]);
  });
});

// 3. Speeddate slot info
router.get('/stats/speeddateslots', authAdmin, (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS totaal,
      SUM(is_bezet = 1) AS gereserveerd,
      SUM(is_bezet = 0) AS beschikbaar
    FROM speeddates
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fout bij ophalen speeddateslots:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
