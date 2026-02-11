const Interview = require('../models/Interview');

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private
exports.getInterviews = async (req, res, next) => {
  try {
    const { jobId, candidateId, status } = req.query;
    let query = {};

    if (jobId) query.jobId = jobId;
    if (candidateId) query.candidateId = candidateId;
    if (status) query.status = status;

    const interviews = await Interview.find(query)
      .populate('applicationId')
      .populate('jobId', 'title department')
      .populate('candidateId', 'fullName email')
      .populate('scheduledBy', 'fullName')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Private
exports.getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('applicationId')
      .populate('jobId')
      .populate('candidateId')
      .populate('scheduledBy', 'fullName');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Schedule interview
// @route   POST /api/interviews
// @access  Private/Admin/HR
exports.scheduleInterview = async (req, res, next) => {
  try {
    const {
      applicationId,
      jobId,
      candidateId,
      interviewType,
      scheduledDate,
      duration,
      interviewers,
      meetingLink,
      location
    } = req.body;

    if (!applicationId || !jobId || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const interview = await Interview.create({
      applicationId,
      jobId,
      candidateId,
      scheduledBy: req.user?.id,
      interviewType: interviewType || 'video',
      scheduledDate,
      duration: duration || 60,
      interviewers: interviewers || [],
      meetingLink,
      location
    });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: interview
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private/Admin/HR
exports.updateInterview = async (req, res, next) => {
  try {
    const { status, feedback, rating, notes, scheduledDate, interviewers } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (feedback) updateData.feedback = feedback;
    if (rating) updateData.rating = rating;
    if (notes) updateData.notes = notes;
    if (scheduledDate) updateData.scheduledDate = scheduledDate;
    if (interviewers) updateData.interviewers = interviewers;

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('candidateId').populate('jobId');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      data: interview
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private/Admin/HR
exports.deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get my interviews
// @route   GET /api/interviews/candidate/my-interviews
// @access  Private/Candidate
exports.getMyInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ candidateId: req.user?.id })
      .populate('jobId', 'title department')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (err) {
    next(err);
  }
};
