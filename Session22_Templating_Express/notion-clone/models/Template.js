const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['personal', 'work', 'education', 'project', 'general'],
    },
    icon: {
      type: String,
      default: '📄',
    },
    content: {
      type: String,
      default: '',
    },
    tags: [String],
    isPublic: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
templateSchema.index({ category: 1 });
templateSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Template', templateSchema);
