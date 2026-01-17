const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');

// Busca todos os restaurantes
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants || []);
  } catch (error) {
    res.status(500).json([]); 
  }
};

// Busca um restaurante por ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurante não encontrado" });
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar restaurante" });
  }
};

// --- NOVO: Atualizar Restaurante (Edição Total) ---
exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // LÓGICA CRUCIAL: Se o Multer recebeu um arquivo, o nome vai para o campo 'img'
    if (req.file) {
      updateData.img = req.file.filename;
    }

    // Conversão de tipos para evitar erros no banco
    if (updateData.fee) updateData.fee = Number(updateData.fee);

    const updated = await Restaurant.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updated) return res.status(404).json({ message: "Restaurante não encontrado." });
    
    res.status(200).json(updated);
  } catch (error) {
    console.error("Erro ao atualizar restaurante:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

// --- NOVO: Adicionar Avaliação ---
exports.addReview = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { user, rating, comment } = req.body;

    const review = new Review({
      restaurant: restaurantId,
      user,
      rating,
      comment
    });
    await review.save();

    // Recalcular média do restaurante
    const reviews = await Review.find({ restaurant: restaurantId });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    
    await Restaurant.findByIdAndUpdate(restaurantId, { rating: avg.toFixed(1) });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Erro ao avaliar." });
  }
};

// --- NOVO: Buscar Avaliações de uma loja ---
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId }).sort({ date: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json([]);
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar restaurante" });
  }
};


exports.replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId, 
      { 
        reply, 
        replyDate: new Date() 
      }, 
      { new: true }
    );

    if (!review) return res.status(404).json({ message: "Avaliação não encontrada." });

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Erro ao responder avaliação." });
  }
};