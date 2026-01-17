const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  user: { type: String, required: true }, 
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  // CAMPOS PARA RESPOSTA DO RESTAURANTE
  reply: { type: String },
  replyDate: { type: Date },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);