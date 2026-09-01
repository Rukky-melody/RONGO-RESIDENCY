const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

/**
 * POST /api/admin/login
 * Validates credentials and returns a signed JWT.
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            admin: { email: admin.email, role: admin.role }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Server error during login.' });
    }
};

/**
 * GET /api/admin/verify
 * Protected — returns the decoded admin payload if token is valid.
 */
const verifyToken = (req, res) => {
    res.json({ valid: true, admin: req.admin });
};

/**
 * PUT /api/admin/credentials
 * Protected — updates admin email and/or password.
 */
const updateCredentials = async (req, res) => {
    try {
        const { currentPassword, newEmail, newPassword } = req.body;
        const adminId = req.admin.id;

        if (!currentPassword) {
            return res.status(400).json({ error: 'Current password is required to make changes.' });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect current password.' });
        }

        if (newEmail) {
            // Check if email is already taken by another admin (if applicable)
            const existing = await Admin.findOne({ email: newEmail.toLowerCase().trim() });
            if (existing && existing._id.toString() !== adminId) {
                return res.status(400).json({ error: 'Email is already in use.' });
            }
            admin.email = newEmail.toLowerCase().trim();
        }

        if (newPassword) {
            if (newPassword.length < 6) {
                return res.status(400).json({ error: 'New password must be at least 6 characters.' });
            }
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(newPassword, salt);
        }

        await admin.save();

        // Issue new token with updated email
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            admin: { email: admin.email, role: admin.role },
            message: 'Credentials updated successfully.'
        });
    } catch (err) {
        console.error('Update credentials error:', err.message);
        res.status(500).json({ error: 'Server error while updating credentials.' });
    }
};

module.exports = { login, verifyToken, updateCredentials };
