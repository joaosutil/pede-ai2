const express = require('express');
const router = express.Router();
const { createPixPayment, checkPaymentStatus, createCardPayment } = require('../controllers/paymentController');

// Rota para CRIAR o Pix
router.post('/pix', createPixPayment);
router.post('/card', createCardPayment);
// Rota para VERIFICAR status
router.get('/status/:id', checkPaymentStatus);

module.exports = router;