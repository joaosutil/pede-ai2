// backend/src/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Product = require('./models/Product'); // Importante limpar produtos também

const restaurants = [
    {
        name: "Craft Burger",
        slug: "craft-burger",
        email: "admin@craftburger.com",
        password: "123456", // Agora será criptografada corretamente
        category: "Hamburgueria",
        rating: 4.8,
        deliveryTime: "30-40 min",
        deliveryFee: 0,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80"
    },
    {
        name: "La Mamma Pizzas",
        slug: "la-mamma",
        email: "admin@lamamma.com",
        password: "123456",
        category: "Pizzaria",
        rating: 4.5,
        deliveryTime: "40-50 min",
        deliveryFee: 5.00,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80"
    },
    {
        name: "Administrador PedeAi",
        slug: "admin-master",
        email: "masteradmin@pedeai.com",
        password: "admin123", // Senha forte em produção!
        role: "admin", // <--- O SEGREDO ESTÁ AQUI
        category: "Outros",
        deliveryTime: "-",
        deliveryFee: 0
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔌 Conectado ao MongoDB...");

        // 1. Limpa TUDO para começar do zero
        await Restaurant.deleteMany();
        await Product.deleteMany(); 
        console.log("🧹 Banco limpo (Restaurantes e Produtos antigos removidos).");

        // 2. Cria UM POR UM para ativar a criptografia (Middleware pre-save)
        for (const restaurantData of restaurants) {
            await Restaurant.create(restaurantData);
            console.log(`✅ Restaurante criado: ${restaurantData.name}`);
        }

        console.log("🚀 Seed finalizado com sucesso! Senhas criptografadas.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();