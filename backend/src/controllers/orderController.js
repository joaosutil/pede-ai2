const Order = require('../models/Order');

// Criar novo pedido
exports.createOrder = async (req, res) => {
  try {
    const { restaurant, user, items, total, paymentMethod, address } = req.body;
    
    const newOrder = new Order({
      restaurant,
      user,
      items,
      total,
      paymentMethod,
      address
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Erro ao processar pedido.", error: error.message });
  }
};

// Buscar pedidos de um restaurante (para o Lojista)
exports.getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedidos." });
  }
};

// Buscar pedidos de um usuário (Histórico do Cliente)
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('restaurant', 'name img')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar seu histórico." });
  }
};

// Atualizar status do pedido
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar status." });
  }
};