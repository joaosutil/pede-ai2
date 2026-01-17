const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rota para criar restaurante e parceiro
router.post('/setup-restaurant', adminController.setupNewRestaurant);

// Rota para resetar a plataforma (opcional)
router.post('/reset', adminController.resetPlatform);

module.exports = router;