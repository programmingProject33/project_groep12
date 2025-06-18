// server/routes/adminLogin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { body, validationResult } = require('express-validator');

// Controleert validatieresultaten en stuurt fouten terug
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// POST /api/admin/login
// Logt de admin in op basis van gebruikersnaam en wachtwoord
router.post(
  '/login',
  // Sanitize en valideer inputs
  body('username')
    .trim()
    .isAlphanumeric().withMessage('Gebruikersnaam mag alleen letters en cijfers bevatten')
    .isLength({ min: 3, max: 20 }).withMessage('Gebruikersnaam moet tussen 3 en 20 tekens zijn'),
  body('password')
    .isLength({ min: 8 }).withMessage('Wachtwoord moet minstens 8 tekens bevatten'),
  handleValidation,
  (req, res) => {
    const { username, password } = req.body;

    // Ophalen van admin-gebruiker
    db.query(
      'SELECT id, username, password_hash, role FROM admin_users WHERE username = ?',
      [username],
      (err, results) => {
        if (err) {
          console.error('Databasefout bij login:', err);
          return res.status(500).json({ message: 'Serverfout' });
        }
        if (results.length === 0) {
          return res.status(401).json({ message: 'Ongeldige gebruikersnaam of wachtwoord' });
        }

        const admin = results[0];
        // Vergelijk wachtwoord met gehashte waarde
        bcrypt.compare(password, admin.password_hash, (err, isMatch) => {
          if (err) {
            console.error('Fout bij wachtwoordcontrole:', err);
            return res.status(500).json({ message: 'Serverfout bij wachtwoordcontrole' });
          }
          if (!isMatch) {
            return res.status(401).json({ message: 'Wachtwoord klopt niet' });
          }

          // Genereer JWT met rol en gebruikersinfo
          const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
          );

          // Verstuur token
          res.json({ token });
        });
      }
    );
  }
);

module.exports = router;
