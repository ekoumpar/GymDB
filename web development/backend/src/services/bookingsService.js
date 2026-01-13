const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getBookingsForUser(userId){
  if(process.env.USE_MOCK === '1'){
    return mock.bookings.filter(b => b.memberId === userId);
  }
  // attempt to read from a bookings table (best-effort)
  try{
    const [rows] = await pool.query("SELECT b.*, c.name AS className FROM `bookings` b LEFT JOIN `classes` c ON c.id = b.class_id WHERE b.member_id = ?", [userId]);
    return rows;
  }catch(err){
    // fallback - try registrations table
    try{
      const [rows] = await pool.query("SELECT r.*, c.name AS className FROM `registrations` r LEFT JOIN `classes` c ON c.id = r.class_id WHERE r.member_id = ?", [userId]);
      return rows;
    }catch(e){
      // fallback: memberreserves joined with reservation
      try{
        const [rows] = await pool.query("SELECT mr.reservation_id as id, r.workout_type as name, r.workout_type as className, r.day, r.time FROM `memberreserves` mr JOIN `reservation` r ON r.reservation_id = mr.reservation_id WHERE mr.member_id = ?", [userId]);
        // normalize to expected shape
        return rows.map(rw => ({ id: rw.id, className: rw.className, name: rw.name, day: rw.day, time: rw.time }));
      }catch(err2){
        return [];
      }
    }
  }
}

async function deleteBooking(bookingId){
  if(process.env.USE_MOCK === '1'){
    const idx = mock.bookings.findIndex(b=>b.id === bookingId);
    if(idx === -1) throw new Error('Booking not found');
    mock.bookings.splice(idx,1);
    return { deleted: true };
  }
  throw new Error('Use deleteBookingForUser(bookingId, userId) instead');
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
