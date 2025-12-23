const express = require('express');
const pool = require('./db');
const { generateToken, authMiddleware } = require('./auth');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Helper to validate table names (only letters, numbers, underscore)
function validTableName(name) {
  return /^[A-Za-z0-9_]+$/.test(name);
}

router.get('/table/:name', async (req, res) => {
  const name = req.params.name;
  if (!validTableName(name)) return res.status(400).json({ error: 'Invalid table name' });
  try {
    const [rows] = await pool.query(`SELECT * FROM \`${name}\` LIMIT 500`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/members', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM `members` LIMIT 200');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/trainers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM `trainers` LIMIT 200');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/classes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM `classes` LIMIT 200');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a member (generic insert using provided JSON keys) — protected
router.post('/members', authMiddleware, async (req, res) => {
  const data = req.body || {};
  const keys = Object.keys(data).filter(k=>/^[A-Za-z0-9_]+$/.test(k));
  if (!keys.length) return res.status(400).json({ error: 'No valid fields provided' });
  const cols = keys.map(k=>`\`${k}\``).join(',');
  const placeholders = keys.map(()=>'?').join(',');
  const values = keys.map(k=>data[k]);
  try {
    const [result] = await pool.query(`INSERT INTO ` + '`members`' + ` (${cols}) VALUES (${placeholders})`, values);
    res.json({ insertId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth endpoints
router.post('/auth/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    // ensure users table exists (best-effort)
    await pool.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE, password VARCHAR(255), role VARCHAR(50))`);
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO `users` (username, password) VALUES (?,?)', [username, hash]);
    const token = generateToken({ userId: result.insertId, username });
    res.json({ insertId: result.insertId, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const [rows] = await pool.query('SELECT * FROM `users` WHERE username = ? LIMIT 1', [username]);
    const user = rows[0];
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = generateToken({ userId: user.id, username: user.username });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register a member to a class - attempts to insert into `registrations` or `class_registrations` (protected)
router.post('/register', authMiddleware, async (req, res) => {
  const { member_id, class_id } = req.body || {};
  if (!member_id || !class_id) return res.status(400).json({ error: 'member_id and class_id required' });
  const tryTables = ['registrations', 'class_registrations', 'member_classes'];
  for (const t of tryTables) {
    try {
      const [result] = await pool.query(`INSERT INTO \`${t}\` (member_id, class_id) VALUES (?,?)`, [member_id, class_id]);
      return res.json({ table: t, insertId: result.insertId });
    } catch (err) {
      // try next table
    }
  }
  res.status(500).json({ error: 'Could not register - no suitable registrations table found' });
});

module.exports = router;
