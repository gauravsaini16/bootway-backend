const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus
} = require('../controllers/jobController');
const { protect, authorizeAdminHR } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', getJobs);
router.get('/:id', getJob);

// Private routes (Admin/HR only)
router.post('/', protect, authorizeAdminHR(), createJob);
router.put('/:id', protect, authorizeAdminHR(), updateJob);
router.delete('/:id', protect, authorizeAdminHR(), deleteJob);
router.patch('/:id/toggle', protect, authorizeAdminHR(), toggleJobStatus);

module.exports = router;
