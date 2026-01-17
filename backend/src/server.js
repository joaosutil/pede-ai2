const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// 1. Conexão ao Banco
connectDB();

// 2. Configuração de CORS (Permite acesso do Frontend)
app.use(cors()); 
app.use(express.json());

// 3. Arquivos Estáticos (Imagens)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static('uploads'));
// 4. Definição das Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
// Se tiver rota de pagamento:
// app.use('/api/payment', require('./routes/payment'));

// 5. Inicialização
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
});