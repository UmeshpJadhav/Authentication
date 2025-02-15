const express = require('express');
const { getOrders } = require('../controllers/orderController');
const router = express.Router();

// Get all orders
router.get('/', getOrders);

module.exports = router;