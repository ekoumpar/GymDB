const pool = require('../config/database');
const mock = require('../utils/mockData');

async function registerMemberToClass(member_id, classInfo){
  if(!member_id) throw new Error('member_id required');
  // Mock mode: operate on in-memory mock data instead of DB
  if(process.env.USE_MOCK === '1'){
    // normalize incoming info to workout/day/time
    let workout = null, day = null, time = null, class_id = null;
    if(typeof classInfo === 'string'){
      workout = classInfo;
    } else if(typeof classInfo === 'object' && classInfo !== null){
      workout = classInfo.workout || classInfo.workout_type || classInfo.name || classInfo.class_id;
      day = classInfo.day;
      time = classInfo.time;
      class_id = classInfo.class_id;
    }

    // if class_id provided, find class entry
    if(class_id){
      const c = mock.classes.find(x => String(x.id) === String(class_id) || (x.name && String(x.name).toLowerCase() === String(class_id).toLowerCase()));
      if(c) workout = c.name || c.workout_type || c.name;
    }

    if(!workout && !class_id) throw new Error('No matching reservation found');

    // if workout provided but no day/time, try to find a schedule row
    if(!day || !time){
      const sched = mock.schedule.find(s => (s.name && s.name.toLowerCase() === String(workout||'').toLowerCase()) || (s.workout_type && s.workout_type.toLowerCase() === String(workout||'').toLowerCase()));
      if(sched){ day = sched.day || day; time = sched.time || time; }
    }

    if(!day || !time) throw new Error('Provide workout+day+time when using mock mode');

    // check already reserved
    const exists = mock.bookings.find(b => String(b.memberId) === String(member_id) && (b.className === workout || b.className === (class_id || null)) && (() => {
      try{ const d = new Date(b.date); return d.getUTCDay() === (['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(day)); }catch(e){ return false; }
    })());
    if(exists) return { table: 'memberreserves', reservation_id: exists.id, warning: 'already_reserved' };

    // generate reservation id (3 chars)
    function genId(){ const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'; let s=''; for(let i=0;i<3;i++) s+=chars[Math.floor(Math.random()*chars.length)]; return s; }
    const newId = genId();

    // compute next date for the weekday at the given time (UTC)
    function nextDateForWeekday(weekdayName, timeStr){
      const days = { sunday:0,monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6 };
      const target = days[String(weekdayName||'').toLowerCase()];
      if(target === undefined) return new Date().toISOString();
      const [hh,mm] = (timeStr||'00:00').split(':').map(x=>parseInt(x,10)||0);
      const now = new Date();
      // start from today at given time (use UTC)
      const cur = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hh, mm, 0));
      let diff = (target - cur.getUTCDay() + 7) % 7;
      if(diff === 0 && cur.getTime() <= now.getTime()) diff = 7;
      const result = new Date(cur.getTime() + diff * 24*60*60*1000);
      return result.toISOString();
    }

    const dateISO = nextDateForWeekday(day, time);

    // find trainer from schedule or classes
    let trainer = null;
    const sch = mock.schedule.find(s => ((s.name && s.name.toLowerCase() === String(workout||'').toLowerCase()) || (s.workout_type && s.workout_type.toLowerCase() === String(workout||'').toLowerCase())) && s.day === day && s.time === time);
    if(sch) trainer = sch.trainer_name || sch.trainer;
    if(!trainer){ const cl = mock.classes.find(c => c.name && c.name.toLowerCase() === String(workout||'').toLowerCase()); if(cl) trainer = cl.trainer || cl.trainerId || null; }

    const bookingId = `b${newId}`;
    const b = { id: bookingId, memberId: member_id, classId: class_id || null, className: workout, trainer: trainer, date: dateISO, location: 'Mock Hall' };
    mock.bookings.push(b);
    return { table: 'memberreserves', reservation_id: newId };
  }

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
