const Application = require('../models/Application');
const Job = require('../models/job');

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private/Admin
exports.getApplications = async (req, res, next) => {
  try {
    const { jobId, candidateId, status } = req.query;
    let query = {};

    if (jobId) query.jobId = jobId;
    if (candidateId) query.candidateId = candidateId;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('jobId', 'title department')
      .populate('candidateId', 'fullName email')
      .populate('reviewedBy', 'fullName')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('candidateId', 'fullName email phone')
      .populate('reviewedBy', 'fullName');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Public (anyone can apply)
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, candidateName, candidateEmail, candidatePhone, resume, coverLetter } = req.body;

    if (!jobId || !candidateName || !candidateEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (jobId, candidateName, candidateEmail)'
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      candidateEmail: candidateEmail.toLowerCase()
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      candidateId: req.user?.id || null,
      candidateName,
      candidateEmail: candidateEmail.toLowerCase(),
      candidatePhone,
      resume,
      coverLetter,
      status: 'applied'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Admin
exports.updateApplication = async (req, res, next) => {
  try {
    const { status, notes, rating, reviewedBy } = req.body;

    const updateData = {
      updatedAt: new Date()
    };

    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    if (rating) updateData.rating = rating;
    if (reviewedBy) updateData.reviewedBy = reviewedBy;

    // Set reviewedAt when status changes
    if (status) {
      updateData.reviewedAt = new Date();
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('jobId').populate('candidateId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private/Admin
exports.getJobApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('candidateId', 'fullName email phone')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get my applications
// @route   GET /api/applications/candidate/my-applications
// @access  Private/Candidate
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidateId: req.user?.id })
      .populate('jobId', 'title department location')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
};
