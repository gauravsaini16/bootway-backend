const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  salary: {
    type: String,
    default: null
  },
  description: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true,
    default: []
  },
  requirements: {
    type: [String],
    required: true,
    default: []
  },
  responsibilities: {
    type: [String],
    required: true,
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  applicationsCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
