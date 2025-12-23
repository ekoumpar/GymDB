// placeholder for request validation utilities
function requireFields(fields){
  return (req, res, next) => {
    const missing = fields.filter(f => req.body[f] === undefined || req.body[f] === '');
    if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    next();
  };
}

function requireNonEmptyBody(req, res, next){
  if(!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'Request body required' });
  next();
}

module.exports = { requireFields, requireNonEmptyBody };
