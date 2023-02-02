const jwt = require('jsonwebtoken');
const responseStatusCodes = require('../constants/constants');

const verifyAuthorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.send(responseStatusCodes.notAuthorized).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.send(responseStatusCodes.notAuthorized).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};

module.exports = {
  verifyAuthorization,
};
