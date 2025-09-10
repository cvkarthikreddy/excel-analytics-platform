import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// User Registration
// Corrected route to match the frontend API call
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

export default router;
