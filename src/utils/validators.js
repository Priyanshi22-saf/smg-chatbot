/**
 * Validation utilities
 */

/**
 * Validate email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits)
 */
const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, '')); // Remove non-digits first
};

/**
 * Validate required fields
 */
const validateRequired = (data, fields) => {
    const errors = [];
    fields.forEach(field => {
        if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
            errors.push(`${field} is required`);
        }
    });
    return errors;
};

module.exports = {
    isValidEmail,
    isValidPhone,
    validateRequired,
};

