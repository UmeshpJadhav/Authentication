const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9\s\-&]+$/.test(v);
            },
            message: props => `Category name can only contain letters, numbers, spaces, hyphens, and ampersands`
        },
        set: function(name) {
            // Convert to lowercase and remove extra spaces
            return name.trim().replace(/\s+/g, ' ');
        }
    },
    slug: {
        type: String,
        unique: true
    }
}, { timestamps: true });

// Joi Validation Schema
const categoryValidationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .regex(/^[a-zA-Z0-9\s\-&]+$/)
        .messages({
            'string.empty': 'Category name is required',
            'string.min': 'Category name must be at least {#limit} characters',
            'string.max': 'Category name cannot exceed {#limit} characters',
            'string.pattern.base': 'Category name can only contain letters, numbers, spaces, hyphens, and ampersands'
        })
});

// Pre-save hook to generate slug
categorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
    next();
});

// Validation Function
const validateCategory = (categoryData) => {
    return categoryValidationSchema.validate(categoryData, { 
        abortEarly: false,
        allowUnknown: false
    });
};

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = {
    categoryModel,
    validateCategory
};