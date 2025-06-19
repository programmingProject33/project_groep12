// server/routes/adminProfile.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authAdmin = require('../middleware/adminAuth');
const db = require('../db');

// GET /api/admin/me
// Haalt de profielgegevens van de huidige admin op
router.get('/me', authAdmin, (req, res) => {
  db.query(
    "SELECT id, username, first_name, last_name, email FROM admin_users WHERE id = ?",
    [req.admin.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Serverfout' });
      if (results.length === 0) return res.status(404).json({ message: 'Admin niet gevonden' });

      res.json(results[0]);
    }
  );
});

// PUT /api/admin/update
// Werkt profielgegevens bij, en wachtwoord indien opgegeven en bevestigd
router.put('/update', authAdmin, (req, res) => {
  const { email, username, first_name, last_name, newPassword, confirmPassword, currentPassword } = req.body;

  const updates = [];
  const values = [];

  if (email) {
    updates.push("email = ?");
    values.push(email);
  }

  if (username) {
    updates.push("username = ?");
    values.push(username);
  }

  if (first_name) {
    updates.push("first_name = ?");
    values.push(first_name);
  }

  if (last_name) {
    updates.push("last_name = ?");
    values.push(last_name);
  }

  const finishUpdate = () => {
    if (updates.length === 0) {
      return res.status(400).json({ message: 'Geen wijzigingen opgegeven' });
    }

    values.push(req.admin.id);
    const query = `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`;

    db.query(query, values, (err) => {
      if (err) return res.status(500).json({ message: 'Fout bij bijwerken' });
      res.json({ message: 'Profiel succesvol bijgewerkt' });
    });
  };

  // Als wachtwoordwijziging wordt aangevraagd
  if (newPassword || confirmPassword || currentPassword) {
    if (!newPassword || !confirmPassword || !currentPassword) {
      return res.status(400).json({ message: 'Alle wachtwoordvelden zijn verplicht' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Nieuwe wachtwoorden komen niet overeen' });
    }

    // Haal huidig wachtwoord op uit database
    db.query("SELECT password_hash FROM admin_users WHERE id = ?", [req.admin.id], (err, results) => {
      if (err || results.length === 0) return res.status(500).json({ message: 'Fout bij ophalen wachtwoord' });

      const hashedPassword = results[0].password_hash;

      // Vergelijk huidig wachtwoord
      bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
        if (!isMatch) return res.status(401).json({ message: 'Huidig wachtwoord is onjuist' });

        // Hash het nieuwe wachtwoord en update
        bcrypt.hash(newPassword, 10, (err, hashed) => {
          if (err) return res.status(500).json({ message: 'Fout bij wachtwoord hashen' });

          updates.push("password_hash = ?");
          values.push(hashed);

          finishUpdate();
        });
      });
    });
  } else {
    finishUpdate();
  }
});

module.exports = router;
