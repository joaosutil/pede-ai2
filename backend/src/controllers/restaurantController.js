const Restaurant = require('../models/Restaurant');

// Busca todos os restaurantes
exports.getAllRestaurants = async (req, res) => {
  try {
    // Busca no banco
    const restaurants = await Restaurant.find();
    
    // Se não encontrar nada ou for null, retorna array vazio []
    // Isso evita o erro "map is not a function" no frontend
    if (!restaurants) {
      return res.status(200).json([]);
    }

    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Erro ao buscar restaurantes:", error);
    // Em caso de erro, também retorna array vazio para não quebrar a UI
    res.status(500).json([]); 
  }
};

// Busca um restaurante por ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurante não encontrado" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar restaurante" });
  }
};

// Cria um restaurante (Útil para você popular o banco via Postman/Insomnia)
exports.createRestaurant = async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar restaurante", error: error.message });
  }
};