import User from '../models/User.js';

/**
 * @description Admin protection middleware
 * Checks if the logged-in user has an 'admin' role.
 * Must be used after the 'protect' middleware.
 */
export const adminProtect = async (req, res, next) => {
  // Assuming protect middleware has already run and attached user to the request
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Not authorized as an admin' });
  }
};
