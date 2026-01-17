const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const upload = require('../middleware/upload');

// Rota de Atualização: O campo no FormData deve ser 'image'
router.put('/:id', upload.single('image'), restaurantController.updateRestaurant);

// Outras rotas...
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/:restaurantId/reviews', restaurantController.addReview);
router.get('/:restaurantId/reviews', restaurantController.getReviews);
router.post('/:restaurantId/reviews/:reviewId/reply', restaurantController.replyToReview);

module.exports = router;