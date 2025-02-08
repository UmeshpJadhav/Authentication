

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const userModel = require("../models/user-model");

module.exports.registerUser = async  (req, res) => {
     try{
        const { name, email, password } = req.body;
 
        let user = await  userModel.findOne({ email });
          
          if (user) {
            return res.status(400).json({ message: "User already exists" });
          }
    
          let salt = await bcrypt.genSalt(10);
          let hashedPassword = await bcrypt.hash(password, salt);
    
        user = userModel.create({ 
            name, 
            email, 
            password: hashedPassword
         });
    
        let token = generateToken({ email});
    
        res.cookie("token", token, {
            httpOnly: true,
            secure : true,
            maxAge : 1000 * 60 * 60 * 24
        });
           res.status(201).send(user);
     }
     catch(err){
        res.status(500).json({ message: err.message });
     }
 };

module.exports.loginUser = function (req, res) { };

module.exports.logoutUser = function (req, res) { };

module.exports.getUserProfile = function (req, res) { };
