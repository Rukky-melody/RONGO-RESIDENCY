const Announcement = require('../models/Announcement');

/**
 * GET /api/announcement
 * Public — returns the single active announcement, or null.
 */
const getActiveAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.json(announcement || null);
    } catch (err) {
        console.error('getActiveAnnouncement error:', err.message);
        res.status(500).json({ error: 'Failed to fetch announcement.' });
    }
};

/**
 * GET /api/admin/announcements
 * Protected — returns all announcements for admin management.
 */
const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        console.error('getAllAnnouncements error:', err.message);
        res.status(500).json({ error: 'Failed to fetch announcements.' });
    }
};

/**
 * POST /api/admin/announcements
 * Protected — creates a new announcement.
 * If isActive is true, all other announcements are deactivated first.
 */
const createAnnouncement = async (req, res) => {
    try {
        const { title, message, ctaLabel, ctaUrl, isActive, backgroundColor } = req.body;

        if (!title || !message) {
            return res.status(400).json({ error: 'Title and message are required.' });
        }

        const active = isActive === true || isActive === 'true';

        if (active) {
            await Announcement.updateMany({}, { isActive: false });
        }

        const announcement = await Announcement.create({
            title:           title.trim(),
            message:         message.trim(),
            ctaLabel:        ctaLabel || '',
            ctaUrl:          ctaUrl || '',
            isActive:        active,
            backgroundColor: backgroundColor || '#3B5254'
        });

        res.status(201).json({ success: true, announcement });
    } catch (err) {
        console.error('createAnnouncement error:', err.message);
        res.status(500).json({ error: 'Failed to create announcement.' });
    }
};

/**
 * PUT /api/admin/announcements/:id
 * Protected — updates an announcement.
 * If activating, all others are deactivated.
 */
const updateAnnouncement = async (req, res) => {
    try {
        const { title, message, ctaLabel, ctaUrl, isActive, backgroundColor } = req.body;
        const active = isActive === true || isActive === 'true';

        if (active) {
            await Announcement.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
        }

        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            {
                title:           title ? title.trim() : undefined,
                message:         message ? message.trim() : undefined,
                ctaLabel:        ctaLabel !== undefined ? ctaLabel : undefined,
                ctaUrl:          ctaUrl !== undefined ? ctaUrl : undefined,
                isActive:        active,
                backgroundColor: backgroundColor || '#3B5254'
            },
            { new: true }
        );

        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found.' });
        }

        res.json({ success: true, announcement });
    } catch (err) {
        console.error('updateAnnouncement error:', err.message);
        res.status(500).json({ error: 'Failed to update announcement.' });
    }
};

/**
 * DELETE /api/admin/announcements/:id
 * Protected — permanently removes an announcement.
 */
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found.' });
        }
        res.json({ success: true, message: 'Announcement deleted.' });
    } catch (err) {
        console.error('deleteAnnouncement error:', err.message);
        res.status(500).json({ error: 'Failed to delete announcement.' });
    }
};

module.exports = {
    getActiveAnnouncement,
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};
