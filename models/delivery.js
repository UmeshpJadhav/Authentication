const mongoose = require("mongoose");
const Joi = require("joi");

const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true
    },
    deliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: async function(v) {
                const user = await mongoose.model("User").findById(v);
                return user?.role === 'delivery';
            },
            message: "Delivery boy must be a user with delivery role"
        }
    },
    status: {
        type: String,
        enum: ['pending', 'dispatched', 'in-transit', 'delivered', 'cancelled'],
        default: 'pending'
    },
    trackingURL: {
        type: String,
        match: [/^(http|https):\/\/[^ "]+$/, 'Please enter a valid tracking URL']
    },
    estimatedDeliveryTime: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v > Date.now();
            },
            message: "Estimated delivery time must be in the future"
        }
    },
    actualDeliveryTime: Date
}, { timestamps: true });

// Joi Validation Schema
const deliveryValidationSchema = Joi.object({
    order: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid order ID format',
            'any.required': 'Order ID is required'
        }),

    deliveryBoy: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid user ID format',
            'any.required': 'Delivery boy ID is required'
        }),

    status: Joi.string()
        .valid('pending', 'dispatched', 'in-transit', 'delivered', 'cancelled')
        .default('pending'),

    trackingURL: Joi.string()
        .uri()
        .messages({
            'string.uri': 'Invalid tracking URL format'
        }),

    estimatedDeliveryTime: Joi.date()
        .greater('now')
        .required()
        .messages({
            'date.base': 'Invalid delivery time format',
            'date.greater': 'Estimated time must be in the future',
            'any.required': 'Estimated delivery time is required'
        })
});

// Validation Function
const validateDelivery = (deliveryData) => {
    return deliveryValidationSchema.validate(deliveryData, {
        abortEarly: false,
        allowUnknown: false
    });
};

const deliveryModel = mongoose.model("Delivery", deliverySchema);

module.exports = {
    deliveryModel,
    validateDelivery
};