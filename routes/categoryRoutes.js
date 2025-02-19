const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

// Protect routes with authentication middleware (e.g., JWT)
const authenticateUser = (req, res, next) => {
  // Example: Verify JWT token and attach user to `req.user`
  req.user = { _id: 'user-id-here' }; // Replace with actual user ID from token
  next();
};

// Routes
router.post('/add', authenticateUser, cartController.addToCart);
router.put('/update', authenticateUser, cartController.updateCartItem);
router.delete('/remove/:productId', authenticateUser, cartController.removeFromCart);
router.get('/', authenticateUser, cartController.getCart);

module.exports = router;