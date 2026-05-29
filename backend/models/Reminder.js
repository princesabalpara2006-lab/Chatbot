import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isNotified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Reminder = mongoose.model('Reminder', ReminderSchema);
export default Reminder;
