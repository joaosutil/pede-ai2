const Product = require('../models/Product');

// Criar ou Atualizar Produto
exports.saveProduct = async (req, res) => {
  try {
    const { id, name, price, description, restaurant } = req.body;
    
    const productData = {
      name,
      price: Number(price),
      description,
      restaurant
    };

    // Se houver upload de nova imagem
    if (req.file) {
      productData.img = req.file.filename;
    }

    if (id && id !== "undefined") {
      // ATUALIZAR
      const updated = await Product.findByIdAndUpdate(id, productData, { new: true });
      return res.status(200).json(updated);
    } else {
      // CRIAR NOVO
      const product = new Product(productData);
      await product.save();
      return res.status(201).json(product);
    }
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
    res.status(500).json({ message: "Erro interno ao processar produto." });
  }
};

exports.getProductsByRestaurant = async (req, res) => {
  try {
    const products = await Product.find({ restaurant: req.params.restaurantId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar cardápio." });
  }
};

exports.deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Produto removido." });
    } catch (e) { res.status(500).json({ error: e.message }); }
};