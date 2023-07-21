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
  isAuthenticated,
  authorizeRoles,
} = require('../middlewares/authMiddleware');

router.post('/create', createUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/me', isAuthenticated, getUserProfile);
router.put('/password/update', isAuthenticated, updatePassword);
router.put('/me/update', isAuthenticated, updateUserProfile);
router.get(
  '/admin/users',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllUsers
);
router.get(
  '/admin/user/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  getUserDetailsById
);
router.put(
  '/admin/user/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  updateUserProfileByAdmin
);
router.delete(
  '/admin/user/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteUserByAdmin
);

module.exports = router;
