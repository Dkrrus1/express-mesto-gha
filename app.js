const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6372ac41ca57a8f1ba75a696',
  };
  next();
});

app.use(userRouter);
app.use(cardRouter);

router.use((req, res) => {
  res.status(404).send({ message: 'Страница по указанному маршруту не найдена' });
});

app.listen(PORT);
