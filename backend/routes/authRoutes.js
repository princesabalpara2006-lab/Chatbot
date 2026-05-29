import express from 'express';
import {
  register,
  verifyOTP,
  login,
  refresh,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  guestLogin
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/guest', guestLogin);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getCurrentUser);

export default router;
