import fs from 'fs';
import path from 'path';
import UploadedFile from '../models/UploadedFile.js';
import { queryAI } from '../utils/ai.js';

// @desc    Upload file and summarize
// @route   POST /api/files/upload
// @access  Private
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { originalname, filename, path: filePath, mimetype, size } = req.file;
    let extractedText = '';

    // If text file, read content
    const ext = path.extname(originalname).toLowerCase();
    if (ext === '.txt') {
      try {
        extractedText = fs.readFileSync(filePath, 'utf-8');
      } catch (err) {
        console.warn(`[File read failure]`, err.message);
      }
    } else if (ext === '.pdf') {
      extractedText = `[Simulated PDF Text Content]\nAnalyzed Document Name: ${originalname}\nDocument structural segments: Metadata header, Page index, Table analyses, Context nodes.`;
    } else if (['.jpg', '.png', '.jpeg', '.gif'].includes(ext)) {
      extractedText = `[Simulated Vision Text Extraction]\nExtracted Image context: An active high-fidelity mockup visual containing structural boxes, user widgets, background gradients, and navigation sliders.`;
    } else {
      extractedText = `[Simulated Document Text Extraction]\nExtracted document schema: Text segments, metadata indexes, paragraphs, references.`;
    }

    // Call AI to generate an advanced summary of file
    const prompt = `Please analyze and summarize this file in a crisp and professional manner: Name: ${originalname}, Size: ${size} bytes, Extracted content: ${extractedText.substring(0, 500)}`;
    const aiSummary = await queryAI(prompt, 'professional');

    const uploadedFile = await UploadedFile.create({
      user: req.user.id,
      fileName: originalname,
      filePath: filePath,
      fileType: mimetype,
      fileSize: size,
      extractedText: extractedText.substring(0, 5000), // Cap database store size
      summary: aiSummary.text
    });

    res.status(201).json({
      success: true,
      file: uploadedFile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user files list
// @route   GET /api/files
// @access  Private
export const getUserFiles = async (req, res, next) => {
  try {
    const files = await UploadedFile.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, files });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user file
// @route   DELETE /api/files/:id
// @access  Private
export const deleteUserFile = async (req, res, next) => {
  try {
    const file = await UploadedFile.findOne({ _id: req.params.id, user: req.user.id });
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Attempt to delete physical file from local drive
    if (fs.existsSync(file.filePath)) {
      try {
        fs.unlinkSync(file.filePath);
      } catch (err) {
        console.warn(`[Local file delete warning] ${err.message}`);
      }
    }

    await file.deleteOne();
    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
};
