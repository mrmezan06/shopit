const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    // Development error
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production error
    err.message = err.message || 'Internal Server Error';

    // Wrong Mongoose Object ID Error

    const name = err.message.split(' ')[0];
    const errorName = err.message.split(':')[0];
    const duplicate = err.message.split(' ')[0];

    if (name === 'Cast') {
      const message = `Resource not found. Invalid: Content ID.`;

      return res.status(err.statusCode).json({
        success: false,
        statusCode: 400,
        message: message,
      });
    }else if(duplicate === 'E11000'){
      const message = `Email already exists.`;
      return res.status(err.statusCode).json({
        success: false,
        statusCode: 400,
        Field: 'Email',
        message: message,
      });
    }
    
    else if (errorName === 'Product validation failed') {
      // const message =
      // err.message.split(':')[1].trim() + ': ' + err.message.split(':')[2];
      // multiple errors
      // split : and make an array

      return res.status(err.statusCode).json({
        success: false,
        statusCode: 400,
        Field: err.message.split(':')[1].trimStart(),
        message: err.message.split(':')[2].split(',')[0].trimStart(),
      });
    } else {
      res.status(err.statusCode).json({
        success: false,
        statusCode: err.statusCode,
        message: err.message,
      });
    }
  }
};
