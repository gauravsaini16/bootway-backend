const Application = require('../models/Application');
const Job = require('../models/job');
const cloudinary = require('cloudinary').v2;
require('../config/cloudinary'); // Ensure config is loaded
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common document formats
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, and image files are allowed.'), false);
    }
  }
});

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
exports.applyForJob = [
  upload.single('resume'),
  async (req, res, next) => {
    try {
      console.log('📦 Request body keys:', Object.keys(req.body));
      console.log('📦 Request body:', req.body);
      console.log('📦 Request file:', req.file ? `File(${req.file.originalname}, ${req.file.size} bytes)` : 'No file');

      const { jobId, candidateName, candidateEmail, candidatePhone } = req.body;

      console.log('📝 Extracted data:', {
        jobId,
        candidateName,
        candidateEmail,
        candidatePhone,
        jobIdType: typeof jobId,
        candidateNameType: typeof candidateName,
        candidateEmailType: typeof candidateEmail
      });

      let resumeUrl = null;

      // Upload resume to Cloudinary if file is provided
      if (req.file) {
        try {
          console.log('🚀 Starting Cloudinary upload for:', req.file.originalname);

          // Debug config
          const config = cloudinary.config();
          console.log('🔧 Cloudinary Config Active:', {
            cloud_name: config.cloud_name,
            api_key_present: !!config.api_key
          });

          const uploadPromise = new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'bootway/resumes',
                public_id: `resume-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
                resource_type: 'auto'
              },
              (error, result) => {
                if (error) {
                  console.error('❌ Cloudinary stream error:', error);
                  reject(error);
                } else {
                  console.log('✅ Cloudinary stream success:', result.secure_url);
                  resolve(result);
                }
              }
            );

            stream.on('error', (err) => {
              console.error('❌ Stream error event:', err);
              reject(err);
            });

            stream.end(req.file.buffer);
          });

          // 15 second timeout
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Cloudinary upload timed out after 15s')), 15000)
          );

          const uploadResult = await Promise.race([uploadPromise, timeoutPromise]);

          resumeUrl = uploadResult.secure_url;
          console.log('✅ Resume uploaded successfully:', resumeUrl);
        } catch (uploadError) {
          console.error('❌ Cloudinary upload failed:', uploadError.message);
          // Don't fail the whole application if resume upload fails? 
          // Probably should fail because resume is required.
          return res.status(500).json({
            success: false,
            message: `Resume upload failed: ${uploadError.message}. Please try again or contact support.`
          });
        }
      }

      if (!jobId || !candidateName || !candidateEmail) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields (jobId, candidateName, candidateEmail)'
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
        resume: resumeUrl,
        coverLetter: req.body.coverLetter,
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
  }
];

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
    // 1. Link any existing anonymous applications with this user's email
    // This fixes the issue where applications made before account creation (or without auth) aren't visible
    if (req.user && req.user.email) {
      await Application.updateMany(
        {
          candidateEmail: req.user.email,
          candidateId: null
        },
        {
          candidateId: req.user.id
        }
      );
    }

    const applications = await Application.find({ candidateId: req.user?.id })
      .populate('jobId', 'title department location type')
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
