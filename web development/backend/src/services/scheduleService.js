// Schedule service: returns gym timetable (DB or mock).
// Uses the `timetable` view for schedule data; trainers are provided by
// the joined trainer data (see `trainersService` for trainer lookups).
const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getSchedule(){
  if (process.env.USE_MOCK === '1'){
    return mock.schedule;
  }
  // Query the timetable view which has schedule data
  try{
    const [rows] = await pool.query('SELECT workout_type as name, trainer_name as trainer, time, day FROM `timetable`');
    return rows;
  }catch(err){
    return [];
  }
}

module.exports = { getSchedule };
