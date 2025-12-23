const bookingsService = require('../services/bookingsService');
const { ok } = require('../utils/responses');

async function getBookings(req, res, next){
  try{
    const userId = req.user && (req.user.userId || req.user.id || req.user.username);
    if(!userId) return res.status(401).json({ error: 'Missing user' });
    const rows = await bookingsService.getBookingsForUser(userId);
    return ok(res, { bookings: rows });
  }catch(err){ next(err); }
}

async function deleteBooking(req, res, next){
  try{
    const bookingId = req.params.id;
    if(!bookingId) return res.status(400).json({ error: 'Missing booking id' });
    const result = await bookingsService.deleteBooking(bookingId);
    return ok(res, { result });
  }catch(err){ next(err); }
}

module.exports = { getBookings, deleteBooking };
