// backend/src/seed_products.js
require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Product = require('./models/Product');

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔌 Conectado para popular produtos...");

        // 1. Acha o restaurante que criamos (pelo slug ou nome)
        // Mude o slug abaixo para o slug de um restaurante que VOCÊ criou
        const restaurant = await Restaurant.findOne({ slug: 'master-burguer' }); 
        
        if (!restaurant) {
            console.log("❌ Restaurante não encontrado. Crie um restaurante com slug 'master-burguer' ou ajuste este script.");
            process.exit(1);
        }

        console.log(`🍔 Adicionando produtos para: ${restaurant.name} (ID: ${restaurant._id})`);

        // 2. Cria os produtos vinculados a esse ID
        const products = [
            {
                name: "X-Bacon Artesanal",
                description: "Pão brioche, burger 180g, muito bacon crocante e queijo prato.",
                price: 34.90,
                category: "Lanches",
                restaurant: restaurant._id, // O Vínculo Mágico
                image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500"
            },
            {
                name: "Coca-Cola Lata",
                description: "350ml geladíssima.",
                price: 6.00,
                category: "Bebidas",
                restaurant: restaurant._id,
                image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"
            },
            {
                name: "Batata Frita Rustica",
                description: "Porção individual com alho e alecrim.",
                price: 18.00,
                category: "Acompanhamentos",
                restaurant: restaurant._id,
                image: "https://images.unsplash.com/photo-1630384060421-a4323ce5663d?w=500"
            }
        ];

        // Limpa produtos antigos deste restaurante para não duplicar
        await Product.deleteMany({ restaurant: restaurant._id });
        
        // Insere
        await Product.insertMany(products);
        console.log("✅ Cardápio servido com sucesso!");
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedProducts();