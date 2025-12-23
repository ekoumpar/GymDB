const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getClasses(limit = 200){
  if(process.env.USE_MOCK === '1'){
    return mock.classes.slice(0, limit);
  }
  // Prefer the `timetable` view if present (maps to class-like items)
  try{
    const [trows] = await pool.query("SELECT DISTINCT CONCAT(workout_type,'-',COALESCE(trainer_id,0)) AS id, workout_type AS name, trainer_name AS trainer, time, NULL AS duration, day FROM `timetable` LIMIT ?", [limit]);
    if(trows && trows.length) return trows.map(r => ({ id: r.id?.toString(), name: r.name, trainer: r.trainer, time: r.time, duration: r.duration, day: r.day }));
  }catch(_){}

  // Fallback to a `classes` table if it exists
  try{
    const [rows] = await pool.query('SELECT id, name, trainer, time, duration FROM `classes` LIMIT ?', [limit]);
    return rows;
  }catch(err){
    // final fallback: return empty list rather than throwing
    return [];
  }
}

module.exports = { getClasses };
