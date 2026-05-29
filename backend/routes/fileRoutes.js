import express from 'express';
import { uploadFile, getUserFiles, deleteUserFile } from '../controllers/fileController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/fileUpload.js';

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/', protect, getUserFiles);
router.delete('/:id', protect, deleteUserFile);

export default router;
