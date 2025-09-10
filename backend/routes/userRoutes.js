import express from 'express';
const router = express.Router();
import { getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// This route is protected by both 'protect' (must be logged in)
// and 'admin' (must be an admin) middleware
router.route('/').get(protect, admin, getUsers);

export default router;
