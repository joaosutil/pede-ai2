// backend/src/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    // AGORA CUSTOMER É UM OBJETO, NÃO UMA STRING
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        cpf: { type: String },   // Opcional
        email: { type: String }  // Opcional
    },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            observation: { type: String }   
        }
    ],
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true, 
    },
    paymentStatus: { type: String, default: 'Pendente' }, // 'Pago', 'Reembolsado'
    paymentId: { type: String }, // O ID do Mercado Pago (ex: 1234567890)
    status: {
        type: String,
        enum: ['Novo', 'Em Preparo', 'Enviado', 'Entregue', 'Cancelado'],
        default: 'Novo'
    },
    timeline: [
        {
            status: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);