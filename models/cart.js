const mongoose = require("mongoose");
const Joi = require("joi");

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
        default: 1
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
}, { timestamps: true });

// Joi Validation Schema
const cartValidationSchema = Joi.object({
    items: Joi.array()
        .items(Joi.object({
            productId: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required()
                .messages({
                    'string.pattern.base': 'Invalid product ID format',
                    'any.required': 'Product ID is required'
                }),
            quantity: Joi.number()
                .integer()
                .min(1)
                .max(100)
                .required()
                .messages({
                    'number.base': 'Quantity must be a number',
                    'number.min': 'Minimum quantity is 1',
                    'number.max': 'Maximum quantity is 100',
                    'any.required': 'Quantity is required'
                })
        }))
        .required(),
    totalPrice: Joi.number()
        .precision(2)
        .min(0)
        .messages({
            'number.base': 'Total price must be a number',
            'number.min': 'Total price cannot be negative'
        })
});

// Validation Function
const validateCart = (cartData) => {
    return cartValidationSchema.validate(cartData, {
        abortEarly: false,
        allowUnknown: false
    });
};

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = {
    cartModel,
    validateCart
};