import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
    trim: true,
  },
  data: {
    type: Array, // Stores the array of JSON objects parsed from the Excel sheet
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("File", FileSchema);
