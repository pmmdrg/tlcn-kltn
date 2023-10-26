const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const connect = require('./configs/connectDb');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const productRouter = require('./routes/product.route');
const categoryRouter = require('./routes/category.route');
const brandRouter = require('./routes/brand.route');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT;

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use('/api/auths', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/brands', brandRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  connect(process.env.MONGODB_CONNECT_URL);
  console.log(`Server listening on port ${PORT}`);
});
