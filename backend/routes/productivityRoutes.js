import express from 'express';
import {
  createReminder,
  getReminders,
  completeReminder,
  deleteReminder,
  updateUserSettings,
  updateUserMemory,
  getWeather,
  getNews
} from '../controllers/productivityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/reminders', protect, createReminder);
router.get('/reminders', protect, getReminders);
router.put('/reminders/:id/complete', protect, completeReminder);
router.delete('/reminders/:id', protect, deleteReminder);
router.put('/settings', protect, updateUserSettings);
router.put('/memory', protect, updateUserMemory);
router.get('/weather', protect, getWeather);
router.get('/news', protect, getNews);

export default router;
