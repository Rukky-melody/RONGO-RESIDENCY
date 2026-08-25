const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title:           { type: String, required: true, trim: true },
    message:         { type: String, required: true },
    ctaLabel:        { type: String, default: '' },
    ctaUrl:          { type: String, default: '' },
    isActive:        { type: Boolean, default: true },
    backgroundColor: { type: String, default: '#3B5254' }  // Rongo teal default
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
