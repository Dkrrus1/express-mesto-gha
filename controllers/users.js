const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(500).send({ message: 'Внутренняя ошибка сервера. Повторите запрос позже.' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден!' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь не найден!' });
        return;
      }
      res.status(500).send({ message: 'Внутренняя ошибка сервера. Повторите запрос позже.' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы создания пользователя.' });
        return;
      }
      res.status(500).send({ message: 'Внутренняя ошибка сервера. Повторите запрос позже.' });
    });
};

const updateUser = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(owner, { name, about }, { runValidators: true })
    .then((user) => {
      res.send({
        _id: owner,
        name,
        about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы обновления пользователя.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь не найден!' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера. Повторите запрос позже.' });
      }
    });
};

const updateAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(owner, { avatar }, { runValidators: true })
    .then((user) => {
      res.send({
        _id: owner,
        user: user.name,
        about: user.about,
        avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные в методы обновления пользователя.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь не найден!' });
      } else {
        res.status(500).send({ message: 'Внутренняя ошибка сервера. Повторите запрос позже.' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
