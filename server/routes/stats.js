const express = require('express');
const router = express.Router();
const db = require('../db');
const authAdmin = require('../middleware/adminAuth');

// Bedrijven tellen
router.get('/stats/companies', authAdmin, (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM bedrijven', (err, results) => {
    if (err) {
      console.error('Fout bij ophalen bedrijven-count:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }
    res.json({ count: results[0].count });
  });
});

// Studenten tellen
router.get('/stats/students', authAdmin, (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM gebruikers', (err, results) => {
    if (err) {
      console.error('Fout bij ophalen studenten-count:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }
    res.json({ count: results[0].count });
  });
});

// Totaal aantal speeddates (alle slots)
router.get('/stats/reservations', authAdmin, (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM speeddates', (err, results) => {
    if (err) {
      console.error('Fout bij ophalen speeddate-totaal:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }
    res.json({ count: results[0].count });
  });
});

// Aantal studenten met minstens 1 reservatie
router.get('/stats/reserved-students', authAdmin, (req, res) => {
  const sql = `
    SELECT COUNT(DISTINCT gebruiker_id) AS count
    FROM speeddates
    WHERE gebruiker_id IS NOT NULL
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fout bij ophalen gereserveerde studenten:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }
    res.json({ count: results[0].count });
  });
});

// Totaal slots + gereserveerd + beschikbaar
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
