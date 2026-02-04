const Offer = require('../models/Offer');
const Application = require('../models/Application');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Private
exports.getOffers = async (req, res, next) => {
  try {
    const { status, candidateId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (candidateId) query.candidateId = candidateId;

    const offers = await Offer.find(query)
      .populate('applicationId')
      .populate('jobId', 'title department')
      .populate('candidateId', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Private
exports.getOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('applicationId')
      .populate('jobId')
      .populate('candidateId');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create offer
// @route   POST /api/offers
// @access  Private/Admin/HR
exports.createOffer = async (req, res, next) => {
  try {
    const {
      applicationId,
      jobId,
      candidateId,
      candidateName,
      candidateEmail,
      position,
      department,
      salary,
      currency,
      startDate,
      offerValidTill,
      jobDescription,
      benefits,
      documents
    } = req.body;

    if (!applicationId || !jobId || !candidateId || !salary || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const offer = await Offer.create({
      applicationId,
      jobId,
      candidateId,
      candidateName,
      candidateEmail,
      position,
      department,
      salary,
      currency: currency || 'USD',
      startDate,
      offerValidTill,
      jobDescription,
      benefits: benefits || [],
      documents: documents || []
    });

    // Update application status to 'offer'
    await Application.findByIdAndUpdate(
      applicationId,
      { status: 'offer' },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin/HR
exports.updateOffer = async (req, res, next) => {
  try {
    const { status, rejectionReason, respondedAt } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (rejectionReason) updateData.rejectionReason = rejectionReason;

    if (status) {
      updateData.respondedAt = new Date();
    }

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('candidateId').populate('jobId');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin/HR
exports.deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get my offers
// @route   GET /api/offers/candidate/my-offers
// @access  Private/Candidate
exports.getMyOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ candidateId: req.user?.id })
      .populate('jobId', 'title department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (err) {
    next(err);
  }
};
