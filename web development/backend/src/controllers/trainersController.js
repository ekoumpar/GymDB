const trainersService = require('../services/trainersService');
const { ok } = require('../utils/responses');

async function getTrainers(req, res, next){
  try{
    const rows = await trainersService.getTrainers();
    return ok(res, { trainers: rows });
  }catch(err){ next(err); }
}

module.exports = { getTrainers };
