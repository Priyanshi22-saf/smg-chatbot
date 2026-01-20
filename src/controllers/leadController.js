const asyncHandler = require('../middlewares/asyncHandler');
const Lead = require('../models/Lead');
const { validateRequired, isValidEmail, isValidPhone } = require('../utils/validators');

/**
 * @route   POST /api/leads
 * @desc    Create a new lead
 * @access  Public
 */
const createLead = asyncHandler(async (req, res) => {
    const { name, phone, email, interest, city, message } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'phone', 'email', 'interest', 'city'];
    const validationErrors = validateRequired(req.body, requiredFields);
    
    if (validationErrors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationErrors,
        });
    }

    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address',
        });
    }

    // Validate phone format
    if (!isValidPhone(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid 10-digit phone number',
        });
    }

    // Validate interest enum
    const validInterests = ['product', 'internship', 'scholarship', 'dealership', 'other'];
    if (!validInterests.includes(interest)) {
        return res.status(400).json({
            success: false,
            message: `Interest must be one of: ${validInterests.join(', ')}`,
        });
    }

    // Check for duplicate lead (same email or phone in last 24 hours)
    const recentLead = await Lead.findOne({
        $or: [{ email }, { phone }],
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (recentLead) {
        return res.status(409).json({
            success: false,
            message: 'A lead with this email or phone was already submitted recently',
        });
    }

    // Create lead
    const lead = await Lead.create({
        name: name.trim(),
        phone: phone.replace(/\D/g, ''), // Remove non-digits
        email: email.toLowerCase().trim(),
        interest,
        city: city.trim(),
        message: message ? message.trim() : '',
    });

    res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: lead,
    });
});

/**
 * @route   GET /api/leads
 * @desc    Get all leads (Admin only)
 * @access  Private (Admin)
 */
const getLeads = asyncHandler(async (req, res) => {
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

    res.status(200).json({
        success: true,
        count: leads.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        data: leads,
    });
});

/**
 * @route   GET /api/leads/:id
 * @desc    Get single lead (Admin only)
 * @access  Private (Admin)
 */
const getLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
        return res.status(404).json({
            success: false,
            message: 'Lead not found',
        });
    }

    res.status(200).json({
        success: true,
        data: lead,
    });
});

/**
 * @route   PUT /api/leads/:id/status
 * @desc    Update lead status (Admin only)
 * @access  Private (Admin)
 */
const updateLeadStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'closed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Status must be one of: ${validStatuses.join(', ')}`,
        });
    }

    const lead = await Lead.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    );

    if (!lead) {
        return res.status(404).json({
            success: false,
            message: 'Lead not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Lead status updated',
        data: lead,
    });
});

module.exports = {
    createLead,
    getLeads,
    getLead,
    updateLeadStatus,
};

