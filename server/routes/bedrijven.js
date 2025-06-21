const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth'); // ✅ importeer middleware
const db = require('../db');

// Publieke route voor studenten om bedrijven op te halen
router.get('/', (req, res) => {
  db.query('SELECT * FROM bedrijven WHERE is_verified = TRUE', (err, results) => {
    if (err) return res.status(500).json({ message: 'Databasefout' });
    res.json(results);
  });
});

// Admin route (beschermd)
router.get('/admin', adminAuth, (req, res) => {
  db.query('SELECT * FROM bedrijven', (err, results) => {
    if (err) return res.status(500).json({ message: 'Databasefout' });
    res.json(results);
  });
});

module.exports = router;
