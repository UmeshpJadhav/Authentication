const { orderModel, validateOrder } = require('../models/order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Validate input
    const { error } = validateOrder(orderData);
    if (error) {
      return res.status(400).json({ message: 'Validation failed', errors: error.details });
    }

    // Create the order
    const order = new orderModel(orderData);

    // Save the order to the database
    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all orders (admin view)
exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all orders with populated references
    const orders = await orderModel
      .find()
      .populate('user', 'name email') // Populate user details
      .populate('products.product', 'name price') // Populate product details
      .populate('address') // Populate address details
      .populate('payment') // Populate payment details
      .populate('delivery') // Populate delivery details
      .exec();

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in the request (e.g., via authentication middleware)

    // Fetch orders for the user with populated references
    const orders = await orderModel
      .find({ user: userId })
      .populate('products.product', 'name price')
      .populate('address')
      .populate('payment')
      .populate('delivery')
      .exec();

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the status of an order
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate the status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the order and update its status
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow cancellation if the order is not already shipped or delivered
    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel an order that is already shipped or delivered' });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};