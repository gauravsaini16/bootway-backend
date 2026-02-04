const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, authorizeAdminHR } = require('../middleware/auth');

// GET all users (Admin/HR only)
router.get('/', protect, authorizeAdminHR(), getAllUsers);

// GET user by ID (Admin/HR only)
router.get('/:id', protect, authorizeAdminHR(), getUserById);

// POST create user (Admin/HR only)
router.post('/', protect, authorizeAdminHR(), createUser);

// PUT update user (Admin/HR only)
router.put('/:id', protect, authorizeAdminHR(), updateUser);

// DELETE delete user (Admin/HR only)
router.delete('/:id', protect, authorizeAdminHR(), deleteUser);

module.exports = router;
