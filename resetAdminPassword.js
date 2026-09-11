require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin'); // Adjust path if needed

async function resetPassword() {
    try {
        // Read credentials from .env
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@rongo.org';
        const newPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'RongoAdmin2026!';

        console.log(`Connecting to database...`);
        // Ensure this is your production URI if you want to change it in production
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        let admin = await Admin.findOne({ email: adminEmail.toLowerCase().trim() });

        if (!admin) {
            console.log(`Admin with email ${adminEmail} not found. Creating a new admin account...`);
            admin = new Admin({ email: adminEmail.toLowerCase().trim(), role: 'superadmin' });
        } else {
            console.log(`Found admin: ${admin.email}`);
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);

        await admin.save();
        console.log(`Password for ${admin.email} has been updated successfully!`);

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        mongoose.disconnect();
        process.exit(0);
    }
}

resetPassword();
