import express from 'express';
import {
  createChat,
  getChats,
  getChatMessages,
  pinChat,
  updateChat,
  deleteChat,
  addReaction,
  deleteMessage
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createChat);
router.get('/', protect, getChats);
router.get('/:id/messages', protect, getChatMessages);
router.put('/:id/pin', protect, pinChat);
router.put('/:id', protect, updateChat);
router.delete('/:id', protect, deleteChat);
router.post('/messages/:msgId/react', protect, addReaction);
router.delete('/messages/:msgId', protect, deleteMessage);

export default router;
