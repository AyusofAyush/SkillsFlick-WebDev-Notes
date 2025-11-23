const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      maxlength: [100, 'Workspace name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    icon: {
      type: String,
      default: '🏢',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['owner', 'admin', 'member', 'viewer'],
          default: 'member',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    settings: {
      allowComments: {
        type: Boolean,
        default: true,
      },
      allowEditing: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
workspaceSchema.index({ owner: 1 });
workspaceSchema.index({ 'members.user': 1 });

module.exports = mongoose.model('Workspace', workspaceSchema);
