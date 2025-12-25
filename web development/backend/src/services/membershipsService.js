const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getMemberships(){
  if(process.env.USE_MOCK === '1') return mock.memberships;
  // Query subscription table for memberships
  try{
    const [rows] = await pool.query('SELECT DISTINCT subscription_type as name, price FROM `subscription`');
    return rows.length > 0 ? rows : mock.memberships;
  }catch(err){
    return mock.memberships;
  }
}

module.exports = { getMemberships };
