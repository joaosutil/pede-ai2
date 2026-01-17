const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Define as rotas usando as funções exportadas corretamente
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/', restaurantController.createRestaurant);

module.exports = router;