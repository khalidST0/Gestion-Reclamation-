const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const reclamationRoutes = require("./routes/reclamation.routes");

const authMiddleware = require("./middleware/auth.middleware");

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true 
}));
app.use(express.json());

// Connect PostgreSQL
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reclamations", reclamationRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// Protected profile route
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});