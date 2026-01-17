const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

exports.setupNewRestaurant = async (req, res) => {
  try {
    console.log("Recebendo dados:", req.body); // Log para ajudar no debug

    const { ownerName, email, password, restaurantName, category } = req.body;

    // 1. Validação
    if (!ownerName || !email || !password || !restaurantName) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // 2. Verificar se usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "E-mail já está em uso." });
    }

    // 3. Criar Usuário Parceiro
    const newUser = new User({
      name: ownerName,
      email,
      password, // Nota: Em produção, use bcrypt para hash da senha
      role: 'partner'
    });
    
    const savedUser = await newUser.save();
    console.log("Usuário criado:", savedUser._id);

    // 4. Criar Restaurante Vinculado
    const newRestaurant = new Restaurant({
      name: restaurantName,
      category: category || 'Geral',
      owner: savedUser._id, // Vínculo com o ID do usuário criado
      img: '🏪'
    });

    await newRestaurant.save();
    console.log("Restaurante criado com sucesso.");

    res.status(201).json({ message: "Sucesso!", restaurant: newRestaurant });

  } catch (error) {
    console.error("Erro no Setup:", error); // Veja este erro no terminal do backend
    res.status(500).json({ message: "Erro interno no servidor.", error: error.message });
  }
};

exports.resetPlatform = async (req, res) => {
    try {
        await Restaurant.deleteMany({});
        await User.deleteMany({ role: { $ne: 'admin' } });
        res.json({ message: "Plataforma resetada." });
    } catch (e) { res.status(500).json({ error: e.message }); }
};