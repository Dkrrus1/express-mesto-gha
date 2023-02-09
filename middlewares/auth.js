const jwt = require('jsonwebtoken');
const ErrorUnauth = require('../utils/unauth');

const { JWT_SECRET = 'some-secret-key' } = process.env;

const verifyAuthorization = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new ErrorUnauth('Необходима авторизация'));
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new ErrorUnauth('Необходима авторизация'));
  }

  req.user = payload;

  next();
};

module.exports = {
  verifyAuthorization,
};
