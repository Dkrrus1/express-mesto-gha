const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const router = require('./routes');

const { PORT = 3000, DBLINK = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose.connect(DBLINK, {
  useNewUrlParser: true,
});

app.use(router);

app.listen(PORT);
