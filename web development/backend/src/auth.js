const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'change_this_secret';

function generateToken(payload, opts={}){
  return jwt.sign(payload, SECRET, { expiresIn: opts.expiresIn || '8h' });
}

function authMiddleware(req, res, next){
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = h.slice(7);
  try{
    const data = jwt.verify(token, SECRET);
    req.user = data;
    next();
  }catch(err){
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { generateToken, authMiddleware };
