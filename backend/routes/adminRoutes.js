import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminProtect } from '../middleware/adminMiddleware.js';
import { getAllUsers } from '../controllers/adminController.js';

const router = express.Router();

// Route to get all users - only accessible to admins
router.route('/users').get(protect, adminProtect, getAllUsers);

export default router;
