const Card = require('../models/card');
const ErrorNotFound = require('../utils/badrequest');
const ErrorBadRequest = require('../utils/badrequest');
const ErrorForbidden = require('../utils/forbidden');

const getCard = (req, res, next) => {
  Card.find({}).populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные в методы создания карточки.'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const owner = req.user.id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена!');
      } else if (owner.toString() !== card.owner.toString()) {
        throw new ErrorForbidden(`Пользователь с ID ${owner} не имеет прав для удаления данной карточки`);
      } else {
        Card.findByIdAndRemove(cardId)
          .then(() => {
            res.send({ message: 'Карточка удалена!' });
          })
          .catch(next);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные в методы удаления карточки'));
      }
      next(error);
    });
};

const likeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена!');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Карточка не найдена!'));
      } else if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные в методы постановки лайка'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена!');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Карточка не найдена!'));
      } else if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные в методы снятия лайка'));
      } else {
        next(err);
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
