const express = require('express');
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const router = express.Router();

// Add a new product
router.post('/', addProduct);

// Get all products
router.get('/', getProducts);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

module.exports = router;