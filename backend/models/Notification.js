import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['info', 'alert', 'reminder', 'system'],
    default: 'info'
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
