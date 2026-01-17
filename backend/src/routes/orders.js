const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/restaurant/:restaurantId', orderController.getRestaurantOrders);
router.get('/user/:userId', orderController.getUserOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;