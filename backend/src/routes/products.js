const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rota correta para buscar produtos de um restaurante
// Exemplo de uso: GET /api/products/restaurant/65a1b2c3d4e5f6...
router.get('/restaurant/:restaurantId', productController.getProductsByRestaurant);

// Rota para criar produto
router.post('/', productController.createProduct);

module.exports = router;