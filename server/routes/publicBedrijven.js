const express = require('express');
const router = express.Router();
const db = require('../db');

// Alle geverifieerde bedrijven ophalen voor het publiek
router.get('/', (req, res) => {
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
    ORDER BY
      b.naam ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Fout bij ophalen van publieke bedrijven:', err);
      return res.status(500).json({ message: 'Serverfout bij ophalen van bedrijven.' });
    }

    // Converteer de komma-gescheiden string van dienstverbanden naar een array
    const bedrijven = results.map(bedrijf => ({
      ...bedrijf,
      dienstverbanden: bedrijf.dienstverbanden ? bedrijf.dienstverbanden.split(', ') : []
    }));

    res.json(bedrijven);
  });
});

// Eén specifiek bedrijf ophalen via ID (ook publiek)
router.get('/:id', (req, res) => {
  const { id } = req.params;
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
      b.bedrijf_id = ? AND b.is_verified = TRUE
    GROUP BY
      b.bedrijf_id
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(`Fout bij ophalen van publiek bedrijf ${id}:`, err);
      return res.status(500).json({ message: 'Serverfout.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Bedrijf niet gevonden of niet geverifieerd.' });
    }

    const bedrijf = results[0];
    bedrijf.dienstverbanden = bedrijf.dienstverbanden ? bedrijf.dienstverbanden.split(', ') : [];

    res.json(bedrijf);
  });
});

module.exports = router; 