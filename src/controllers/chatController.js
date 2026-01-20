const asyncHandler = require('../middlewares/asyncHandler');
const Conversation = require('../models/Conversation');
const chatbotService = require('../services/chatbotService');
const Feedback = require('../models/Feedback');

/**
 * @route   POST /api/chat
 * @desc    Process user message and return bot response
 * @access  Public
 */
const processChat = asyncHandler(async (req, res) => {
    const { userMessage, userId, sessionId } = req.body;

    // Validation
    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
        return res.status(400).json({
            success: false,
            message: 'userMessage is required and must be a non-empty string',
        });
    }

    // Process message through chatbot service
    const { reply, intentName, confidenceScore } = chatbotService.processMessage(userMessage);

    // Get client metadata
    const metadata = {
        userAgent: req.get('user-agent') || '',
        ipAddress: req.ip || req.connection.remoteAddress || '',
    };

    // Create conversation log
    const conversation = await Conversation.create({
        userId: userId || null,
        message: userMessage.trim(),
        intent: intentName,
        response: reply,
        confidenceScore,
        sessionId: sessionId || `session_${Date.now()}`,
        metadata,
    });

    // Return response
    res.status(200).json({
        success: true,
        data: {
            botReply: reply,
            intentName,
            confidenceScore,
            conversationId: conversation._id,
            sessionId: conversation.sessionId,
        },
    });
});

/**
 * @route   GET /api/chat/history/:sessionId
 * @desc    Get conversation history for a session
 * @access  Public
 */
const getChatHistory = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 50;

    const conversations = await Conversation.find({ sessionId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('message intent response createdAt');

    res.status(200).json({
        success: true,
        count: conversations.length,
        data: conversations.reverse(), // Reverse to show chronological order
    });
});

/**
 * @route   GET /api/chat/health
 * @desc    Health check for chat service
 * @access  Public
 */
const getChatHealth = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SMG Chat Service is healthy',
        service: 'smg-chatbot',
        timestamp: new Date().toISOString(),
    });
});

/**
 * @route   POST /api/chat/feedback
 * @desc    Submit feedback for a specific conversation
 * @access  Public
 */
const submitFeedback = asyncHandler(async (req, res) => {
    const { conversationId, rating, comment } = req.body;

    if (!conversationId) {
        return res.status(400).json({
            success: false,
            message: 'conversationId is required for feedback',
        });
    }

    // Basic rating validation if provided
    if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
        return res.status(400).json({
            success: false,
            message: 'rating must be a number between 1 and 5',
        });
    }

    // Ensure conversation exists (soft check)
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        return res.status(404).json({
            success: false,
            message: 'Conversation not found',
        });
    }

    const feedback = await Feedback.create({
        conversationId,
        sessionId: conversation.sessionId,
        rating: rating || null,
        comment: (comment || '').toString().trim() || null,
        intent: conversation.intent,
    });

    res.status(201).json({
        success: true,
        data: {
            feedbackId: feedback._id,
        },
    });
});

module.exports = {
    processChat,
    getChatHistory,
    getChatHealth,
    submitFeedback,
};

