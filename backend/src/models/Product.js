const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  img: { type: String }, // Nome do ficheiro salvo na pasta uploads
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);