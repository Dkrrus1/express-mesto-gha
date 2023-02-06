const jwt = require('jsonwebtoken');
const ErrorUnauth = require('../utils/unauth');

const verifyAuthorization = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new ErrorUnauth('Необходима авторизация'));
  }

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new ErrorUnauth('Необходима авторизация'));
  }

  req.user = payload;

  next();
};

module.exports = {
  verifyAuthorization,
};
