const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    notes: { type: String }
  }],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pendente', 'Preparando', 'Em Entrega', 'Entregue', 'Cancelado'], 
    default: 'Pendente' 
  },
  paymentMethod: { type: String, required: true },
  address: {
    label: String,
    text: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);