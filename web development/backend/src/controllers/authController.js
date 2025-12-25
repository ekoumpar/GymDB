const authService = require('../services/authService');
const { generateToken } = require('../middleware/auth');
const { ok } = require('../utils/responses');

async function register(req, res, next){
  try{
    const { username, password, dateOfBirth, sex, phoneNumber, height, weight } = req.body || {};
    if(!username || !password || !dateOfBirth || !phoneNumber) {
      return res.status(400).json({ error: 'username, password, dateOfBirth, and phoneNumber are required' });
    }
    
    // Convert DD/MM/YYYY to YYYY-MM-DD for database
    let formattedDate = dateOfBirth;
    if(dateOfBirth && dateOfBirth.includes('/')) {
      const [day, month, year] = dateOfBirth.split('/');
      formattedDate = `${year}-${month}-${day}`;
    }
    
    const details = { dateOfBirth: formattedDate, sex: sex || 'M', phoneNumber, height, weight };
    const user = await authService.registerUser(username, password, details);
    const token = generateToken({ userId: user.id, username: user.username });
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
