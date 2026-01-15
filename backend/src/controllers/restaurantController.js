const Restaurant = require('../models/Restaurant');
const Product = require('../models/Product');
// @desc    Criar novo restaurante
// @route   POST /api/restaurants
exports.createRestaurant = async (req, res) => {
    try {
        const { 
            name, slug, email, password, category, 
            deliveryTime, deliveryFee, rating, image,
            opensAt, closesAt, 
            phone, whatsappTemplate,
            deliveryZones // <--- Importante para o frete variável
        } = req.body;

        // Lógica de Imagem (Upload ou URL)
        let finalImage = image;
        if (req.file) {
            finalImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const restaurant = await Restaurant.create({
            name, slug, email, password, category, 
            deliveryTime, deliveryFee, rating,
            image: finalImage,
            role: 'restaurant',
            opensAt, closesAt,
            phone,
            whatsappTemplate,
            deliveryZones
        });

        res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
        // Se der erro de duplicidade (email ou slug já existem)
        if(error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Email ou Slug já cadastrados.' });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Listar todos restaurantes
// @route   GET /api/restaurants
exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ role: 'restaurant' }).select('-password');
        res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Buscar restaurante por ID
// @route   GET /api/restaurants/:id
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).select('-password');

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurante não encontrado' });
        }

        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Buscar restaurante pelo SLUG (Nome na URL)
// @route   GET /api/restaurants/slug/:slug
exports.getRestaurantBySlug = async (req, res) => {
    try {
        // 1. Busca a Loja (usa .lean() para podermos modificar o objeto JSON depois)
        const restaurant = await Restaurant.findOne({ slug: req.params.slug }).lean();

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Loja não encontrada' });
        }

        // 2. Busca os Produtos dessa loja
        const products = await Product.find({ restaurant: restaurant._id });

        // 3. Junta tudo num pacote só
        restaurant.products = products; 

        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        console.error(error); // Ajuda a ver erros no terminal
        res.status(500).json({ success: false, error: error.message });
    }
};
// @desc    Atualizar restaurante
// @route   PUT /api/restaurants/:id
exports.updateRestaurant = async (req, res) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Não encontrado' });
        }
        
        // Verifica permissão (apenas Admin ou o próprio dono)
        if (req.user.role !== 'admin' && restaurant._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Sem permissão para editar esta loja' });
        }

        // Prepara dados para atualização
        const fieldsToUpdate = { ...req.body };

        // Lógica da Imagem
        if (req.file) {
            fieldsToUpdate.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        } else if (req.body.image) {
             fieldsToUpdate.image = req.body.image;
        } 
        
        // Se o usuário mandou remover a imagem
        if (!req.file && !req.body.image && req.body.imgType === 'file') {
             delete fieldsToUpdate.image;
        }

        restaurant = await Restaurant.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Deletar restaurante
// @route   DELETE /api/restaurants/:id
exports.deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Não encontrado' });
        }

        // Apenas Admin pode deletar
        if (req.user.role !== 'admin') {
             return res.status(403).json({ success: false, message: 'Apenas admins podem deletar lojas' });
        }

        await restaurant.deleteOne();

        res.status(200).json({ success: true, message: 'Restaurante removido' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

