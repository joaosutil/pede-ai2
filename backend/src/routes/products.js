const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// Rota unificada para Criar e Editar (POST /api/products)
router.post('/', upload.single('image'), productController.saveProduct);

router.get('/restaurant/:restaurantId', productController.getProductsByRestaurant);
router.delete('/:id', productController.deleteProduct);

module.exports = router;