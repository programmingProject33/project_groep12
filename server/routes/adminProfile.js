// server/routes/adminProfile.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authAdmin = require('../middleware/adminAuth');
const db = require('../db');

// GET /api/admin/me
router.get('/me', authAdmin, (req, res) => {
  db.query(
    "SELECT id, username, first_name, last_name, email, role FROM admin_users WHERE id = ?",
    [req.admin.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Serverfout' });
      if (results.length === 0) return res.status(404).json({ message: 'Admin niet gevonden' });
      res.json(results[0]);
    }
  );
});

// PUT /api/admin/update
router.put('/update', authAdmin, (req, res) => {
  const {
    email,
    username,
    first_name,
    last_name,
    newPassword,
    confirmPassword,
    currentPassword
  } = req.body;

  // Verzamel de gewone profiel-velden
  const updates = [];
  const values  = [];
  if (email)      { updates.push("email = ?");       values.push(email); }
  if (username)   { updates.push("username = ?");    values.push(username); }
  if (first_name) { updates.push("first_name = ?");  values.push(first_name); }
  if (last_name)  { updates.push("last_name = ?");   values.push(last_name); }

  // Bepaal of er een wachtwoordwijziging wordt gevraagd
  const wantsPassword = Boolean(newPassword || confirmPassword);

  // Huidig wachtwoord altijd verplicht
  if (!currentPassword) {
    return res.status(400).json({ message: 'Huidig wachtwoord is verplicht' });
  }

  // Haal de hash uit de database en vergelijk
  db.query(
    "SELECT password_hash FROM admin_users WHERE id = ?",
    [req.admin.id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).json({ message: 'Fout bij ophalen wachtwoord' });
      }
      const hashed = results[0].password_hash;

      bcrypt.compare(currentPassword, hashed, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).json({ message: 'Huidig wachtwoord is onjuist' });
        }

        // Als er ook echt om een nieuw wachtwoord gevraagd wordt:
        if (wantsPassword) {
          // Check: alle drie de velden aanwezig?
          if (!newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Alle wachtwoordvelden zijn verplicht' });
          }
          // Check: nieuw en bevestiging gelijk?
          if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Nieuwe wachtwoorden komen niet overeen' });
          }
          // Hash en voeg toe aan de updates
          bcrypt.hash(newPassword, 10, (err, newHash) => {
            if (err) {
              return res.status(500).json({ message: 'Fout bij hashen nieuw wachtwoord' });
            }
            updates.push("password_hash = ?");
            values.push(newHash);
            finishUpdate();
          });

        } else {
          // Alleen de gewone profiel-velden wijzigen
          finishUpdate();
        }

        // Helper om de uiteindelijke UPDATE uit te voeren
        function finishUpdate() {
          if (updates.length === 0) {
            return res.status(400).json({ message: 'Geen wijzigingen opgegeven' });
          }
          values.push(req.admin.id);
          const sql = `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`;
          db.query(sql, values, (err) => {
            if (err) {
              return res.status(500).json({ message: 'Fout bij bijwerken profiel' });
            }
            res.json({ message: 'Profiel succesvol bijgewerkt' });
          });
        }
      });
    }
  );
});

module.exports = router;
