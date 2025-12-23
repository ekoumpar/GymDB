const authService = require('../services/authService');
const { generateToken } = require('../middleware/auth');
const { ok } = require('../utils/responses');

async function register(req, res, next){
  try{
    const { username, password } = req.body || {};
    if(!username || !password) return res.status(400).json({ error: 'username and password required' });
    const user = await authService.registerUser(username, password);
    const token = generateToken({ userId: user.id, username: user.username });
    // return token and user object (no email)
    return ok(res, { token, user: { id: user.id, username: user.username } });
  }catch(err){ next(err); }
}

async function login(req, res, next){
  try{
    const { username, password } = req.body || {};
    if(!username || !password) return res.status(400).json({ error: 'username and password required' });
    const user = await authService.loginUser(username, password);
    const token = generateToken({ userId: user.id, username: user.username });
    return ok(res, { token, user });
  }catch(err){ next(err); }
}

module.exports = { register, login };
