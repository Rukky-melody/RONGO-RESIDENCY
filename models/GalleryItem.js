const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true }, // Cloudinary URL
    linkUrl: { type: String, required: true }, // Pixieset or external link
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
