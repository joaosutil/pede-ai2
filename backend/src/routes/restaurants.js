// backend/src/routes/restaurants.js
const express = require('express');
const router = express.Router();

// IMPORTANTE: O getRestaurantBySlug DEVE estar na lista de importação
const { 
    createRestaurant, 
    getRestaurants, 
    getRestaurantById, 
    getRestaurantBySlug, // <--- VERIFIQUE ISSO
    updateRestaurant, 
    deleteRestaurant 
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');

// Rotas Públicas
router.get('/', getRestaurants);

// --- ESTA ROTA TEM QUE VIR ANTES DO /:id ---
router.get('/slug/:slug', getRestaurantBySlug); 
// -------------------------------------------
router.delete('/:id', protect, authorize('admin'), deleteRestaurant);
router.get('/:id', getRestaurantById);

// Rotas Protegidas
router.post('/', protect, authorize('admin', 'restaurant'), createRestaurant);
router.put('/:id', protect, authorize('admin', 'restaurant'), updateRestaurant);
router.delete('/:id', protect, authorize('admin'), deleteRestaurant);

module.exports = router;