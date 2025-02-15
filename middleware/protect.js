const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.protect = async (req, res, next) => {
    if(req.cookies.token){
        try{
            const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
            req.user = await userModel.findOne({ email: data.email }).select("-password");
            next();  
        
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
          } 
}

if(!req.cookies.token){
    return res.status(401).json({ message: "Please login first" });
}

    
    
};