const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getBookingsForUser(userId){
  if(process.env.USE_MOCK === '1'){
    // Normalize mock bookings to include day/time and trainer_name to match DB-driven responses
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return mock.bookings
      .filter(b => b.memberId === userId)
      .map(b => {
        let day = '';
        let time = '';
        if(b.date){
          try{
            const dt = new Date(b.date);
            day = days[dt.getUTCDay()];
            const hh = String(dt.getUTCHours()).padStart(2,'0');
            const mm = String(dt.getUTCMinutes()).padStart(2,'0');
            time = `${hh}:${mm}`;
          }catch(e){ /* ignore */ }
        }
        return {
          id: b.id,
          className: b.className || b.name,
          name: b.className || b.name,
          day,
          time,
          trainer_name: b.trainer || b.trainer_name || b.trainerName || null
        };
      });
  }
  // attempt to read from a bookings table (best-effort)
  try{
    const [rows] = await pool.query("SELECT b.*, c.name AS className FROM `bookings` b LEFT JOIN `classes` c ON c.id = b.class_id WHERE b.member_id = ?", [userId]);
    // normalize to expected shape and include trainer_name when present
    return rows.map(rw => ({
      id: rw.id || rw.booking_id || rw.reservation_id,
      className: rw.className || rw.name || rw.class_name,
      name: rw.className || rw.name || rw.class_name,
      day: rw.day || null,
      time: rw.time || null,
      trainer_name: rw.trainer_name || rw.trainer || rw.trainerName || null
    }));
  }catch(err){
    // fallback - try registrations table
    try{
      const [rows] = await pool.query("SELECT r.*, c.name AS className FROM `registrations` r LEFT JOIN `classes` c ON c.id = r.class_id WHERE r.member_id = ?", [userId]);
      return rows.map(rw => ({
        id: rw.id || rw.registration_id || rw.reservation_id,
        className: rw.className || rw.name || rw.class_name,
        name: rw.className || rw.name || rw.class_name,
        day: rw.day || null,
        time: rw.time || null,
        trainer_name: rw.trainer_name || rw.trainer || rw.trainerName || null
      }));
    }catch(e){
      // fallback: memberreserves joined with reservation
      try{
        const [rows] = await pool.query(
          `SELECT mr.reservation_id as id,
                  r.workout_type as name,
                  r.workout_type as className,
                  r.day,
                  r.time,
                  t.name as trainer_name
           FROM memberreserves mr
           JOIN reservation r ON r.reservation_id = mr.reservation_id
           LEFT JOIN trainercoaches tc ON tc.workout_type = r.workout_type
           LEFT JOIN trainer t ON t.trainer_id = tc.trainer_id
           WHERE mr.member_id = ?`,
          [userId]
        );
        // normalize to expected shape and include trainer_name
        const mapped = rows.map(rw => ({ id: rw.id, className: rw.className, name: rw.name, day: rw.day, time: rw.time, trainer_name: rw.trainer_name }));

        // For any row missing trainer_name, attempt to lookup a trainer for the workout_type
        await Promise.all(mapped.map(async (m) => {
          if(!m.trainer_name){
            try{
              const [trows] = await pool.query(
                'SELECT t.name AS trainer_name FROM trainercoaches tc JOIN trainer t ON t.trainer_id = tc.trainer_id WHERE tc.workout_type = ? LIMIT 1',
                [m.name]
              );
              if(trows && trows[0] && trows[0].trainer_name) m.trainer_name = trows[0].trainer_name;
            }catch(e){ /* ignore */ }
          }
        }));

        return mapped;
      }catch(err2){
        return [];
      }
    }
  }
}

async function deleteBookingForUser(bookingId, userId){
  if(process.env.USE_MOCK === '1'){
    const idx = mock.bookings.findIndex(b=>b.id === bookingId && b.memberId === userId);
    if(idx === -1) throw new Error('Booking not found');
    mock.bookings.splice(idx,1);
    return { deleted: true };
  }
  try{
    // try bookings table
    const [result] = await pool.query('DELETE FROM `bookings` WHERE id = ? AND member_id = ?', [bookingId, userId]);
    if(result.affectedRows) return { deleted: true };
    // try registrations
    const [r2] = await pool.query('DELETE FROM `registrations` WHERE id = ? AND member_id = ?', [bookingId, userId]);
    if(r2.affectedRows) return { deleted: true };
    // try memberreserves by reservation_id
    const [r3] = await pool.query('DELETE FROM `memberreserves` WHERE reservation_id = ? AND member_id = ?', [bookingId, userId]);
    if(r3.affectedRows) return { deleted: true };
    throw new Error('Booking not found');
  }catch(err){ throw err; }
}

module.exports = { getBookingsForUser, deleteBookingForUser };
