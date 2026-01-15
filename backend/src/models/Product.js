// backend/src/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome do produto é obrigatório'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Preço é obrigatório']
    },
    image: {
        type: String,
        default: 'no-food.jpg'
    },
    category: { // Ex: "Lanches", "Bebidas", "Sobremesas"
        type: String,
        default: 'Geral'
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant', // Conecta com o outro Schema
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{ timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);