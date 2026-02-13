const express = require('express');
const router = express.Router();
const {
  getApplications,
  getApplication,
  applyForJob,
  updateApplication,
  deleteApplication,
  getJobApplications,
  getMyApplications
} = require('../controllers/applicationController');
const { protect, authorizeAdminHR, optionalProtect } = require('../middleware/auth');

// GET all applications (Admin/HR only)
router.get('/', protect, authorizeAdminHR(), getApplications);

// GET applications for a specific job
router.get('/job/:jobId', getJobApplications);

// GET my applications (Candidate)
router.get('/candidate/my-applications', protect, getMyApplications);

// GET single application
router.get('/:id', getApplication);

// POST apply for job
router.post('/', optionalProtect, applyForJob);

// PUT update application (Admin/HR only)
router.put('/:id', protect, authorizeAdminHR(), updateApplication);

// DELETE application (Admin only)
router.delete('/:id', protect, authorizeAdminHR(), deleteApplication);

module.exports = router;
