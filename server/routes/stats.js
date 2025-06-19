// server/routes/stats.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authAdmin = require('../middleware/adminAuth');

// GET /api/admin/stats/companies
// Geeft totaal aantal bedrijven terug
router.get('/admin/stats/companies', authAdmin, (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM bedrijven', (err, results) => {
    if (err) {
      console.error('Fout bij ophalen bedrijven-count:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }
    res.json({ count: results[0].count });
  });
});

// GET /api/admin/stats/students
// Geeft totaal aantal studenten en alumni terug
router.get('/admin/stats/students', authAdmin, (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM gebruikers', (err, results) => {
    if (err) {
      console.error('Fout bij ophalen studenten-count:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }
    res.json({ count: results[0].count });
  });
});

// GET /api/admin/stats/reservations
// Geeft totaal aantal speeddate-reserveringen terug
router.get('/admin/stats/reservations', authAdmin, (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM speeddate_reservations', (err, results) => {
    if (err) {
      console.error('Fout bij ophalen reserveringen-count:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }
    res.json({ count: results[0].count });
  });
});

// GET /api/admin/stats/questions
// Geeft totaal aantal binnengekomen vragen terug
router.get('/admin/stats/questions', authAdmin, (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM user_questions', (err, results) => {
    if (err) {
      console.error('Fout bij ophalen vragen-count:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }
    res.json({ count: results[0].count });
  });
});

module.exports = router;
