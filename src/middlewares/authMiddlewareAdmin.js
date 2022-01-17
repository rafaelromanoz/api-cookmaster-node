const { validateToken } = require('../auth/authConfig');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
  const { role } = validateToken(authorization);
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can register new admins' });
  } 
  req.role = role;
  next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'invalid token' });
  }
};