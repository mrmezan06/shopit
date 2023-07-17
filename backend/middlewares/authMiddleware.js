const User = require('../models/userModel');

const ErrorHandler = require('../utils/errorHandler');

const jwt = require('jsonwebtoken');

const isAuthenticatd = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler('No token, authorization denied', 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
};

module.exports = isAuthenticatd;
