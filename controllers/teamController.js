const TeamMember = require('../models/TeamMember');
const { uploadToCloudinary } = require('../services/cloudinaryService');

/**
 * GET /api/team
 * Public — all team members sorted by order then creation date.
 */
const getTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.find().sort({ order: 1, createdAt: 1 });
        res.json(members);
    } catch (err) {
        console.error('getTeamMembers error:', err.message);
        res.status(500).json({ error: 'Failed to fetch team members.' });
    }
};

/**
 * POST /api/admin/team
 * Protected — create a new team member, with optional Cloudinary image upload.
 */
const createTeamMember = async (req, res) => {
    try {
        const { name, role, order } = req.body;

        if (!name || !role) {
            return res.status(400).json({ error: 'Name and role are required.' });
        }

        let profileImage = '';
        if (req.file) {
            profileImage = await uploadToCloudinary(req.file.buffer);
        }

        const member = await TeamMember.create({
            name:  name.trim(),
            role:  role.trim(),
            profileImage,
            order: order ? parseInt(order, 10) : 0
        });

        res.status(201).json({ success: true, member });
    } catch (err) {
        console.error('createTeamMember error:', err.message);
        res.status(500).json({ error: 'Failed to create team member.' });
    }
};

/**
 * PUT /api/admin/team/:id
 * Protected — update team member details; new image upload is optional.
 */
const updateTeamMember = async (req, res) => {
    try {
        const { name, role, order } = req.body;
        const updates = {
            name:  name ? name.trim() : undefined,
            role:  role ? role.trim() : undefined,
            order: order !== undefined ? parseInt(order, 10) : undefined
        };

        // Remove undefined keys so we don't accidentally null them
        Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k]);

        if (req.file) {
            updates.profileImage = await uploadToCloudinary(req.file.buffer);
        }

        const member = await TeamMember.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!member) {
            return res.status(404).json({ error: 'Team member not found.' });
        }

        res.json({ success: true, member });
    } catch (err) {
        console.error('updateTeamMember error:', err.message);
        res.status(500).json({ error: 'Failed to update team member.' });
    }
};

/**
 * DELETE /api/admin/team/:id
 * Protected — permanently removes a team member.
 */
const deleteTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ error: 'Team member not found.' });
        }
        res.json({ success: true, message: 'Team member deleted.' });
    } catch (err) {
        console.error('deleteTeamMember error:', err.message);
        res.status(500).json({ error: 'Failed to delete team member.' });
    }
};

module.exports = { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember };
