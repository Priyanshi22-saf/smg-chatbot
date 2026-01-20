const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const Admin = require('../models/Admin');

/**
 * JWT Authentication Middleware
 * Protects admin routes
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, jwtConfig.secret);

        // Check if admin exists and is active
        const admin = await Admin.findById(decoded.id);
        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or inactive admin account.',
            });
        }

        // Attach admin info to request
        req.admin = admin;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.',
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Authentication error.',
        });
    }
};

module.exports = { authenticate };

