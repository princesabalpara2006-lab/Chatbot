import express from 'express';
import {
  getAnalytics,
  getAllUsers,
  toggleUserBlock,
  deleteUser,
  getSystemLogs
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/analytics', protect, admin, getAnalytics);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/block', protect, admin, toggleUserBlock);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/logs', protect, admin, getSystemLogs);

export default router;
