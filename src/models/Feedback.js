const mongoose = require('mongoose');

/**
 * Feedback Schema
 * Stores user feedback for chatbot conversations
 */
const feedbackSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true,
        },
        sessionId: {
            type: String,
            index: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },
        comment: {
            type: String,
            trim: true,
            default: null,
        },
        intent: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);


