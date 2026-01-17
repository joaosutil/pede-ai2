const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rota para o Admin Geral criar um novo parceiro e restaurante simultaneamente
// POST /api/admin/setup-restaurant
router.post('/setup-restaurant', adminController.setupNewRestaurant);

module.exports = router;