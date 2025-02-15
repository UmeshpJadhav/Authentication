//const { Router } = require('express');
const jwt = require("jsonwebtoken");

const generateToken = (data) =>{
    console.log(process.env.JWT_SECRET_KEY);
    
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
}

module.exports = generateToken;
