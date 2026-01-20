const mongoose = require('mongoose');

/**
 * Conversation Schema
 * Stores user messages and bot responses with intent detection
 */
const conversationSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: null,
        index: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
    },
    intent: {
        type: String,
        required: [true, 'Intent is required'],
        enum: [
            'about_smg',
            'products',
            'services',
            'internships',
            'scholarships',
            'industrial_visit',
            'financing_insurance',
            'contact_social',
            'greeting',
            'leadership',
            'challenges_startup',
            'partnerships',
            'jobs',
            'dealerships',
            'closing',
            'unknown'
        ],
    },
    response: {
        type: String,
        required: [true, 'Response is required'],
    },
    confidenceScore: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
    },
    sessionId: {
        type: String,
        index: true,
    },
    metadata: {
        userAgent: String,
        ipAddress: String,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Indexes for better query performance
conversationSchema.index({ createdAt: -1 });
conversationSchema.index({ intent: 1, createdAt: -1 });
conversationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);

