const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, param, validationResult } = require('express-validator');
const db = require('../db');
const authAdmin = require('../middleware/adminAuth');
const superAdmin = require('../middleware/superAdmin');

// Validatie helper
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Profiel van ingelogde admin
router.get('/me', authAdmin, (req, res) => {
  const sql = `SELECT id, username, first_name, last_name, email, role, created_at FROM admin_users WHERE id = ?`;
  db.query(sql, [req.admin.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Databasefout' });
    if (results.length === 0) return res.status(404).json({ message: 'Admin niet gevonden' });
    res.json(results[0]);
  });
});

// Alle admins ophalen
router.get('/admins', authAdmin, (req, res) => {
  const sql = `SELECT id, username, first_name, last_name, email, role, created_at FROM admin_users ORDER BY created_at DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Databasefout' });
    res.json(results);
  });
});

// Detailweergave van een admin
router.get('/admins/:id', authAdmin, (req, res) => {
  const sql = `SELECT id, username, first_name, last_name, email, role, created_at FROM admin_users WHERE id = ?`;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Databasefout' });
    if (results.length === 0) return res.status(404).json({ message: 'Admin niet gevonden' });
    res.json(results[0]);
  });
});


// Nieuwe admin aanmaken (alleen voor superadmin)
router.post('/admins', authAdmin, superAdmin,
  body('username').trim().isAlphanumeric().isLength({ min: 3, max: 20 }),
  body('first_name').trim().escape().optional({ nullable: true }),
  body('last_name').trim().escape().optional({ nullable: true }),
  body('email').trim().isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/\d/),
  handleValidation,
  async (req, res) => {
    const { username, first_name, last_name, email, password, role } = req.body;
    const existsSql = 'SELECT 1 FROM admin_users WHERE username = ? OR email = ?';
    db.query(existsSql, [username, email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Databasefout' });
      if (results.length) return res.status(409).json({ message: 'Gebruikersnaam of e-mail al in gebruik' });

      const hash = await bcrypt.hash(password, 10);
      const insertSql = `INSERT INTO admin_users (username, first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, 'admin')`;
      db.query(insertSql, [username, first_name || null, last_name || null, email, hash, role], (err) => {
        if (err) return res.status(500).json({ message: 'Fout bij aanmaken admin' });
        res.status(201).json({ message: 'Admin succesvol aangemaakt' });
      });
    });
  }
);

// Admin verwijderen (alleen superadmin)
router.delete('/admins/:id', authAdmin, superAdmin, param('id').isInt(), handleValidation, (req, res) => {
  const targetId = parseInt(req.params.id, 10);
  if (targetId === req.admin.id) {
    return res.status(400).json({ message: 'Je kunt jezelf niet verwijderen' });
  }
  db.query('DELETE FROM admin_users WHERE id = ?', [targetId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Databasefout' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Admin niet gevonden' });
    res.json({ message: 'Admin succesvol verwijderd' });
  });
});

module.exports = router;
