/**
 * Trainers controller — list trainers via `trainersService`, wrap results
 * with `ok`, and forward errors to middleware.
 */
const trainersService = require('../services/trainersService');
const { ok } = require('../utils/responses');

async function getTrainers(req, res, next){
  try{
    const rows = await trainersService.getTrainers();
    return ok(res, { trainers: rows });
  }catch(err){ next(err); }
}

module.exports = { getTrainers };
