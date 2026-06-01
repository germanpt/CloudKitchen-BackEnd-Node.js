const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cloud Kitchen API Running..",
  });
});

// Routes
app.use("/api/auth", authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
