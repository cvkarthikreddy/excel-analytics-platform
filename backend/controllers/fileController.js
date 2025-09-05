import XLSX from "xlsx";
import File from "../models/File.js"; // Note the .js extension for ES Modules

// @desc    Upload & Parse Excel file, then save to MongoDB
// @route   POST /api/files/upload
export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }

  try {
    // Parse the Excel file from the buffer in memory
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (sheetData.length === 0) {
      return res.status(400).json({ success: false, error: "Excel file is empty or invalid." });
    }

    // Create a new File document using the Mongoose model
    const newFile = new File({
      originalName: req.file.originalname,
      data: sheetData,
    });

    await newFile.save();

    res.status(201).json({
      success: true,
      message: "File uploaded and stored successfully",
      fileId: newFile._id,
    });
  } catch (error) {
    console.error("Server Error in uploadFile:", error);
    res.status(500).json({ success: false, error: "Server error during file processing" });
  }
};

// @desc    Get history of uploaded files (metadata only for efficiency)
// @route   GET /api/files/history
export const getFileHistory = async (req, res) => {
  try {
    // Fetch files, but only select the name, ID, and creation date to keep the response lightweight
    const files = await File.find().select("originalName createdAt").sort({ createdAt: -1 });
    res.status(200).json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error fetching history" });
  }
};

// @desc    Get the full data of a specific file by its ID
// @route   GET /api/files/:id
export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found with that ID" });
    }
    res.status(200).json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error fetching file data" });
  }
};
