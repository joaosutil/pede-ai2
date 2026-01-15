const express = require('express');
const router = express.Router();

// 1. IMPORTAR AS FUNÇÕES (Verifique se deleteAllOrders está aqui!)
const { 
    createOrder, 
    getOrders, 
    getOrdersByRestaurant,
    getOrderById, 
    getOrdersByCustomerPhone, 
    updateOrderStatus,
    confirmOrderPayment,
    deleteOrder,
    deleteAllOrders // <--- OBRIGATÓRIO ESTAR AQUI
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

// --- ROTA 1: RAIZ ('/') ---
router.route('/')
    .post(createOrder)                                      // Criar
    .get(protect, authorize('admin', 'restaurant'), getOrders) // Listar
    .delete(protect, authorize('admin'), deleteAllOrders);     // <--- DELETAR TUDO (SÓ ADMIN)

// --- ROTA 2: ESPECÍFICAS (Antes do /:id) ---
router.get('/restaurant/:restaurantId', protect, authorize('admin', 'restaurant'), getOrdersByRestaurant);
router.get('/customer/:phone', getOrdersByCustomerPhone);
router.put('/:id/pay', confirmOrderPayment); // Confirmação Pix

// --- ROTA 3: POR ID ('/:id') ---
router.route('/:id')
    .get(getOrderById)
    .patch(protect, authorize('admin', 'restaurant'), updateOrderStatus)
    .delete(protect, authorize('admin'), deleteOrder); // Deletar UM pedido

module.exports = router;