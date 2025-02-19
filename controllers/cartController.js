const { cartModel, validateCart } = require('../models/cart');

// Add a product to the cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // Assuming user ID is available in the request (e.g., via authentication middleware)

    // Validate input
    const { error } = validateCart({
      items: [{ productId, quantity }],
      totalPrice: 0, // Placeholder for validation
    });
    if (error) {
      return res.status(400).json({ message: 'Validation failed', errors: error.details });
    }

    // Find the user's cart
    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new cartModel({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      // Update the quantity of the existing product
      existingItem.quantity += quantity;
    } else {
      // Add the new product to the cart
      cart.items.push({ product: productId, quantity });
    }

    // Recalculate the total price (assuming product prices are fetched dynamically)
    // For simplicity, we'll just calculate based on quantity here
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * 10, 0); // Replace `10` with actual product price

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the quantity of a product in the cart
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Validate input
    const { error } = validateCart({
      items: [{ productId, quantity }],
      totalPrice: 0, // Placeholder for validation
    });
    if (error) {
      return res.status(400).json({ message: 'Validation failed', errors: error.details });
    }

    // Find the user's cart
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the product in the cart
    const itemToUpdate = cart.items.find((item) => item.product.toString() === productId);

    if (!itemToUpdate) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Update the quantity
    itemToUpdate.quantity = quantity;

    // Recalculate the total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * 10, 0); // Replace `10` with actual product price

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Find the user's cart
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove the product from the cart
    const updatedItems = cart.items.filter((item) => item.product.toString() !== productId);

    // Recalculate the total price
    cart.totalPrice = updatedItems.reduce((total, item) => total + item.quantity * 10, 0); // Replace `10` with actual product price

    // Update the cart items
    cart.items = updatedItems;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch the user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user's cart
    const cart = await cartModel
      .findOne({ user: userId })
      .populate('items.product') // Populate product details
      .exec();

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};