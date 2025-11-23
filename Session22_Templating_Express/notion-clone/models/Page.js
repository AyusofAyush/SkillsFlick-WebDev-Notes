const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentPage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page',
      default: null,
    },
    icon: {
      type: String,
      default: '📄',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
pageSchema.index({ workspace: 1, parentPage: 1 });
pageSchema.index({ workspace: 1, isFavorite: 1 });
pageSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Page', pageSchema);
