import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import fileRoutes from "./routes/fileRoutes.js";
import adminRoutes from './routes/adminRoutes.js'; // <-- Add this import
import authRoutes from "./routes/authRoutes.js";
// +++ IMPORT THE NEW USER (ADMIN) ROUTES +++
import userRoutes from "./routes/userRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRoutes); // <-- Add this line
// ===== Application Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
// +++ CONNECT THE NEW ADMIN ROUTES TO THE APP +++
app.use("/api/users", userRoutes);

// ===== Error Handling Middleware =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

