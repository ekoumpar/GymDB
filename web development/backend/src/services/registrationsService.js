const pool = require('../config/database');

async function registerMemberToClass(member_id, classInfo){
  if(!member_id) throw new Error('member_id required');

  // Helper to insert into memberreserves
  async function insertMemberReserve(memberId, reservationId){
    try{
      console.log('[insertMemberReserve] inserting', { memberId, reservationId });
      const [result] = await pool.query('INSERT INTO `memberreserves` (member_id, reservation_id) VALUES (?,?)', [memberId, reservationId]);
      console.log('[insertMemberReserve] result', result);
      return { table: 'memberreserves', reservation_id: reservationId };
    }catch(err){
      // duplicate key means already reserved
      if(err && err.code === 'ER_DUP_ENTRY'){
        return { table: 'memberreserves', reservation_id: reservationId, warning: 'already_reserved' };
      }
      throw err;
    }
  }

  // If classInfo is string -> try as reservation_id or workout type
  if(typeof classInfo === 'string'){
    // try reservation_id
    const [rrows] = await pool.query('SELECT reservation_id FROM `reservation` WHERE reservation_id = ? LIMIT 1', [classInfo]);
    if(rrows && rrows.length){
      return insertMemberReserve(member_id, rrows[0].reservation_id);
    }
    // else try workout type
    const [wrows] = await pool.query('SELECT reservation_id FROM `reservation` WHERE workout_type = ? LIMIT 1', [classInfo]);
    if(wrows && wrows.length){
      return insertMemberReserve(member_id, wrows[0].reservation_id);
    }
    throw new Error('No matching reservation found');
  }

  // If object
  if(typeof classInfo === 'object' && classInfo !== null){
    // reservation_id provided
    if(classInfo.reservation_id){
      const [rrows] = await pool.query('SELECT reservation_id FROM `reservation` WHERE reservation_id = ? LIMIT 1', [classInfo.reservation_id]);
      if(rrows && rrows.length) return insertMemberReserve(member_id, rrows[0].reservation_id);
      throw new Error('reservation_id not found');
    }

    // If workout/day/time provided
    const workout = classInfo.workout || classInfo.workout_type || classInfo.name;
    const day = classInfo.day;
    const time = classInfo.time;
    if(workout && day && time){
      const [rows] = await pool.query('SELECT reservation_id FROM `reservation` WHERE workout_type = ? AND day = ? AND time = ? LIMIT 1', [workout, day, time]);
      if(rows && rows.length){
        return insertMemberReserve(member_id, rows[0].reservation_id);
      }
      // No reservation exists yet -> create one then reserve it
      // generate a short unique reservation_id (3 chars)
      function genId(){
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let s = '';
        for(let i=0;i<3;i++) s += chars[Math.floor(Math.random()*chars.length)];
        return s;
      }
      let newId;
      for(let attempt=0; attempt<10; attempt++){
        newId = genId();
        try{
          await pool.query('INSERT INTO `reservation` (reservation_id, day, time, status, workout_type) VALUES (?,?,?,?,?)', [newId, day, time, 'NotAttended', workout]);
          // inserted
          return insertMemberReserve(member_id, newId);
        }catch(err){
          // if duplicate key on reservation_id, try another id
          if(err && err.code === 'ER_DUP_ENTRY'){
            continue;
          }
          throw err;
        }
      }
      throw new Error('Could not create unique reservation id');
    }

    // fallback: try class_id field
    if(classInfo.class_id){
      // try as reservation_id first
      const [rrows2] = await pool.query('SELECT reservation_id FROM `reservation` WHERE reservation_id = ? LIMIT 1', [classInfo.class_id]);
      if(rrows2 && rrows2.length) return insertMemberReserve(member_id, rrows2[0].reservation_id);
      // try as workout type
      const [wrows2] = await pool.query('SELECT reservation_id FROM `reservation` WHERE workout_type = ? LIMIT 1', [classInfo.class_id]);
      if(wrows2 && wrows2.length) return insertMemberReserve(member_id, wrows2[0].reservation_id);
    }
  }

  throw new Error('Could not register - invalid or missing reservation info');
}

module.exports = { registerMemberToClass };
