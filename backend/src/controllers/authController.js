const User = require('../models/User'); // Agora o arquivo existe!
const jwt = require('jsonwebtoken');

// Função de Registro
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verifica se já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
    }

    // Cria o novo usuário
    // DICA: Em um sistema real, aqui usaríamos bcrypt para criptografar a senha
    user = new User({ name, email, password });
    
    // Se o e-mail for o seu e-mail de admin, você pode forçar o cargo aqui ou mudar no banco depois
    if (email === 'admin@pedeai.com') {
        user.role = 'admin';
    }

    await user.save();

    // Gera o Token de acesso
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao registrar usuário no banco de dados.' });
  }
};

// Função de Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};