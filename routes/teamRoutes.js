const express = require('express');
const router  = express.Router();
const {
    getTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const { upload }  = require('../services/cloudinaryService');

// Public
router.get('/api/team',               getTeamMembers);

// Protected — single image upload via 'profileImage' field name
router.post('/api/admin/team',        protect, upload.single('profileImage'), createTeamMember);
router.put('/api/admin/team/:id',     protect, upload.single('profileImage'), updateTeamMember);
router.delete('/api/admin/team/:id',  protect, deleteTeamMember);

module.exports = router;
