const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new user
// @route   POST /api/v1/user/admin/create
// @access  Private/Admin

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: 'avatars/kccvibpsuiusmwfepb3m',
        url: 'https://res.cloudinary.com/shopit/image/upload/v1606305757/avatars/kccvibpsuiusmwfepb3m.png',
      },
    });

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc Login user
// @route POST /api/v1/user/login
// @access Public

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password is entered by user
    if (!email || !password) {
      return next(new ErrorHandler('Please enter email & password', 400));
    }

    // Find user in database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc Forgot password
// @route POST /api/v1/user/password/forgot
// @access Public

const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/user/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n <a href=\"${resetUrl}\">Reset Password</a> \n\nIf you have not requested this email, then ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'ShopIT Password Recovery',
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to: ${user.email}`,
      });
    } catch (error) {
      // If error occurs while sending email, then clear the reset token and expire date
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {}
};

// @desc Logout user
// @route GET /api/v1/user/logout
// @access Public

const logoutUser = async (req, res, next) => {
  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Logged out',
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

module.exports = { createUser, loginUser, logoutUser, forgotPassword };
