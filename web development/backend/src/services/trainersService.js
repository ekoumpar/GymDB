const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getTrainers(limit = 200){
  if(process.env.USE_MOCK === '1'){
    return mock.trainers.slice(0, limit);
  }
  const [rows] = await pool.query('SELECT * FROM `trainers` LIMIT ?', [limit]);
  return rows;
}

module.exports = { getTrainers };
