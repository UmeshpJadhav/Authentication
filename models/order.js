const mongoose = require("mongoose");
const Joi = require("joi");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({ 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    products: [orderItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery"
    }
}, { timestamps: true });

// Joi Validation Schema
const orderValidationSchema = Joi.object({
    user: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid user ID format',
            'any.required': 'User ID is required'
        }),

    products: Joi.array()
        .items(Joi.object({
            product: Joi.string()
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
                    'number.max': 'Maximum quantity is 100'
                }),
            price: Joi.number()
                .precision(2)
                .min(0)
                .required()
                .messages({
                    'number.base': 'Price must be a number',
                    'number.min': 'Price cannot be negative'
                })
        }))
        .required(),

    totalPrice: Joi.number()
        .precision(2)
        .min(0)
        .required()
        .messages({
            'number.base': 'Total price must be a number',
            'number.min': 'Total price cannot be negative'
        }),

    address: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid address ID format',
            'any.required': 'Address is required'
        }),

    status: Joi.string()
        .valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
        .default('pending'),

    payment: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid payment ID format',
            'any.required': 'Payment ID is required'
        }),

    delivery: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional()
});

// Validation Function
const validateOrder = (orderData) => {
    return orderValidationSchema.validate(orderData, {
        abortEarly: false,
        allowUnknown: false
    });
};

// Pre-save hook to calculate total price
orderSchema.pre('save', async function(next) {
    if (this.isModified('products')) {
        this.totalPrice = this.products.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    next();
});

const orderModel = mongoose.model("Order", orderSchema);

module.exports = {
    orderModel,
    validateOrder
};