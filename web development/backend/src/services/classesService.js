const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getClasses(limit = 200){
  if(process.env.USE_MOCK === '1'){
    return mock.classes.slice(0, limit);
  }
  const [rows] = await pool.query('SELECT * FROM `classes` LIMIT ?', [limit]);
  return rows;
}

module.exports = { getClasses };
