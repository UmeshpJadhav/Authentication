const express = require('express');
const router = express.Router();


router.post("/register" , registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/profile", getUserProfile);


module.exports = router;