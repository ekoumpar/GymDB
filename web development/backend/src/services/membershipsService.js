const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getMemberships(){
  if(process.env.USE_MOCK === '1') return mock.memberships;
  // Query subscription table for memberships
  try{
    const [rows] = await pool.query('SELECT DISTINCT subscription_name AS name, price, duration, category FROM `subscription`');
    // Map DB rows into the frontend shape: { name, price, duration, category, perks }
    if(rows && rows.length) return rows.map(r => ({
      name: r.name,
      price: r.price ? `€${r.price}` : 'TBA',
      duration: r.duration,
      category: r.category,
      perks: []
    }));
    return mock.memberships;
  }catch(err){
    return mock.memberships;
  }
}

module.exports = { getMemberships };
