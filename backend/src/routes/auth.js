const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { loginRestaurant, getMe } = require('../controllers/authController');


router.post('/login', loginRestaurant);
router.get('/me', protect, getMe);

module.exports = router;