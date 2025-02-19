const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// Protect routes with authentication middleware (e.g., JWT)
const authenticateUser = (req, res, next) => {
  // Example: Verify JWT token and attach user to `req.user`
  req.user = { _id: 'user-id-here' }; // Replace with actual user ID from token
  next();
};

// Routes
router.post('/create', authenticateUser, orderController.createOrder);
router.get('/all', authenticateUser, orderController.getAllOrders); // Admin-only route
router.get('/user', authenticateUser, orderController.getUserOrders);
router.put('/status/:orderId', authenticateUser, orderController.updateOrderStatus);
router.put('/cancel/:orderId', authenticateUser, orderController.cancelOrder);

module.exports = router;