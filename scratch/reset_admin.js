require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const admin = await Admin.findOne();
        if (!admin) {
            console.log('No admin found. Start the server to seed it.');
            process.exit(0);
        }

        const newPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
        const salt = await bcrypt.genSalt(12);
        admin.password = await bcrypt.hash(newPassword, salt);
        
        // Fix role in case it's invalid due to schema changes
        if (admin.role === 'super_admin') {
            admin.role = 'superadmin';
        }

        await admin.save();

        console.log(`Password reset for ${admin.email}`);
        console.log(`New password: ${newPassword}`);
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

resetPassword();
