module.exports = (err, req, res, _next) => {
  console.log(err);
  if (err.statusCode) {
    const { statusCode, message } = err;
    return res.status(statusCode).json({ message });
  }
  return res.status(500).json({ message: 'Internal server error' });
};