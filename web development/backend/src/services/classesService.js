const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getClasses(limit = 200){
  if(process.env.USE_MOCK === '1'){
    // Return name, duration and intensity from mock data
    return mock.classes.slice(0, limit).map(c => ({
      name: c.name,
      duration: c.duration,
      intensity: c.intensity !== undefined ? c.intensity : null
    }));
  }
  try{
    // Select name, duration and intensity from workout table
    const [rows] = await pool.query(
      'SELECT workout_type AS name, duration, intensity FROM `workout` LIMIT ?',
      [limit]
    );
    return rows.map(r => ({ name: r.name, duration: r.duration, intensity: r.intensity }));
  }catch(err){
    return [];
  }
}

module.exports = { getClasses };
