const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');

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

    res.status(201).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

module.exports = { createUser };
