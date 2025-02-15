const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  basePrice: { type: Number, required: true },
  customPrices: [
    {
      customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      price: { type: Number },
    },
  ],
});

module.exports = mongoose.model('Product', productSchema);