const pool = require('../config/database');
const mock = require('../utils/mockData');

async function getBookingsForUser(userId){
  if(process.env.USE_MOCK === '1'){
    return mock.bookings.filter(b => b.memberId === userId);
  }
  // attempt to read from a bookings table (best-effort)
  try{
    const [rows] = await pool.query(`SELECT b.*, c.name AS className FROM \`bookings\` b LEFT JOIN \`classes\` c ON c.id = b.class_id WHERE b.member_id = ?`, [userId]);
    return rows;
  }catch(err){
    // fallback - try registrations table
    try{
      const [rows] = await pool.query(`SELECT r.*, c.name AS className FROM \`registrations\` r LEFT JOIN \`classes\` c ON c.id = r.class_id WHERE r.member_id = ?`, [userId]);
      return rows;
    }catch(e){
      return [];
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
  try{
    const [result] = await pool.query('DELETE FROM `bookings` WHERE id = ?', [bookingId]);
    if(result.affectedRows) return { deleted: true };
    // try other tables
    const [r2] = await pool.query('DELETE FROM `registrations` WHERE id = ?', [bookingId]);
    if(r2.affectedRows) return { deleted: true };
    throw new Error('Booking not found');
  }catch(err){ throw err; }
}

module.exports = { getBookingsForUser, deleteBooking };
