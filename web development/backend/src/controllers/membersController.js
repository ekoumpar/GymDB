/**
 * Members controller — list and create members by delegating to
 * `membersService`, returning standardized responses and forwarding errors.
 */
const membersService = require('../services/membersService');
const { ok, _ } = require('../utils/responses');

async function getMembers(_, res, next){
  try{
    const rows = await membersService.getMembers();
    return ok(res, { members: rows });
  }catch(error){ next(error); }
}

async function createMember(req, res, next){
  try{
    const result = await membersService.addMember(req.body || {});
    return ok(res, { insertId: result.insertId });
  }catch(error){ next(error); }
}

module.exports = { getMembers, createMember };
