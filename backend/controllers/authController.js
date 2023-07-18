const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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

// @desc Reset password
// @route PUT /api/v1/user/password/reset/:token
// @access Public

const resetPassword = async (req, res, next) => {
  try {
    // Hash URL token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with hashed token, and check if token is expired or not

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler(
          'Password reset token is invalid or has been expired',
          400
        )
      );
    }

    /* if (user.resetPasswordExpire < Date.now()) {
      return next(
        new ErrorHandler(
          'Password reset token is invalid or has been expired',
          400
        )
      );
    } */

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler('Password does not match', 400));
    }
    // Setup new password

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc Get currently logged in user details
// @route GET /api/v1/user/me
// @access Private

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc Update / Change password
// @route PUT /api/v1/user/password/update
// @access Private

const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);

    if (!isMatched) {
      return next(new ErrorHandler('Old password is incorrect', 400));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);

    

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc Update user profile
// @route PUT /api/v1/user/me/update
// @access Private

const updateUserProfile = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    // Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
    });

    if(!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc Get All users
// @route GET /api/v1/user/admin/users
// @access Private/Admin

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      return next(new ErrorHandler('No users found', 404));
    }

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc Get user details by id
// @route GET /api/v1/user/admin/user/:id
// @access Private/Admin

const getUserDetailsById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc Update user profile by admin
// @route PUT /api/v1/user/admin/user/:id
// @access Private/Admin

const updateUserProfileByAdmin = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    // Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
    });

    if(!user) {
      return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
    }
    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// @desc Delete user by admin
// @route DELETE /api/v1/user/admin/user/:id
// @access Private/Admin

const deleteUserByAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) {
      return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
    }

    // Remove avatar from cloudinary: TODO

    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
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

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateUserProfile,
  getAllUsers,
  getUserDetailsById,
  updateUserProfileByAdmin,
  deleteUserByAdmin,
};
