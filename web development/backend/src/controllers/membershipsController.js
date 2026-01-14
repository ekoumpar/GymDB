/**
 * Memberships controller — retrieve membership plans via
 * `membershipsService`, return `ok` responses, and forward errors.
 */
const membershipsService = require('../services/membershipsService');
const { ok } = require('../utils/responses');

async function getMemberships(_, res, next){
  try{
    const rows = await membershipsService.getMemberships();
    return ok(res, { memberships: rows });
  }catch(err){ next(err); }
}

module.exports = { getMemberships };
