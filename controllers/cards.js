const Card = require('../models/card');
const responseStatusCodes = require('../constants/constants');

const getCard = (req, res) => {
  Card.find({}).populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(responseStatusCodes.notFound).send({ message: 'Внутренняя ошибка сервера. Повторите запрос позже.' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(responseStatusCodes.badRequest).send({ message: 'Переданы некорректные данные в методы создания карточки.' });
        return;
      }
      res.status(responseStatusCodes.serverError).send({ message: 'Внутренняя ошибка сервера. Повторите запрос позже.' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(responseStatusCodes.notFound).send({ message: 'Карточка не найдена!' });
      } else {
        res.send({ message: 'Карточка удалена!' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(responseStatusCodes.badRequest).send({ message: 'Переданы некорректные данные в методы удаления карточки' });
        return;
      }
      res.status(responseStatusCodes.serverError).send({ message: 'Внутренняя ошибка сервера. Повторите запрос позже.' });
    });
};

const likeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(responseStatusCodes.notFound).send({ message: 'Карточка не найдена!' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(responseStatusCodes.badRequest).send({ message: 'Карточка не найдена!' });
      } else if (err.name === 'ValidationError') {
        res.status(responseStatusCodes.badRequest).send({ message: 'Переданы некорректные данные в методы постановки лайка' });
      } else {
        res.status(responseStatusCodes.serverError).send({ message: 'Внутренняя ошибка сервера. Повторите запрос позже.' });
      }
    });
};

const dislikeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(responseStatusCodes.notFound).send({ message: 'Карточка не найдена!' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(responseStatusCodes.badRequest).send({ message: 'Карточка не найдена!' });
      } else if (err.name === 'ValidationError') {
        res.status(responseStatusCodes.badRequest).send({ message: 'Переданы некорректные данные в методы снятия лайка' });
      } else {
        res.status(responseStatusCodes.serverError).send({ message: 'Внутренняя ошибка сервера. Повторите запрос позже.' });
      }
    });
};

module.exports = {
  createCard,
  getCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
