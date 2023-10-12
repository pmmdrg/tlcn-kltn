const express = require('express');
const morgan = require('morgan');

const connect = require('./configs/connectDb');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(morgan('dev'));

app.listen(PORT, () => {
  connect(process.env.MONGODB_CONNECT_URL);
  console.log(`Server listening on port ${PORT}`);
});
