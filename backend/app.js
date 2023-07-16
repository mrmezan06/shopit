const express = require('express');
const app = express();

const products = require('./routes/productRoute');

app.use(express.json());

app.use('/api/v1/product', products);

module.exports = app;
