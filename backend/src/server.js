// backend/src/server.js
require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Importar Rotas
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');

dotenv.config();
connectDB();
const app = express();
// Conectar ao Banco de Dados



// Middlewares
app.use(express.json());
app.use(cors({
    origin: '*', // Em teste pode deixar *, mas o ideal é o link da Vercel
    methods: ['GET', 'POST']
}));// Permite que o Frontend converse com o Backend


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Montar Rotas
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// Rota de Teste (Health Check)
app.get('/', (req, res) => {
    res.json({ 
        message: "PedeAi API - Online e Operante",
        version: "1.0.0",
        motto: "Menos intermediação, mais clareza."
    });
});

// Conexão com Banco de Dados (Placeholder por enquanto)
// mongoose.connect(process.env.MONGO_URI)...

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});