const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const {
    adminLogin,
    getConversations,
    getAdminLeads,
    getAnalytics,
    getProfile,
} = require('../controllers/adminController');

/**
 * @route   POST /api/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/login', adminLogin);

/**
 * @route   GET /api/admin/profile
 * @desc    Get admin profile
 * @access  Private (Admin)
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   GET /api/admin/conversations
 * @desc    Get all conversations with filters
 * @access  Private (Admin)
 */
router.get('/conversations', authenticate, getConversations);

/**
 * @route   GET /api/admin/leads
 * @desc    Get all leads with filters
 * @access  Private (Admin)
 */
router.get('/leads', authenticate, getAdminLeads);

/**
 * @route   GET /api/admin/analytics
 * @desc    Get analytics dashboard data
 * @access  Private (Admin)
 */
router.get('/analytics', authenticate, getAnalytics);

module.exports = router;

