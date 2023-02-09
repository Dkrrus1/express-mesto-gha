const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorNotFound = require('../utils/notfound');
const ErrorBadRequest = require('../utils/badrequest');
const ErrorUnauth = require('../utils/unauth');
const ErrorConflict = require('../utils/conflict');

const { JWT_SECRET = 'some-secret-key' } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден!');
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then(() => res.status(201)
          .send({
            name,
            about,
            avatar,
            email,
          }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ErrorConflict('Пользователь с таким E-Mail уже существует'));
          } else if (err.name === 'ValidationError') {
            next(new ErrorBadRequest('Переданы некорректные данные в методы создания пользователя.'));
          } else {
            next(err);
          }
        });
    });
};

const updateUser = (req, res, next) => {
  const owner = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(owner, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден!');
      } else {
        res.send({
          _id: owner,
          name,
          about,
          avatar: user.avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные в методы обновления пользователя.'));
      } else if (err.name === 'CastError') {
        next(new ErrorBadRequest('Пользователь не найден!'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(owner, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден!');
      } else {
        res.send({
          _id: owner,
          user: user.name,
          about: user.about,
          avatar,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные в методы обновления пользователя.'));
      } else if (err.name === 'CastError') {
        next(new ErrorBadRequest('Пользователь не найден!'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const owner = req.user._id;

  User.findById(owner)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorUnauth('Пользователь не найден!');
      }

      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) {
            throw new ErrorUnauth('Введены неверные данные.');
          }
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: 60480000 },
          );
          res.cookie('jwt', token, {
            maxAge: 60480000,
            httpOnly: true,
          });

          return res.send({
            message: 'Добро пожаловать!',
            token,
          });
        });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
