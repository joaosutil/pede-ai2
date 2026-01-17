const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  img: { type: String, default: '🍱' }, // Nome do arquivo ou emoji
  color: { type: String, default: '#E85D04' },
  rating: { type: Number, default: 5.0 },
  time: { type: String, default: '30-40 min' },
  fee: { type: Number, default: 0 },
  openingTime: { type: String, default: '11:00' },
  closingTime: { type: String, default: '23:00' },
  description: { type: String, default: 'Bem-vindo ao nosso restaurante!' },
  type: { type: String, enum: ['clean', 'rustic'], default: 'clean' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);