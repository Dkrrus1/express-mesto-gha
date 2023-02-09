const router = require('express').Router();
const ErrorNotFound = require('../utils/notfound');
const userRouter = require('./users');
const cardRouter = require('./cards');
const authRouter = require('./auth');
const { verifyAuthorization } = require('../middlewares/auth');

router.use('/', authRouter);
router.use(verifyAuthorization);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res, next) => {
  next(new ErrorNotFound('Страница по указанному маршруту не найдена'));
});

module.exports = router;
