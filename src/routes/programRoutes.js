const express = require('express');
const router = express.Router();
const { getPrograms, getProgramByType } = require('../controllers/programController');

/**
 * @route   GET /api/programs
 * @desc    Get all SMG programs (Internships, Scholarships, Industrial Visits)
 * @access  Public
 */
router.get('/', getPrograms);

/**
 * @route   GET /api/programs/:type
 * @desc    Get specific program by type (internship, scholarship, industrial-visit)
 * @access  Public
 */
router.get('/:type', getProgramByType);

module.exports = router;

