const pool = require('../config/database');

// Helper to validate table names (only letters, numbers, underscore)
function validTableName(name) {
  return /^[A-Za-z0-9_]+$/.test(name);
}

async function getTable(req, res, next){
  const name = req.params.name;
  if (!validTableName(name)) return res.status(400).json({ ok: false, error: 'Invalid table name' });
  try {
    const [rows] = await pool.query(`SELECT * FROM \`${name}\` LIMIT 500`);
    return res.json({ ok: true, rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTable };
