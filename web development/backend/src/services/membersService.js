// Members service: data access for member records (DB or mock).
// Performs light input sanitization and returns service-level results.
const pool = require('../config/database');
const mock = require('../utils/mockData');

// Return a list of members. Uses mock data when `USE_MOCK=1`.
async function getMembers(limit = 200){
  if(process.env.USE_MOCK === '1'){
    return mock.members.slice(0, limit).map(m => {
      const { password, ...rest } = m;
      return rest;
    });
  }
  const [rows] = await pool.query('SELECT * FROM `member` LIMIT ?', [limit]);
  return rows.map(r => {
    const { password, ...rest } = r;
    return rest;
  });
}

// Insert a new member. Supports mock insertion when `USE_MOCK=1`.
async function addMember(data){
  if(process.env.USE_MOCK === '1'){
    // generate sequential mock member id
    let maxNum = 0;
    let hasNumeric = false;
    mock.members.forEach(m => {
      const s = String(m.id || '');
      if(/^[0-9]+$/.test(s)){
        hasNumeric = true;
        const n = parseInt(s,10);
        if(!isNaN(n) && n>maxNum) maxNum = n;
      } else {
        const match = s.match(/m(\d+)$/i);
        if(match){ const n = parseInt(match[1],10); if(!isNaN(n) && n>maxNum) maxNum = n; }
      }
    });
    const next = (maxNum || 0) + 1;
    const id = hasNumeric ? next : `m${next}`;
    const member = { id, name: data.name || 'Guest' };
    mock.members.push(member);
    return { insertId: id };
  }
  // Only allow safe column names to avoid injection via field names
  const keys = Object.keys(data).filter(k=>/^[A-Za-z0-9_]+$/.test(k));
  if (!keys.length) throw new Error('No valid fields provided');
  const cols = keys.map(k=>`\`${k}\``).join(',');
  const placeholders = keys.map(()=>'?').join(',');
  const values = keys.map(k=>data[k]);
  const [result] = await pool.query(`INSERT INTO ` + '`members`' + ` (${cols}) VALUES (${placeholders})`, values);
  return { insertId: result.insertId };
}

module.exports = { getMembers, addMember };
