const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth'); //  importeer middleware
const db = require('../db');


//  Beschermde route
router.get('/studenten', adminAuth, (req, res) => {
  db.query('SELECT * FROM gebruikers', (err, results) => {
    if (err) return res.status(500).json({ message: 'Databasefout' });
    res.json(results);
  });
});

module.exports = router;