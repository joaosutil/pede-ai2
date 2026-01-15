// backend/src/routes/products.js
const express = require('express');
const router = express.Router();
const { createProduct, getProductsByRestaurant, getProducts } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const upload = require('../middleware/upload');

// Rota para criar produto (POST /api/products)
router.post('/', protect, upload.single('imageFile'), createProduct);
router.get('/', getProducts);
// Rota para pegar cardápio de um restaurante (GET /api/products/restaurant/:restaurantId)
router.get('/restaurant/:restaurantId', getProductsByRestaurant);

module.exports = router;