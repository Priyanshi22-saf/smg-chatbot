const mongoose = require('mongoose');

/**
 * Lead Schema
 * Stores customer inquiries and lead information
 */
const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    interest: {
        type: String,
        required: [true, 'Interest is required'],
        enum: ['product', 'internship', 'scholarship', 'dealership', 'other'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
    },
    message: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'converted', 'closed'],
        default: 'new',
    },
    source: {
        type: String,
        default: 'chatbot',
    },
}, {
    timestamps: true,
});

// Indexes
leadSchema.index({ createdAt: -1 });
leadSchema.index({ interest: 1, createdAt: -1 });
leadSchema.index({ status: 1 });
leadSchema.index({ email: 1 });

module.exports = mongoose.model('Lead', leadSchema);

