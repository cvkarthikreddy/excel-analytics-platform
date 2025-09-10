import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import { protect } from '../middleware/authMiddleware.js';
import File from '../models/FileModel.js';

const router = express.Router();

// Use memory storage to handle the file as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @desc    Upload a new file, parse it, and save to DB
 * @route   POST /api/files/upload
 * @access  Private
 */
const uploadFileController = async (req, res) => {
  const userId = req.user.id;
  if (!req.file) {
    return res.status(400).json({ message: 'No file was uploaded.' });
  }
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    const headers = data[0];
    const rows = data.slice(1).map(rowArray => {
      let rowObject = {};
      headers.forEach((header, index) => {
        rowObject[header] = rowArray[index];
      });
      return rowObject;
    });

    const newFile = await File.create({
      user: userId,
      originalName: req.file.originalname,
      headers,
      rows,
    });

    const responseData = {
        fileInfo: {
            _id: newFile._id,
            originalName: newFile.originalName,
            uploadDate: newFile.uploadDate,
        },
        headers: newFile.headers,
        rows: newFile.rows
    };
    res.status(201).json(responseData);

  } catch (error) {
    console.error("Error saving file to DB:", error);
    res.status(500).json({ message: "Failed to process and save the file." });
  }
};

/**
 * @desc    Get the file history for the logged-in user
 * @route   GET /api/files/history
 * @access  Private
 */
const getHistoryController = async (req, res) => {
  const userId = req.user.id;
  // Find files for the user and sort by newest first
  const filesForUser = await File.find({ user: userId }).sort({ createdAt: -1 });

  const historyData = filesForUser.map(file => ({
      fileInfo: {
        _id: file._id,
        originalName: file.originalName,
        uploadDate: file.uploadDate,
      },
      headers: file.headers,
      rows: file.rows,
  }));
  res.status(200).json(historyData);
};

/**
 * @desc    Delete a file for the logged-in user
 * @route   DELETE /api/files/:id
 * @access  Private
 */
const deleteFileController = async (req, res) => {
  const userId = req.user.id;
  const fileIdToDelete = req.params.id;
  // Ensure the user owns the file before deleting
  const file = await File.findOne({ _id: fileIdToDelete, user: userId });
  if (file) {
      await file.deleteOne();
      res.status(200).json({ message: `File ${fileIdToDelete} deleted.` });
  } else {
      res.status(404).json({ message: 'File not found or you do not have permission to delete it.' });
  }
};

router.post('/upload', protect, upload.single('file'), uploadFileController);
router.get('/history', protect, getHistoryController);
router.delete('/:id', protect, deleteFileController);

export default router;