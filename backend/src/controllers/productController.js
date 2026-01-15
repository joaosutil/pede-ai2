// backend/src/controllers/productController.js
const Product = require('../models/Product');
const Restaurant = require('../models/Restaurant');


exports.getProducts = async (req, res) => {
    try {
        let query = {};

        // Se veio ?restaurant=ID na URL, filtra por ele
        if (req.query.restaurant) {
            query.restaurant = req.query.restaurant;
        }

        const products = await Product.find(query).populate('restaurant', 'name');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// 1. Criar um novo produto
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, category, restaurant, image } = req.body;
        
        let finalImage = image; // Começa com o link de texto (se houver)

        // Se veio um arquivo pelo Multer, ele ganha prioridade
        if (req.file) {
            // Monta a URL completa do servidor
            // req.protocol = http, req.get('host') = localhost:3000
            finalImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const product = await Product.create({
            name,
            price,
            description,
            category,
            restaurant,
            image: finalImage // Salva a URL (seja do upload ou do link externo)
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Buscar produtos de um restaurante específico
exports.getProductsByRestaurant = async (req, res) => {
    try {
        // Busca produtos onde o campo 'restaurant' bate com o ID da URL
        const products = await Product.find({ restaurant: req.params.restaurantId });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

