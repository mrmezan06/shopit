const express = require('express');
const router = express.Router();

const {
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
} = require('../controllers/authController');
const {
  isAuthenticatd,
  authorizeRoles,
} = require('../middlewares/authMiddleware');

router.post('/admin/create', createUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/me', isAuthenticatd, getUserProfile);
router.put('/password/update', isAuthenticatd, updatePassword);
router.put('/me/update', isAuthenticatd, updateUserProfile);
router.get(
  '/admin/users',
  isAuthenticatd,
  authorizeRoles('admin'),
  getAllUsers
);
router.get(
  '/admin/user/:id',
  isAuthenticatd,
  authorizeRoles('admin'),
  getUserDetailsById
);
router.put(
  '/admin/user/:id',
  isAuthenticatd,
  authorizeRoles('admin'),
  updateUserProfileByAdmin
);
router.delete(
  '/admin/user/:id',
  isAuthenticatd,
  authorizeRoles('admin'),
  deleteUserByAdmin
);

module.exports = router;
