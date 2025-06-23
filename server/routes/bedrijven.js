const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const db = require('../db');

// In dit bestand blijven alleen de admin-specifieke routes over.
// De publieke GET-routes zijn verplaatst naar 'publicBedrijven.js'.

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