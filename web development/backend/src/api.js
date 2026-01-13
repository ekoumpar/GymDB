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
  try{
    const body = req.body || {};
    const member_id = body.member_id;
    if(!member_id) return res.status(400).json({ error: 'member_id required' });

    // Accept: reservation_id OR (workout && day && time) OR legacy class_id
    const reservation_id = body.reservation_id || body.class_id;
    const workout = body.workout || body.workout_type || body.name || body.class_id;
    const day = body.day;
    const time = body.time;

    // helper to insert into memberreserves
    async function insertMemberReserve(memId, resId){
      try{
        await pool.query('INSERT INTO `memberreserves` (member_id, reservation_id) VALUES (?,?)', [memId, resId]);
        return res.json({ table: 'memberreserves', reservation_id: resId });
      }catch(err){
        if(err && err.code === 'ER_DUP_ENTRY'){
          return res.status(409).json({ error: 'You already booked this class' });
        }
        throw err;
      }
    }

    if(reservation_id){
      const [rows] = await pool.query('SELECT reservation_id FROM `reservation` WHERE reservation_id = ? LIMIT 1', [reservation_id]);
      if(rows && rows.length) return insertMemberReserve(member_id, rows[0].reservation_id);
      // If not found, assume it's a new reservation id — attempt to use it
      try{
        await pool.query('INSERT INTO `reservation` (reservation_id, day, time, status, workout_type) VALUES (?,?,?,?,?)', [reservation_id, day||'Monday', time||'00:00', 'NotAttended', workout||'Weights']);
        return insertMemberReserve(member_id, reservation_id);
      }catch(err){
        if(err && err.code === 'ER_DUP_ENTRY'){
          // race, try to insert reserve again
          return insertMemberReserve(member_id, reservation_id);
        }
        throw err;
      }
    }

    if(workout && day && time){
      const [rows] = await pool.query('SELECT reservation_id FROM `reservation` WHERE workout_type = ? AND day = ? AND time = ? LIMIT 1', [workout, day, time]);
      if(rows && rows.length) return insertMemberReserve(member_id, rows[0].reservation_id);
      // create a new reservation with a unique 3-char id
      function genId(){
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let s = '';
        for(let i=0;i<3;i++) s += chars[Math.floor(Math.random()*chars.length)];
        return s;
      }
      let newId;
      for(let attempt=0; attempt<20; attempt++){
        newId = genId();
        try{
          await pool.query('INSERT INTO `reservation` (reservation_id, day, time, status, workout_type) VALUES (?,?,?,?,?)', [newId, day, time, 'NotAttended', workout]);
          return insertMemberReserve(member_id, newId);
        }catch(err){
          if(err && err.code === 'ER_DUP_ENTRY') continue;
          throw err;
        }
      }
      return res.status(500).json({ error: 'Could not create unique reservation id' });
    }

    return res.status(400).json({ error: 'Provide reservation_id OR class_id OR workout+day+time' });
  }catch(err){
    console.error('register error', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

module.exports = router;
