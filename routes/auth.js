const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST register
router.post('/register', register);

// POST login
router.post('/login', login);

// GET current user (protected)
router.get('/me', protect, getMe);

// PUT update password (protected)
router.put('/updatePassword', protect, updatePassword);

module.exports = router;
