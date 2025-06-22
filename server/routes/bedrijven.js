const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth'); // ✅ importeer middleware
const db = require('../db');

// Publieke route voor studenten om bedrijven op te halen (inclusief dienstverbanden)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.*, 
        GROUP_CONCAT(d.naam SEPARATOR ', ') as dienstverbanden
      FROM 
        bedrijven b
      LEFT JOIN 
        bedrijf_dienstverbanden bd ON b.bedrijf_id = bd.bedrijf_id
      LEFT JOIN 
        dienstverbanden d ON bd.dienstverband_id = d.id
      WHERE 
        b.is_verified = TRUE
      GROUP BY
        b.bedrijf_id
    `;
    
    const [bedrijven] = await db.promise().query(query);

    // Converteer de komma-gescheiden string van dienstverbanden naar een array
    const results = bedrijven.map(bedrijf => ({
      ...bedrijf,
      dienstverbanden: bedrijf.dienstverbanden ? bedrijf.dienstverbanden.split(', ') : []
    }));

    res.json(results);

  } catch (err) {
    console.error('Databasefout bij ophalen bedrijven:', err);
    res.status(500).json({ message: 'Databasefout' });
  }
});

// Admin route (beschermd)
router.get('/admin', adminAuth, (req, res) => {
  db.query('SELECT * FROM bedrijven', (err, results) => {
    if (err) return res.status(500).json({ message: 'Databasefout' });
    res.json(results);
  });
});

module.exports = router;
