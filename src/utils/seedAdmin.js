require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/database');

/**
 * Seed script to create default admin user
 * Usage: npm run seed
 */
const seedAdmin = async () => {
    try {
        // Connect to database
        await connectDB();

        // Default admin credentials (change in production!)
        const adminData = {
            email: process.env.ADMIN_EMAIL || 'admin@smg.com',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            name: 'SMG Admin',
            role: 'admin',
        };

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: adminData.email });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log(`   Email: ${adminData.email}`);
            process.exit(0);
        }

        // Create admin
        const admin = await Admin.create(adminData);
        
        console.log('✅ Default admin created successfully!');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${adminData.password}`);
        console.log('\n⚠️  Please change the default password after first login!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

// Run seed
seedAdmin();

