const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['superadmin', 'editor'], default: 'editor' },
    createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);
