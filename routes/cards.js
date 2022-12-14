const router = require('express').Router();

const {
  createCard,
  deleteCard,
  getCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
