const express = require('express');
const router  = express.Router();
const { getAboutContent, updateAboutContent } = require('../controllers/aboutController');
const { protect } = require('../middleware/authMiddleware');

router.get('/api/about',        getAboutContent);
router.put('/api/admin/about',  protect, updateAboutContent);

module.exports = router;
