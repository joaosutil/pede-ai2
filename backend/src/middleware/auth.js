// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');

exports.protect = async (req, res, next) => {
    let token;

    // 1. Verifica se o token veio no cabeçalho (Authorization: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Não autorizado. Faça login.' });
    }

    try {
        // 2. Decodifica o Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo_super_secreto');

        // 3. Busca o usuário no banco e anexa na requisição
        req.user = await Restaurant.findById(decoded.id);
        
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Usuário não encontrado.' });
        }

        next(); // Pode passar
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token inválido.' });
    }
};

// Middleware extra: Só deixa passar se for Admin
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Cargo '${req.user.role}' não tem permissão para esta ação.` 
            });
        }
        next();
    };
};