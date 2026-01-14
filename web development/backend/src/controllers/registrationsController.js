/**
 * Registrations controller — normalize registration payloads, delegate to
 * `registrationsService`, translate outcomes to HTTP responses, and forward errors.
 */
const registrationsService = require('../services/registrationsService');
const { ok } = require('../utils/responses');

async function register(req, res, next){
  try{
    const body = req.body || {};
    console.log('[register] payload:', JSON.stringify(body));
    const member_id = body.member_id;
    if (!member_id) return res.status(400).json({ error: 'member_id required' });
    // accept reservation_id OR workout/day/time OR legacy class_id
    const payload = {
      reservation_id: body.reservation_id,
      workout: body.workout || body.workout_type || body.name || body.class_id,
      day: body.day,
      time: body.time,
      class_id: body.class_id
    };
    const result = await registrationsService.registerMemberToClass(member_id, payload);
    console.log('[register] result:', result);
    if(result && result.warning === 'already_reserved'){
      return res.status(409).json({ error: 'You already booked this class' });
    }
    return ok(res, result);
  }catch(err){ next(err); }
}

module.exports = { register };
