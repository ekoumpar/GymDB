const registrationsService = require('../services/registrationsService');
const { ok } = require('../utils/responses');

async function register(req, res, next){
  try{
    const { member_id, class_id } = req.body || {};
    if (!member_id || !class_id) return res.status(400).json({ error: 'member_id and class_id required' });
    const result = await registrationsService.registerMemberToClass(member_id, class_id);
    return ok(res, result);
  }catch(err){ next(err); }
}

module.exports = { register };
