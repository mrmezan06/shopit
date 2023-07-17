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

// Handle user roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403));
        }
        next();
    }
}

module.exports = {isAuthenticatd, authorizeRoles};
