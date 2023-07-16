const mongoose = require('mongoose');
const ErrorHandler = require('../utils/errorHandler');

const connectDatabase = () => {
  try {
    mongoose.connect(process.env.MONGO_LOCAL_URI, {}).then((con) => {
      console.log(
        `MongoDB connected with IP: ${con.connection.host}:${con.connection.port}`
      );
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

module.exports = connectDatabase;
