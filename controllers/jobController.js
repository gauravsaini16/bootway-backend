const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const { status, department, type } = req.query;
    let query = { isActive: true };
    
    if (status) query.status = status;
    if (department) query.department = department;
    if (type) query.type = type;
    
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new job (HR/Admin only)
// @route   POST /api/jobs
// @access  Private (HR/Admin)
exports.createJob = async (req, res, next) => {
  try {
    console.log('📝 Request body received:', req.body);
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty'
      });
    }

    const { title, department, location, type, salary, description, skills, requirements, responsibilities, benefits } = req.body;

    console.log('Extracting fields:', { title, department, location, type });

    // Validation
    if (!title || !department || !location || !type || !description || !skills || !requirements || !responsibilities) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        received: { title, department, location, type, description, skills, requirements, responsibilities }
      });
    }

    if (!Array.isArray(skills) || !Array.isArray(requirements) || !Array.isArray(responsibilities)) {
      return res.status(400).json({
        success: false,
        message: 'Skills, requirements, and responsibilities must be arrays'
      });
    }

    if (skills.length === 0 || requirements.length === 0 || responsibilities.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Skills, requirements, and responsibilities must have at least one item'
      });
    }

    const jobData = {
      title,
      department,
      location,
      type,
      salary: salary || null,
      description,
      skills,
      requirements,
      responsibilities,
      benefits: benefits || [],
      status: 'active',
      isActive: true
    };

    if (req.user && req.user.id) {
      jobData.postedBy = req.user.id;
    }

    console.log('💾 Saving job data:', jobData);

    const job = await Job.create(jobData);

    console.log('✅ Job created successfully:', job._id);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job
    });
  } catch (err) {
    console.error('❌ Error creating job:', err);
    next(err);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (HR/Admin)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (HR/Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle job status (Active/Closed)
// @route   PATCH /api/jobs/:id/toggle
// @access  Private (HR/Admin)
exports.toggleJobStatus = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job.isActive = !job.isActive;
    job.status = job.isActive ? 'active' : 'closed';
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`,
      data: job
    });
  } catch (err) {
    next(err);
  }
};
