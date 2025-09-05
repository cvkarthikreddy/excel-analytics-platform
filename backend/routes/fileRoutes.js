import express from "express";
import multer from "multer";

// We import the controller functions using named imports
import {
  uploadFile,
  getFileHistory,
  getFileById,
} from "../controllers/fileController.js";

const router = express.Router();

// Use memoryStorage to handle the file as a buffer in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define the API routes and connect them to the controller functions
router.post("/upload", upload.single("file"), uploadFile);
router.get("/history", getFileHistory);
router.get("/:id", getFileById);

// This is the crucial line: it exports the router as the default module.
export default router;
