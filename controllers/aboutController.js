const AboutContent = require('../models/AboutContent');

/**
 * GET /api/about
 * Public — returns the single About content document.
 */
const getAboutContent = async (req, res) => {
    try {
        const content = await AboutContent.findOne();
        if (!content) {
            return res.json({
                leadText: 'Rongo Art Foundation is a youth-led cultural organisation.',
                bodyParagraphs: []
            });
        }
        res.json(content);
    } catch (err) {
        console.error('getAboutContent error:', err.message);
        res.status(500).json({ error: 'Failed to fetch about content.' });
    }
};

/**
 * PUT /api/admin/about
 * Protected — upserts the single About content document.
 */
const updateAboutContent = async (req, res) => {
    try {
        const { leadText, bodyParagraphs } = req.body;

        if (!leadText || leadText.trim() === '') {
            return res.status(400).json({ error: 'Lead text is required.' });
        }

        // Parse bodyParagraphs — it may arrive as JSON string from multipart or already as array
        let paragraphs = bodyParagraphs;
        if (typeof bodyParagraphs === 'string') {
            try { paragraphs = JSON.parse(bodyParagraphs); } catch { paragraphs = [bodyParagraphs]; }
        }
        // Filter out empty strings
        paragraphs = (paragraphs || []).filter(p => p && p.trim() !== '');

        const content = await AboutContent.findOneAndUpdate(
            {},
            { leadText: leadText.trim(), bodyParagraphs: paragraphs, lastUpdatedBy: req.admin.email },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({ success: true, content });
    } catch (err) {
        console.error('updateAboutContent error:', err.message);
        res.status(500).json({ error: 'Failed to update about content.' });
    }
};

module.exports = { getAboutContent, updateAboutContent };
