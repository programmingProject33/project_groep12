const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth'); // ✅ importeer middleware
const db = require('../db');


// ✅ Beschermde route
router.get('/bedrijven', adminAuth, (req, res) => {
  db.query('SELECT * FROM bedrijven', (err, results) => {
    if (err) return res.status(500).json({ message: 'Databasefout' });
    res.json(results);
  });
});

module.exports = router;
