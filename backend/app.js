const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/errorMiddleware');

const products = require('./routes/productRoute');

app.use(express.json());

app.use('/api/v1/product', products);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
