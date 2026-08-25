const express = require('express');
const router  = express.Router();
const { login, verifyToken } = require('../controllers/adminAuthController');
const { protect } = require('../middleware/authMiddleware');

router.post('/api/admin/login',  login);
router.get('/api/admin/verify',  protect, verifyToken);

module.exports = router;
