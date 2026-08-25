const express = require('express');
const router  = express.Router();
const {
    getActiveAnnouncement,
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.get('/api/announcement',                 getActiveAnnouncement);

// Protected
router.get('/api/admin/announcements',          protect, getAllAnnouncements);
router.post('/api/admin/announcements',         protect, createAnnouncement);
router.put('/api/admin/announcements/:id',      protect, updateAnnouncement);
router.delete('/api/admin/announcements/:id',   protect, deleteAnnouncement);

module.exports = router;
