const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const connect = require('./configs/connectDb');
const userRouter = require('./routes/user.route');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use('/api/users', userRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  connect(process.env.MONGODB_CONNECT_URL);
  console.log(`Server listening on port ${PORT}`);
});
