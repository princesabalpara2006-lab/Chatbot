import mongoose from 'mongoose';

const UploadedFileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  extractedText: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const UploadedFile = mongoose.model('UploadedFile', UploadedFileSchema);
export default UploadedFile;
