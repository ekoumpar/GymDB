function ok(res, payload){
  return res.json({ ok: true, ...payload });
}

function err(res, code, message){
  return res.status(code).json({ ok: false, error: message });
}

module.exports = { ok, err };
