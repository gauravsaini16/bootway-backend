const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
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
    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    interviewType: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'group'],
      default: 'video'
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      default: 60 // in minutes
    },
    interviewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    meetingLink: {
      type: String,
      default: null
    },
    location: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    },
    feedback: {
      type: String,
      default: null
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null
    },
    notes: {
      type: String,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    },
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

module.exports = mongoose.model('Interview', interviewSchema);
