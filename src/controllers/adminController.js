const asyncHandler = require('../middlewares/asyncHandler');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const Admin = require('../models/Admin');
const Conversation = require('../models/Conversation');
const Lead = require('../models/Lead');

/**
 * @route   POST /api/admin/login
 * @desc    Admin login
 * @access  Public
 */
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password',
        });
    }

    // Find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    // Check if admin is active
    if (!admin.isActive) {
        return res.status(403).json({
            success: false,
            message: 'Account is deactivated. Please contact administrator.',
        });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                lastLogin: admin.lastLogin,
            },
        },
    });
});

/**
 * @route   GET /api/admin/conversations
 * @desc    Get all conversations with filters (Admin only)
 * @access  Private (Admin)
 */
const getConversations = asyncHandler(async (req, res) => {
    const {
        intent,
        startDate,
        endDate,
        userId,
        sessionId,
        page = 1,
        limit = 50,
    } = req.query;

    // Build query
    const query = {};

    if (intent) {
        query.intent = intent;
    }

    if (userId) {
        query.userId = userId;
    }

    if (sessionId) {
        query.sessionId = sessionId;
    }

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
            query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            query.createdAt.$lte = new Date(endDate);
        }
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const conversations = await Conversation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-metadata.ipAddress'); // Exclude sensitive data

    const total = await Conversation.countDocuments(query);

    // Get intent statistics
    const intentStats = await Conversation.aggregate([
        ...(Object.keys(query).length > 0 ? [{ $match: query }] : []),
        {
            $group: {
                _id: '$intent',
                count: { $sum: 1 },
                avgConfidence: { $avg: '$confidenceScore' },
            },
        },
        { $sort: { count: -1 } },
    ]);

    res.status(200).json({
        success: true,
        count: conversations.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        intentStatistics: intentStats,
        data: conversations,
    });
});

/**
 * @route   GET /api/admin/leads
 * @desc    Get all leads with filters (Admin only)
 * @access  Private (Admin)
 */
const getAdminLeads = asyncHandler(async (req, res) => {
    const {
        interest,
        status,
        startDate,
        endDate,
        page = 1,
        limit = 20,
    } = req.query;

    // Build query
    const query = {};

    if (interest) {
        query.interest = interest;
    }

    if (status) {
        query.status = status;
    }

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
            query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            query.createdAt.$lte = new Date(endDate);
        }
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const leads = await Lead.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await Lead.countDocuments(query);

    // Get statistics
    const interestStats = await Lead.aggregate([
        ...(Object.keys(query).length > 0 ? [{ $match: query }] : []),
        {
            $group: {
                _id: '$interest',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
    ]);

    const statusStats = await Lead.aggregate([
        ...(Object.keys(query).length > 0 ? [{ $match: query }] : []),
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
    ]);

    res.status(200).json({
        success: true,
        count: leads.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        statistics: {
            byInterest: interestStats,
            byStatus: statusStats,
        },
        data: leads,
    });
});

/**
 * @route   GET /api/admin/analytics
 * @desc    Get analytics dashboard data (Admin only)
 * @access  Private (Admin)
 */
const getAnalytics = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
        if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Conversation analytics
    const totalConversations = await Conversation.countDocuments(dateFilter);
    const intentDistribution = await Conversation.aggregate([
        ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
        {
            $group: {
                _id: '$intent',
                count: { $sum: 1 },
                avgConfidence: { $avg: '$confidenceScore' },
            },
        },
        { $sort: { count: -1 } },
    ]);

    // Lead analytics
    const totalLeads = await Lead.countDocuments(dateFilter);
    const leadsByInterest = await Lead.aggregate([
        ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
        {
            $group: {
                _id: '$interest',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
    ]);

    const leadsByStatus = await Lead.aggregate([
        ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
    ]);

    // Daily activity (last 30 days)
    const dailyActivity = await Conversation.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
        success: true,
        data: {
            conversations: {
                total: totalConversations,
                intentDistribution,
            },
            leads: {
                total: totalLeads,
                byInterest: leadsByInterest,
                byStatus: leadsByStatus,
            },
            dailyActivity,
        },
    });
});

/**
 * @route   GET /api/admin/profile
 * @desc    Get admin profile (Admin only)
 * @access  Private (Admin)
 */
const getProfile = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.admin,
    });
});

module.exports = {
    adminLogin,
    getConversations,
    getAdminLeads,
    getAnalytics,
    getProfile,
};

