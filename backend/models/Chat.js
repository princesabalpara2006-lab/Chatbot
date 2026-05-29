import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'New Chat Room'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  personality: {
    type: String,
    enum: ['friendly', 'professional', 'funny', 'teacher', 'motivational'],
    default: 'friendly'
  },
  background: {
    type: String,
    default: 'default'
  }
}, { timestamps: true });

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
