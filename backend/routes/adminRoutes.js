import express from 'express';
const router = express.Router();
import { getDashboardStats, getAllUsers, getAllFiles } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// All routes in this file are protected and for admins only
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/files', getAllFiles);

export default router;