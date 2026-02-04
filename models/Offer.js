const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    candidateName: {
      type: String,
      required: true
    },
    candidateEmail: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    salary: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    startDate: {
      type: Date,
      required: true
    },
    offerValidTill: {
      type: Date,
      required: true
    },
    jobDescription: {
      type: String,
      default: null
    },
    benefits: [String],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'expired'],
      default: 'pending'
    },
    respondedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: null
    },
    documents: [String],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);
