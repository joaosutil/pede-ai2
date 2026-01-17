const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  img: { type: String, default: '🍱' },
  color: { type: String, default: '#E85D04' },
  rating: { type: Number, default: 5.0 },
  time: { type: String, default: '30-40 min' },
  fee: { type: Number, default: 0 },
  openingTime: { type: String, default: '11:00' },
  closingTime: { type: String, default: '23:00' },
  description: { type: String, default: 'Novo parceiro Pede Aí.' },
  type: { type: String, enum: ['clean', 'rustic'], default: 'clean' },
  // CAMPO CRUCIAL: Vincula o restaurante ao usuário que vai gerenciá-lo
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);