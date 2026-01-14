/**
 * Classes controller — list classes via `classesService`, wrap results with
 * `ok`, and forward errors to middleware.
 */
const classesService = require('../services/classesService');
const { ok } = require('../utils/responses');

async function getClasses(_, res, next){
  try{
    const rows = await classesService.getClasses();
    return ok(res, { classes: rows });
  }catch(err){ next(err); }
}

module.exports = { getClasses };
