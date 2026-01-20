const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const {
    createLead,
    getLeads,
    getLead,
    updateLeadStatus,
} = require('../controllers/leadController');

/**
 * @route   POST /api/leads
 * @desc    Create a new lead
 * @access  Public
 */
router.post('/', createLead);

/**
 * @route   GET /api/leads
 * @desc    Get all leads (with filters)
 * @access  Private (Admin)
 */
router.get('/', authenticate, getLeads);

/**
 * @route   GET /api/leads/:id
 * @desc    Get single lead
 * @access  Private (Admin)
 */
router.get('/:id', authenticate, getLead);

/**
 * @route   PUT /api/leads/:id/status
 * @desc    Update lead status
 * @access  Private (Admin)
 */
router.put('/:id/status', authenticate, updateLeadStatus);

module.exports = router;

