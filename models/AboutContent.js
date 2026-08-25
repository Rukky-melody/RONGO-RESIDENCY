const mongoose = require('mongoose');

// Single-document store — only one AboutContent doc will ever exist.
const aboutContentSchema = new mongoose.Schema({
    leadText:       { type: String, required: true },
    bodyParagraphs: [{ type: String }],
    lastUpdatedBy:  { type: String, default: 'system' }
}, { timestamps: true });

module.exports = mongoose.model('AboutContent', aboutContentSchema);
