const pool = require('../config/database');

async function registerMemberToClass(member_id, class_id){
  const tryTables = ['registrations', 'class_registrations', 'member_classes'];
  for (const t of tryTables) {
    try {
      const [result] = await pool.query(`INSERT INTO \`${t}\` (member_id, class_id) VALUES (?,?)`, [member_id, class_id]);
      return { table: t, insertId: result.insertId };
    } catch (err) {
      // try next
    }
  }
  throw new Error('Could not register - no suitable registrations table found');
}

module.exports = { registerMemberToClass };
