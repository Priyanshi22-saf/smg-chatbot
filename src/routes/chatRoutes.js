const express = require('express');
const router = express.Router();
const {
    processChat,
    getChatHistory,
    getChatHealth,
    submitFeedback,
} = require('../controllers/chatController');

/**
 * @route   POST /api/chat
 * @desc    Process user message and get bot response
 * @access  Public
 */
router.post('/', processChat);

/**
 * @route   POST /api/chat/message
 * @desc    Alias for chat message processing (future-friendly)
 * @access  Public
 */
router.post('/message', processChat);

/**
 * @route   GET /api/chat/history/:sessionId
 * @desc    Get conversation history for a session
 * @access  Public
 */
router.get('/history/:sessionId', getChatHistory);

/**
 * @route   GET /api/chat/conversation/:sessionId
 * @desc    Alias for conversation history
 * @access  Public
 */
router.get('/conversation/:sessionId', getChatHistory);

/**
 * @route   GET /api/chat/health
 * @desc    Health check for chat service
 * @access  Public
 */
router.get('/health', getChatHealth);

/**
 * @route   POST /api/chat/feedback
 * @desc    Submit feedback for a conversation
 * @access  Public
 */
router.post('/feedback', submitFeedback);

module.exports = router;

