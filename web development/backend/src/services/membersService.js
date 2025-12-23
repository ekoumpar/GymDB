const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getMembers(limit = 200){
  if(process.env.USE_MOCK === '1'){
    return mock.members.slice(0, limit);
  }
  const [rows] = await pool.query('SELECT * FROM `members` LIMIT ?', [limit]);
  return rows;
}

async function addMember(data){
  if(process.env.USE_MOCK === '1'){
    const id = `m${Date.now()}`;
    const member = { id, name: data.name || data.username || 'Guest', email: data.email || '' };
    mock.members.push(member);
    return { insertId: id };
  }
  const keys = Object.keys(data).filter(k=>/^[A-Za-z0-9_]+$/.test(k));
  if (!keys.length) throw new Error('No valid fields provided');
  const cols = keys.map(k=>`\`${k}\``).join(',');
  const placeholders = keys.map(()=>'?').join(',');
  const values = keys.map(k=>data[k]);
  const [result] = await pool.query(`INSERT INTO ` + '`members`' + ` (${cols}) VALUES (${placeholders})`, values);
  return { insertId: result.insertId };
}

module.exports = { getMembers, addMember };
