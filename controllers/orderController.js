const Order = require('../models/order');

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId').populate('products.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};