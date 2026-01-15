// backend/src/controllers/authController.js
const Restaurant = require('../models/Restaurant');
const jwt = require('jsonwebtoken');

// Criar o Token (O Crachá)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'segredo_super_secreto', {
        expiresIn: '30d' // Token vale por 30 dias
    });
};

// @desc    Autenticar restaurante e receber token
// @route   POST /api/auth/login
exports.loginRestaurant = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validação básica
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Informe email e senha' });
        }

        // 2. Busca o restaurante pelo email (e pede pra trazer a senha que estava escondida)
        const restaurant = await Restaurant.findOne({ email }).select('+password');

        if (!restaurant) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }

        // 3. Verifica se a senha bate
        const isMatch = await restaurant.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }

        // 4. Tudo certo? Manda o Token!
        res.status(200).json({
            success: true,
            token: generateToken(restaurant._id),
            restaurant: {
                _id: restaurant._id,
                name: restaurant.name,
                email: restaurant.email,
                slug: restaurant.slug
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }

    
};

exports.getMe = async (req, res) => {
    try {
        // req.user já vem preenchido pelo middleware 'protect'
        const user = await Restaurant.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};