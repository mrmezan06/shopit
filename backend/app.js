const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/errorMiddleware');

const products = require('./routes/productRoute');
const auths = require('./routes/authRoute');

app.use(express.json());

app.use('/api/v1/product', products);
app.use('/api/v1/user', auths);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
