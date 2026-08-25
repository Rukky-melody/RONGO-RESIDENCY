const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name:         { type: String, required: true, trim: true },
    role:         { type: String, required: true, trim: true },
    profileImage: { type: String, default: '' },   // Cloudinary secure URL
    order:        { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
