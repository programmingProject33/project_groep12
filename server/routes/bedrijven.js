const express = require('express');
const router = express.Router();
const db = require('../db');

//  Alle bedrijven ophalen (publiek, geen authenticatie nodig)
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
      console.error('Fout bij ophalen bedrijven:', err);
      return res.status(500).json({ message: 'Databasefout' });
    }
    
    // Converteer de komma-gescheiden string van dienstverbanden naar een array
    const bedrijven = results.map(bedrijf => ({
      ...bedrijf,
      dienstverbanden: bedrijf.dienstverbanden ? bedrijf.dienstverbanden.split(', ') : []
    }));

    res.json(bedrijven);
  });
});

//  Eén specifiek bedrijf ophalen via ID (ook publiek)
router.get('/:id', (req, res) => {
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

router.delete('/bedrijven/:id', adminAuth, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM bedrijven WHERE bedrijf_id = ?', [id], (err, result) => {
    if (err) {
      console.error('Fout bij verwijderen bedrijf:', err);
      return res.status(500).json({ error: 'Serverfout bij verwijderen bedrijf' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }

    res.status(200).json({ message: 'Bedrijf verwijderd' });
  });
});


module.exports = router;
