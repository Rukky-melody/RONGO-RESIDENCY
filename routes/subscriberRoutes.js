const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/subscriberController');

// 5. Registration Route
router.post('/register', registerUser);

module.exports = router;
