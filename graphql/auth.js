// Middleware para autenticação JWT
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';

function getUserFromToken(token) {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET);
    return { username: decoded.username };
  } catch (err) {
    return null;
  }
}

module.exports = { getUserFromToken };
