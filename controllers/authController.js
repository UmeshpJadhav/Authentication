const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const userModel = require("../models/user-model");

module.exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        user = await userModel.create({ // ✅ Added `await`
            name,
            email,
            password: hashedPassword
        });

        let token = generateToken({ email });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // ✅ Fix for localhost
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24
        });

        res.status(201).json(user); // ✅ Send JSON response
    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.loginUser = async function (req, res) {
    try {
      console.log("Received Data:", req.body); // Log the incoming data
  
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      let user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      let result = await bcrypt.compare(password, user.password);
      if (result) {
        let token = generateToken({ email });
  
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 60 * 24,
        });
  
        return res.status(200).json({ message: "User logged in successfully" });
      } else {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

module.exports.logoutUser = function (req, res) {
    res.cookie("token", "", {
        httpOnly: true,
        secure: false, // ✅ Fix for localhost
        sameSite: "lax",
        maxAge: 0 // ✅ Expire cookie immediately
    });
    res.status(200).json({ message: "Logged out successfully" });
};

module.exports.getUserProfile = async function (req, res) {
    try {
        const user = await userModel.findOne({ email: req.user.email }).select("-password"); // ✅ Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Profile Fetch Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
