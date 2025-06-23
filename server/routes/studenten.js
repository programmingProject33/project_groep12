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

// DELETE /api/admin/studenten/:id
router.delete('/studenten/:id', adminAuth, (req, res) => {
  const { id } = req.params;
  console.log("Verzoek tot verwijderen student met ID:", id);

  db.query('DELETE FROM gebruikers WHERE gebruiker_id = ?', [id], (err, result) => {
    if (err) {
      console.error("Databasefout bij verwijderen:", err);
      return res.status(500).json({ error: 'Serverfout bij verwijderen student' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student niet gevonden' });
    }

    res.status(200).json({ message: 'Student verwijderd' });
  });
});



module.exports = router;