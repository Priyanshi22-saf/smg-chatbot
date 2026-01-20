const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @route   GET /api/programs
 * @desc    Get information about SMG programs (Internships, Scholarships, Industrial Visits)
 * @access  Public
 */
const getPrograms = asyncHandler(async (req, res) => {
    const programs = {
        smgNirmaan: {
            name: 'SMG Nirmaan Programme',
            type: 'internship',
            description: 'Our flagship internship program offering hands-on experience in electric vehicle technology',
            duration: '3-6 months',
            eligibility: [
                'Engineering students (B.Tech/M.Tech)',
                'Recent graduates',
                'Professionals seeking industry exposure',
            ],
            benefits: [
                'Hands-on experience in electric vehicle technology',
                'Industry exposure and mentorship',
                'Stipend provided',
                'Certificate of completion',
                'Potential job opportunities',
            ],
            areas: [
                'Manufacturing & Production',
                'Research & Development',
                'Sales & Marketing',
                'Quality Assurance',
                'Supply Chain Management',
            ],
            applicationProcess: [
                'Submit application with resume',
                'Initial screening',
                'Interview/assessment',
                'Selection and onboarding',
            ],
        },
        smgScholarships: {
            name: 'SMG Scholarships',
            type: 'scholarship',
            description: 'Educational scholarships for deserving students pursuing technical/engineering courses',
            duration: 'Annual/Semester-based',
            eligibility: [
                'Students pursuing technical/engineering courses',
                'Merit-based selection',
                'Financial need consideration',
            ],
            benefits: [
                'Financial assistance for education',
                'Recognition and certificate',
                'Mentorship opportunities',
                'Potential internship opportunities',
            ],
            applicationProcess: [
                'Submit application with academic records',
                'Documentation verification',
                'Interview/assessment',
                'Selection and disbursement',
            ],
            coverage: [
                'Tuition fees',
                'Study materials',
                'Partial living expenses',
            ],
        },
        smgBhraman: {
            name: 'SMG Bhraman - Industrial Visit Program',
            type: 'industrial_visit',
            description: 'Experience our manufacturing facility and learn about electric vehicle production',
            duration: 'Half-day or Full-day visits',
            eligibility: [
                'Educational institutions',
                'Student groups (minimum 10 students)',
                'Engineering colleges',
                'Technical training institutes',
            ],
            benefits: [
                'Practical learning experience',
                'Industry insights',
                'Networking opportunities',
                'Certificate of participation',
            ],
            whatYouWillSee: [
                'Manufacturing process',
                'Quality control systems',
                'Research & Development labs',
                'Assembly lines',
                'Testing facilities',
            ],
            scheduling: [
                'Advance booking required',
                'Available on weekdays',
                'Group size: 10-50 students',
                'Guided tours with experts',
            ],
        },
    };

    res.status(200).json({
        success: true,
        count: Object.keys(programs).length,
        data: programs,
    });
});

/**
 * @route   GET /api/programs/:type
 * @desc    Get specific program by type
 * @access  Public
 */
const getProgramByType = asyncHandler(async (req, res) => {
    const { type } = req.params;

    const programMap = {
        internship: 'smgNirmaan',
        scholarship: 'smgScholarships',
        'industrial-visit': 'smgBhraman',
        bhraman: 'smgBhraman',
        nirmaan: 'smgNirmaan',
    };

    const programKey = programMap[type.toLowerCase()];

    if (!programKey) {
        return res.status(404).json({
            success: false,
            message: 'Program not found. Available types: internship, scholarship, industrial-visit',
        });
    }

    // Import programs data (in real app, this would come from database)
    const programs = {
        smgNirmaan: {
            name: 'SMG Nirmaan Programme',
            type: 'internship',
            description: 'Our flagship internship program offering hands-on experience in electric vehicle technology',
            duration: '3-6 months',
            eligibility: [
                'Engineering students (B.Tech/M.Tech)',
                'Recent graduates',
                'Professionals seeking industry exposure',
            ],
            benefits: [
                'Hands-on experience in electric vehicle technology',
                'Industry exposure and mentorship',
                'Stipend provided',
                'Certificate of completion',
                'Potential job opportunities',
            ],
        },
        smgScholarships: {
            name: 'SMG Scholarships',
            type: 'scholarship',
            description: 'Educational scholarships for deserving students',
            duration: 'Annual/Semester-based',
            eligibility: [
                'Students pursuing technical/engineering courses',
                'Merit-based selection',
            ],
            benefits: [
                'Financial assistance for education',
                'Recognition and certificate',
            ],
        },
        smgBhraman: {
            name: 'SMG Bhraman - Industrial Visit Program',
            type: 'industrial_visit',
            description: 'Experience our manufacturing facility',
            duration: 'Half-day or Full-day visits',
            eligibility: [
                'Educational institutions',
                'Student groups (minimum 10 students)',
            ],
            benefits: [
                'Practical learning experience',
                'Industry insights',
            ],
        },
    };

    res.status(200).json({
        success: true,
        data: programs[programKey],
    });
});

module.exports = {
    getPrograms,
    getProgramByType,
};

