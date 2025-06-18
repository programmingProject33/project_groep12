const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, param, validationResult } = require('express-validator');
const db = require('../db');
const authAdmin = require('../middleware/adminAuth');
const superAdmin = require('../middleware/superAdmin');

// Helper: check validation results
function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

// POST /api/admin/admins
// Maakt een nieuwe admin aan
router.get('/me', authAdmin, (req, res) => {
  const sql = `SELECT id, username, first_name, last_name, email, role, created_at FROM admin_users WHERE id = ?`;
  db.query(sql, [req.admin.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Databasefout' });
    if (results.length === 0) return res.status(404).json({ message: 'Admin niet gevonden' });
    res.json(results[0]);
  });
});

  
router.post(
    '/admins',
    authAdmin,
    // Valideer en saniteer input
    body('username')
        .trim()
        .isAlphanumeric().withMessage('Gebruikersnaam moet letters en cijfers bevatten')
        .isLength({ min: 3, max: 20 }).withMessage('Gebruikersnaam tussen 3 en 20 tekens'),
    body('first_name').trim().escape().optional({ nullable: true }),
    body('last_name').trim().escape().optional({ nullable: true }),
    body('email').trim().isEmail().withMessage('Ongeldig e-mailformaat').normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Wachtwoord minstens 8 tekens')
        .matches(/\d/).withMessage('Wachtwoord moet een cijfer bevatten'),
    handleValidation,
    async (req, res) => {
        const { username, first_name, last_name, email, password } = req.body;

        // Controleer of gebruikersnaam of e-mail al in gebruik is
        const existsSql = 'SELECT 1 FROM admin_users WHERE username = ? OR email = ?';
        db.query(existsSql, [username, email], async (err, results) => {
            if (err) return res.status(500).json({ message: 'Databasefout' });
            if (results.length) {
                return res.status(409).json({ message: 'Gebruikersnaam of e-mail al in gebruik' });
            }

            // Hash wachtwoord
            const hash = await bcrypt.hash(password, 10);
            const insertSql = `
        INSERT INTO admin_users (username, first_name, last_name, email, password_hash, role)
        VALUES (?, ?, ?, ?, ?, 'admin')
      `;
            db.query(
                insertSql,
                [username, first_name || null, last_name || null, email, hash],
                (err) => {
                    if (err) return res.status(500).json({ message: 'Fout bij aanmaken admin' });
                    res.status(201).json({ message: 'Admin succesvol aangemaakt' });
                }
            );
        });
    }
);

// GET /api/admin/admins
// Haalt overzicht op van alle admins (zonder wachtwoord-velden)
router.get('/admins', authAdmin, (req, res) => {
    const sql = `
    SELECT id, username, first_name, last_name, email, created_at
    FROM admin_users
    ORDER BY created_at DESC
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Databasefout' });
        res.json(results);
    });
});

// GET /api/admin/admins/:id
// Haalt detail van één admin op (zonder wachtwoord)
router.get(
    '/admins/:id',
    authAdmin,
    param('id').isInt().withMessage('Ongeldig admin ID'),
    handleValidation,
    (req, res) => {
        const sql = `
      SELECT id, username, first_name, last_name, email, created_at
      FROM admin_users
      WHERE id = ?
    `;
        db.query(sql, [req.params.id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Databasefout' });
            if (results.length === 0) {
                return res.status(404).json({ message: 'Admin niet gevonden' });
            }
            res.json(results[0]);
        });
    }
);


// DELETE /api/admin/admins/:id
// Verwijdert een admin (alleen voor superadmin)
router.delete(
  '/admins/:id',
  authAdmin,
  superAdmin,
  param('id').isInt().withMessage('Ongeldig admin ID'),
  handleValidation,
  (req, res) => {
    const targetId = parseInt(req.params.id, 10);

    // voorkom dat superadmin zichzelf verwijdert
    if (targetId === req.admin.id) {
      return res.status(400).json({ message: 'Je kunt jezelf niet verwijderen' });
    }

    // verwijder de admin
    db.query('DELETE FROM admin_users WHERE id = ?', [targetId], (err, result) => {
      if (err) {
        console.error('Fout bij verwijderen admin:', err);
        return res.status(500).json({ message: 'Serverfout' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Admin niet gevonden' });
      }
      res.json({ message: 'Admin succesvol verwijderd' });
    });
  }
);




module.exports = router;
