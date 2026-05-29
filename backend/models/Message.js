import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  reactions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emoji: { type: String }
    }
  ],
  isRead: {
    type: Boolean,
    default: false
  },
  fileAttachment: {
    name: { type: String },
    url: { type: String },
    fileType: { type: String },
    summary: { type: String }
  }
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);
export default Message;
