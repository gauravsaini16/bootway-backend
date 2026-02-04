const express = require('express');
const router = express.Router();
const {
  getOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
  getMyOffers
} = require('../controllers/offerController');
const { protect, authorizeAdminHR } = require('../middleware/auth');

// GET all offers (Admin/HR only)
router.get('/', protect, authorizeAdminHR(), getOffers);

// GET my offers (Candidate)
router.get('/candidate/my-offers', protect, getMyOffers);

// GET single offer
router.get('/:id', protect, getOffer);

// POST create offer (Admin/HR only)
router.post('/', protect, authorizeAdminHR(), createOffer);

// PUT update offer (Admin/HR only)
router.put('/:id', protect, authorizeAdminHR(), updateOffer);

// DELETE offer (Admin only)
router.delete('/:id', protect, authorizeAdminHR(), deleteOffer);

module.exports = router;
