const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const mock = require('../utils/mockData');

// Table creation is handled by the SQL dump / DB migration. No runtime creation here.

async function registerUser(username, password, details = {}){
  if(process.env.USE_MOCK === '1'){
    // generate sequential mock member id: prefer numeric ids when existing ids are numeric
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
    const user = { id, name: username, password, dateOfBirth: details.dateOfBirth || '2000-01-01', sex: details.sex || 'M', phoneNumber: details.phoneNumber || '', height: details.height || 0, weight: details.weight || 0 };
    mock.members.push(user);
    return { id, username };
  }
  // table assumed present from DB dump/migrations
  const hash = await bcrypt.hash(password, 10);
  const { dateOfBirth = '2000-01-01', sex = 'M', phoneNumber = '', height = 0, weight = 0 } = details;
  const [result] = await pool.query(
    'INSERT INTO `member` (name, date_of_birth, sex, phone_number, height, weight, password) VALUES (?,?,?,?,?,?,?)',
    [username, dateOfBirth, sex, phoneNumber, parseFloat(height) || 0, parseFloat(weight) || 0, hash]
  );
  return { id: result.insertId, username };
}

async function loginUser(username, password){
  if(process.env.USE_MOCK === '1'){
    // login by name against mock.members
    const lookup = String(username || '').toLowerCase();
    const user = mock.members.find(u => (u.name && u.name.toLowerCase() === lookup) || String(u.id) === String(username));
    if(!user) throw new Error('Invalid credentials');
    if(user.password && user.password !== password) throw new Error('Invalid credentials');
    return { id: user.id, username: user.name, name: user.name, dateOfBirth: user.dateOfBirth, sex: user.sex, phoneNumber: user.phoneNumber, height: user.height, weight: user.weight };
  }
  const [rows] = await pool.query('SELECT member_id as id, name as username, password, date_of_birth, sex, phone_number, height, weight FROM `member` WHERE name = ? ORDER BY member_id DESC LIMIT 1', [username]);
  const user = rows[0];
  if(!user) throw new Error('Invalid credentials');

  const stored = user.password || '';
  let ok = false;

  if(stored.startsWith('$2')){
    // stored password is bcrypt hash
    ok = await bcrypt.compare(password, stored);
  } else {
    // fallback: stored password is plaintext from dump — accept it and upgrade to bcrypt
    if(stored === password){
      ok = true;
      try{
        const newHash = await bcrypt.hash(password, 10);
        await pool.query('UPDATE `member` SET password = ? WHERE member_id = ?', [newHash, user.id]);
      }catch(e){
        // ignore upgrade errors, but allow login
      }
    }
  }
  if(!ok) throw new Error('Invalid credentials');
  return {
    id: user.id,
    username: user.username,
    name: user.username,
    dateOfBirth: user.date_of_birth,
    sex: user.sex,
    phoneNumber: user.phone_number,
    height: user.height,
    weight: user.weight
  };
}

module.exports = { registerUser, loginUser };
