const express = require('express');
const router = express.Router();
const {
  getInterviews,
  getInterview,
  scheduleInterview,
  updateInterview,
  deleteInterview,
  getMyInterviews
} = require('../controllers/interviewController');
const { protect, authorizeAdminHR } = require('../middleware/auth');

// GET all interviews (Admin/HR only)
router.get('/', protect, authorizeAdminHR(), getInterviews);

// GET my interviews (Candidate)
router.get('/candidate/my-interviews', protect, getMyInterviews);

// GET single interview
router.get('/:id', protect, getInterview);

// POST schedule interview (Admin/HR only)
router.post('/', protect, authorizeAdminHR(), scheduleInterview);

// PUT update interview (Admin/HR only)
router.put('/:id', protect, authorizeAdminHR(), updateInterview);

// DELETE interview (Admin only)
router.delete('/:id', protect, authorizeAdminHR(), deleteInterview);

module.exports = router;
