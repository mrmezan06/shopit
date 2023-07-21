const express = require('express');
const app = express();


const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const errorMiddleware = require('./middlewares/errorMiddleware');

const products = require('./routes/productRoute');
const auths = require('./routes/authRoute');
const orders = require('./routes/orderRoute');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

app.use('/api/v1/product', products);
app.use('/api/v1/user', auths);
app.use('/api/v1/order', orders);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
