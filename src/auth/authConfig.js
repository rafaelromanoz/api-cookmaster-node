const jwt = require('jsonwebtoken');

const API_SECRET = 'safdgjsadfguioasduiofpsioadfusag';
const JWT_CONFIG = {
  expiresIn: '60d',
  algorithm: 'HS256',
};
const generateToken = (data) => jwt.sign({ ...data }, API_SECRET, JWT_CONFIG);

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, API_SECRET);
    return decoded;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  validateToken,
};