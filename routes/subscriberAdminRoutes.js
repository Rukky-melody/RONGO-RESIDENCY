const express = require('express');
const router  = express.Router();
const { getSubscribers, exportSubscribersCSV } = require('../controllers/subscriberAdminController');
const { protect } = require('../middleware/authMiddleware');

// Note: export route must come BEFORE :id param routes to avoid conflicts
router.get('/api/admin/subscribers/export',  protect, exportSubscribersCSV);
router.get('/api/admin/subscribers',         protect, getSubscribers);

module.exports = router;
