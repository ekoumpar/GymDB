const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getSchedule(){
  if (process.env.USE_MOCK === '1'){
    return mock.schedule;
  }
  // Best-effort: try to build schedule from classes table grouped by day/time
  try{
    const [rows] = await pool.query('SELECT id, name, trainer, time, day, location FROM `classes`');
    // If classes table doesn't include day/time fields, return raw rows
    return rows;
  }catch(err){
    return [];
  }
}

module.exports = { getSchedule };
