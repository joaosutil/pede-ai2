const Product = require('../models/Product');

// Busca produtos por ID do restaurante
exports.getProductsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    // Busca produtos onde o campo 'restaurant' é igual ao ID passado
    const products = await Product.find({ restaurant: restaurantId });
    
    // Garante retorno de array
    res.status(200).json(products || []);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    // Retorna array vazio em caso de erro de cast (ID inválido) ou conexão
    res.status(200).json([]); 
  }
};

// Cria um produto
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar produto", error: error.message });
  }
};