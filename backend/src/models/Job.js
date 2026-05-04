const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name too long'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      maxlength: [100, 'Position title too long'],
    },
    location: {
      type: String,
      default: 'Remote',
      trim: true,
    },
    status: {
      type: String,
      enum: ['wishlist', 'applied', 'interview', 'offer', 'rejected'],
      default: 'applied',
    },
    salary: {
      type: String,
      default: '',
      trim: true,
    },
    url: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast queries per user
jobSchema.index({ user: 1, status: 1 });
jobSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
