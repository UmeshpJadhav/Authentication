const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/mogoose-connection");

// ✅ Connect to MongoDB
connectDB();

// ✅ Apply CORS middleware properly
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true // Allows cookies to be sent
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
