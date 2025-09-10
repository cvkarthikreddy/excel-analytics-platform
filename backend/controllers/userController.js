import User from '../models/UserModel.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password'); // Find all users, exclude passwords
    res.json(users);
};

export { getUsers };
