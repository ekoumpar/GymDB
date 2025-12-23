const membersService = require('../services/membersService');
const { ok, err } = require('../utils/responses');

async function getMembers(req, res, next){
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
