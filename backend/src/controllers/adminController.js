const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

// Criar novo Restaurante e seu respectivo Usuário de Acesso (Partner)
exports.setupNewRestaurant = async (req, res) => {
  try {
    const { ownerName, email, password, restaurantName, category } = req.body;

    // 1. Criar o Usuário Dono (Partner)
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'E-mail de acesso já está em uso.' });

    user = new User({
      name: ownerName,
      email,
      password,
      role: 'partner' // Cargo específico para donos de loja
    });
    await user.save();

    // 2. Criar o Restaurante vinculado a esse usuário
    const restaurant = new Restaurant({
      name: restaurantName,
      category,
      owner: user._id, // Vinculação real no banco
      img: '🍱', // Default emoji
      openingTime: '18:00',
      closingTime: '23:00',
      fee: 0
    });
    await restaurant.save();

    res.status(201).json({ message: 'Restaurante e acesso criados com sucesso!', restaurant, user });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao configurar restaurante.', error: err.message });
  }
};

// LIMPEZA TOTAL (Use com cuidado!)
exports.resetPlatform = async (req, res) => {
    try {
        await Restaurant.deleteMany({ name: { $ne: "Administrador PedeAi" } });
        // Opcional: deletar produtos também
        res.status(200).json({ message: 'Banco de dados limpo com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao limpar banco.' });
    }
};