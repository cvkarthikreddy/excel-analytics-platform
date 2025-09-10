// This file MUST be named FileModel.js
import mongoose from 'mongoose';

const fileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    originalName: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    headers: {
      type: [String],
      required: true,
    },
    rows: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model('File', fileSchema);

export default File;