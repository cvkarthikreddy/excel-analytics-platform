import User from '../models/UserModel.js';
import File from '../models/FileModel.js'; 

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const fileCount = await File.countDocuments();
    res.json({ users: userCount, files: fileCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all uploaded files
// @route   GET /api/admin/files
// @access  Private/Admin
const getAllFiles = async (req, res) => {
  try {
    const files = await File.find({}).populate('user', 'name email').sort({ createdAt: -1 });

    // --- THIS IS THE FIX ---
    // We now map over the results to format them consistently
    // with the user's history endpoint.
    const formattedFiles = files.map(file => ({
      _id: file._id, // Pass the top-level _id for the navigate function
      fileInfo: {
        _id: file._id,
        originalName: file.originalName,
        uploadDate: file.uploadDate,
      },
      headers: file.headers,
      rows: file.rows,
      user: file.user // Keep the populated user info
    }));

    res.json(formattedFiles);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getDashboardStats, getAllUsers, getAllFiles };