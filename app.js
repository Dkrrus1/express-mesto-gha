const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000, DBLINK = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());

mongoose.connect(DBLINK, {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6372ac41ca57a8f1ba75a696',
  };
  next();
});

app.use(router);

app.listen(PORT);
