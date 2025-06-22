const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const db = require('../db');

// ✅ Alle bedrijven ophalen
router.get('/bedrijven', adminAuth, (req, res) => {
  db.query('SELECT * FROM bedrijven', (err, results) => {
    if (err) {
      console.error('Fout bij ophalen bedrijven:', err);
      return res.status(500).json({ message: 'Databasefout' });
    }
    res.json(results);
  });
});

// ✅ Eén specifiek bedrijf ophalen via ID
router.get('/bedrijven/:id', adminAuth, (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM bedrijven WHERE bedrijf_id = ?', [id], (err, results) => {
    if (err) {
      console.error('Fout bij ophalen bedrijf:', err);
      return res.status(500).json({ message: 'Serverfout' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Bedrijf niet gevonden' });
    }

    res.json(results[0]);
  });
});

module.exports = router;
