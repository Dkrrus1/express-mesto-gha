const router = require('express').Router();

const {
  createCard,
  deleteCard,
  getCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.get('/cards', getCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);
module.exports = router;
