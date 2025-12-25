const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const mock = require('../utils/mockData');

async function ensureUsersTable(){
  await pool.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE, password VARCHAR(255), role VARCHAR(50))`);
}

async function registerUser(username, password, details = {}){
  if(process.env.USE_MOCK === '1'){
    const id = `m${Date.now()}`;
    const user = { id, username, name: username, password, ...details };
    mock.users.push(user);
    return { id, username };
  }
  await ensureUsersTable();
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
    // login by username in mock mode
    const user = mock.users.find(u=>u.username === username);
    if(!user) throw new Error('Invalid credentials');
    if(user.password && user.password !== password) throw new Error('Invalid credentials');
    return { id: user.id, username: user.username, name: user.name };
  }
  const [rows] = await pool.query('SELECT member_id as id, name as username, password, date_of_birth, sex, phone_number, height, weight FROM `member` WHERE name = ? AND password != "" ORDER BY member_id DESC LIMIT 1', [username]);
  const user = rows[0];
  if(!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password);
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
