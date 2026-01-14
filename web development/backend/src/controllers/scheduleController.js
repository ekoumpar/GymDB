/**
 * Schedule controller — fetch schedule via `scheduleService`, return `ok`
 * responses, and forward errors to middleware.
 */
const scheduleService = require('../services/scheduleService');
const { ok } = require('../utils/responses');

async function getSchedule(req, res, next){
  try{
    const data = await scheduleService.getSchedule();
    return ok(res, { schedule: data });
  }catch(err){ next(err); }
}

module.exports = { getSchedule };
