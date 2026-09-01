const GalleryItem = require('../models/GalleryItem');
const { uploadToCloudinary } = require('../services/cloudinaryService');

/**
 * GET /api/gallery
 * Public — all gallery items sorted by order then creation date.
 */
const getGalleryItems = async (req, res) => {
    try {
        const items = await GalleryItem.find().sort({ order: 1, createdAt: 1 });
        res.json(items);
    } catch (err) {
        console.error('getGalleryItems error:', err.message);
        res.status(500).json({ error: 'Failed to fetch gallery items.' });
    }
};

/**
 * POST /api/admin/gallery
 * Protected — create a new gallery item, with Cloudinary image upload.
 */
const createGalleryItem = async (req, res) => {
    try {
        const { title, linkUrl, order } = req.body;

        if (!title || !linkUrl) {
            return res.status(400).json({ error: 'Title and Link URL are required.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required for gallery items.' });
        }

        const imageUrl = await uploadToCloudinary(req.file.buffer);

        const item = await GalleryItem.create({
            title: title.trim(),
            linkUrl: linkUrl.trim(),
            imageUrl,
            order: order ? parseInt(order, 10) : 0
        });

        res.status(201).json({ success: true, item });
    } catch (err) {
        console.error('createGalleryItem error:', err.message);
        res.status(500).json({ error: 'Failed to create gallery item.' });
    }
};

/**
 * PUT /api/admin/gallery/:id
 * Protected — update gallery item details; new image upload is optional.
 */
const updateGalleryItem = async (req, res) => {
    try {
        const { title, linkUrl, order } = req.body;
        const updates = {
            title: title ? title.trim() : undefined,
            linkUrl: linkUrl ? linkUrl.trim() : undefined,
            order: order !== undefined ? parseInt(order, 10) : undefined
        };

        // Remove undefined keys so we don't accidentally null them
        Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k]);

        if (req.file) {
            updates.imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const item = await GalleryItem.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!item) {
            return res.status(404).json({ error: 'Gallery item not found.' });
        }

        res.json({ success: true, item });
    } catch (err) {
        console.error('updateGalleryItem error:', err.message);
        res.status(500).json({ error: 'Failed to update gallery item.' });
    }
};

/**
 * DELETE /api/admin/gallery/:id
 * Protected — permanently removes a gallery item.
 */
const deleteGalleryItem = async (req, res) => {
    try {
        const item = await GalleryItem.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Gallery item not found.' });
        }
        res.json({ success: true, message: 'Gallery item deleted.' });
    } catch (err) {
        console.error('deleteGalleryItem error:', err.message);
        res.status(500).json({ error: 'Failed to delete gallery item.' });
    }
};

module.exports = { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem };
