const Product = require('../models/productModel');
const dotenv = require('dotenv');
const connectDatabase = require('../config/DB');
const products = require('../data/product');

dotenv.config();

connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('Products are deleted');

    await Product.insertMany(products);
    console.log('All Products are added.');

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
