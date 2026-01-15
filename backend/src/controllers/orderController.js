// backend/src/controllers/orderController.js
const mongoose = require('mongoose');
const Order = require('../models/Order');
const paymentController = require('./paymentController');

exports.createOrder = async (req, res) => {
    try {
        // Recebe os dados novos do Frontend
        const { restaurant, customer, items, total, paymentMethod } = req.body;

        // Validação básica
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'O pedido não tem itens.' });
        }

        const order = await Order.create({
            restaurant,
            customer,       // O Mongoose vai validar o objeto { name, phone, address... } automaticamente
            items,
            total,
            paymentMethod,  // Salvando a forma de pagamento
            status: 'Novo',
            timeline: [{ status: 'Novo' }]
        });

        // (Opcional) Se você tiver Socket.io, aqui é onde você avisa o restaurante em tempo real
        // io.to(restaurant).emit('new-order', order);

        res.status(201).json({ success: true, data: order });

    } catch (error) {
        console.error("Erro ao criar pedido:", error); // Ajuda a ver o erro no terminal
        res.status(400).json({ success: false, error: error.message });
    }
};

// Futuro: Listar pedidos de um restaurante (Para o painel do dono)
exports.getOrdersByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        
        // LÓGICA DO FILTRO:
        // Queremos mostrar o pedido SE:
        // 1. O método for Dinheiro ou Maquininha (Offline) -> Mostra Sempre
        // OU
        // 2. O método for Pix ou Cartão Online E o status for 'Pago' -> Mostra
        
        const query = {
            restaurant: restaurantId,
            $or: [
                { paymentMethod: { $in: ['Dinheiro', 'Cartão Entrega'] } },
                { 
                    paymentMethod: { $in: ['Pix', 'Cartão de Crédito'] }, 
                    paymentStatus: 'Pago' // <--- O segredo para esconder os pendentes
                }
            ]
        };

        // ⚠️ CORREÇÃO: Usar .find() e não .findById()
        const orders = await Order.find(query)
                                  .populate('customer', 'name phone address')
                                  .populate('restaurant', 'name')
                                  .sort({ createdAt: -1 }); // Mais recentes primeiro

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('restaurant', 'name phone');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }
};


// Atualizar o status de um pedido
// backend/src/controllers/orderController.js

exports.updateOrderStatus = async (req, res) => {
    try {
        console.log(`--- TENTATIVA DE ATUALIZAÇÃO DO PEDIDO ${req.params.id} ---`);
        console.log(`Novo Status desejado: ${req.body.status}`);

        const order = await Order.findById(req.params.id);
        
        if (!order) {
            console.log("❌ Pedido não encontrado no banco.");
            return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
        }

        console.log(`Estado Atual do Pedido:`);
        console.log(`- Método: ${order.paymentMethod}`);
        console.log(`- Status Pagamento: ${order.paymentStatus}`);
        console.log(`- ID do Pix (paymentId): ${order.paymentId}`);

        const newStatus = req.body.status;

        // --- LÓGICA DE REEMBOLSO (COM DEBUG) ---
        // Verifica as condições uma por uma
        const ehCancelamento = newStatus === 'Cancelado';
        const ehPix = order.paymentMethod === 'Pix';
        const estaPago = order.paymentStatus === 'Pago';
        const temId = !!order.paymentId;

        console.log(`Verificação para Reembolso:`);
        console.log(`1. É Cancelamento? ${ehCancelamento ? 'SIM' : 'NÃO'}`);
        console.log(`2. É Pix? ${ehPix ? 'SIM' : 'NÃO'}`);
        console.log(`3. Está Pago? ${estaPago ? 'SIM' : 'NÃO'}`);
        console.log(`4. Tem ID do Pix? ${temId ? 'SIM' : 'NÃO'}`);

        if (ehCancelamento && ehPix && estaPago) {
            if (temId) {
                console.log(`✅ CONDICÕES ACEITAS! INICIANDO REEMBOLSO NO MERCADO PAGO...`);
                
                // CHAMA O CONTROLLER DE PAGAMENTO
                const refundRes = await paymentController.refundPayment(order.paymentId);
                
                console.log("Resposta do Reembolso:", refundRes);

                if (refundRes.success) {
                    console.log("💰 REEMBOLSO EFETUADO COM SUCESSO!");
                    order.paymentStatus = 'Reembolsado';
                    order.timeline.push({ status: 'Reembolso Efetuado', timestamp: new Date() });
                } else {
                    console.error('❌ FALHA NO REEMBOLSO:', refundRes.error);
                }
            } else {
                console.warn("⚠️ AVISO: Pedido é Pix e Pago, mas NÃO TEM O ID DO PAGAMENTO SALVO. Impossível reembolsar.");
                console.log("Dica: Isso acontece em pedidos antigos criados antes da correção.");
            }
        } else {
            console.log("ℹ️ Pulando reembolso (uma das condições falhou).");
        }
        // ---------------------------

        order.status = newStatus;
        
        // Evita duplicar timeline
        const ultimoStatus = order.timeline.length > 0 ? order.timeline[order.timeline.length - 1].status : '';
        if (ultimoStatus !== newStatus) {
            order.timeline.push({ status: newStatus, timestamp: new Date() });
        }

        await order.save();
        await order.populate('restaurant', 'name'); 

        res.status(200).json({ success: true, data: order });
        console.log("--- FIM DA ATUALIZAÇÃO ---\n");

    } catch (error) {
        console.error("❌ ERRO GERAL NO CONTROLLER:", error);
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.getOrders = async (req, res) => {
    try {
        let query = {};
        if (req.user && req.user.role === 'restaurant') {
            query = { restaurant: req.user._id };
        }
        const orders = await Order.find(query).populate('restaurant', 'name');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getOrderStats = async (req, res) => {
    try {
        // LÓGICA DE PERMISSÃO E FILTRO 🛡️
        let matchStage = { status: 'Entregue' }; // Começa filtrando só os entregues

        if (req.user.role === 'restaurant') {
            // Se for restaurante, É OBRIGADO a ver só os seus dados
            matchStage.restaurant = new mongoose.Types.ObjectId(req.user._id);
        } 
        else if (req.user.role === 'admin') {
            // Se for Admin, verifica se ele pediu uma loja específica na URL (?restaurant=ID)
            if (req.query.restaurant) {
                matchStage.restaurant = new mongoose.Types.ObjectId(req.query.restaurant);
            }
            // Se o Admin NÃO mandar ID, o matchStage fica sem filtro de restaurante
            // Isso significa que ele vai somar o TOTAL GLOBAL da plataforma! 🚀
        }

        // ... O RESTO DO CÓDIGO PERMANECE IGUAL (Agregações) ...
        // (Copie as agregações stats, daily, payments, topProducts do código anterior)

        // 1. ESTATÍSTICAS GERAIS
        const stats = await Order.aggregate([
            { $match: matchStage },
            // ... (mesmo código de antes para separar frete/produtos) ...
             {
                $group: {
                    _id: null,
                    grandTotal: { $sum: '$total' },
                    productsTotal: {
                        $sum: {
                            $sum: {
                                $map: {
                                    input: "$items",
                                    as: "item",
                                    in: { $multiply: [{ $toDouble: "$$item.price" }, { $toDouble: "$$item.quantity" }] }
                                }
                            }
                        }
                    },
                    totalOrders: { $sum: 1 },
                    avgTicket: { $avg: '$total' }
                }
            },
            {
                $project: {
                    totalRevenue: "$grandTotal",
                    productRevenue: "$productsTotal",
                    deliveryRevenue: { $subtract: ["$grandTotal", "$productsTotal"] },
                    totalOrders: 1,
                    avgTicket: 1
                }
            }
        ]);

        // ... (daily, payments, topProducts mantêm o mesmo código, apenas usando matchStage) ...
        // Re-inclua aqui as queries daily, payments e topProducts que te passei na resposta anterior
        // Elas vão usar automaticamente o "matchStage" que configuramos acima.

        const daily = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    dailyRevenue: { $sum: '$total' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 7 } 
        ]);

        const payments = await Order.aggregate([
            { $match: matchStage },
            { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
        ]);

        const productsAggregation = await Order.aggregate([
            { $match: matchStage },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    totalQty: { $sum: { $toDouble: "$items.quantity" } },
                    totalRevenue: { $sum: { $multiply: [{ $toDouble: "$items.price" }, { $toDouble: "$items.quantity" }] } }
                }
            },
            { $sort: { totalQty: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            success: true,
            totals: stats[0] || { totalRevenue: 0, productRevenue: 0, deliveryRevenue: 0, totalOrders: 0, avgTicket: 0 },
            daily,
            payments,
            topProducts: productsAggregation 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.cleanupOrphans = async (req, res) => {
    try {
        const Restaurant = require('../models/Restaurant');
        
        // 1. Pega todos os pedidos
        const allOrders = await Order.find({});
        let deletedCount = 0;

        for (const order of allOrders) {
            // Verifica se o restaurante desse pedido ainda existe
            const parentExists = await Restaurant.exists({ _id: order.restaurant });
            
            if (!parentExists) {
                // Se não existe, tchau pedido!
                await Order.deleteOne({ _id: order._id });
                deletedCount++;
            }
        }

        res.status(200).json({ 
            success: true, 
            message: `Faxina completa! ${deletedCount} pedidos órfãos foram removidos.` 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.trackOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se é um ID válido do MongoDB para não quebrar o servidor
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: 'Código de pedido inválido.' });
        }

        // Busca apenas dados essenciais (Segurança: não devolve dados sensíveis do cliente)
        const order = await Order.findById(id)
            .select('status timeline items total restaurant createdAt')
            .populate('restaurant', 'name phone deliveryTime');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getOrdersByCustomerPhone = async (req, res) => {
    try {
        const phone = req.params.phone;
        // Busca pedidos onde o telefone contem os numeros digitados
        // Ordena do mais recente para o mais antigo
        const orders = await Order.find({ "customer.phone": { $regex: phone, $options: 'i' } })
                                  .sort({ createdAt: -1 })
                                  .populate('restaurant', 'name');

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.confirmOrderPayment = async (req, res) => {
    try {
        const { paymentId, status } = req.body;
        console.log(`✅ Confirmando Pagamento do Pedido ${req.params.id}`);
        console.log(`- ID Pix: ${paymentId}`);
        
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Não encontrado' });

        // ATUALIZAÇÃO CRÍTICA
        order.paymentStatus = 'Pago'; 
        order.paymentId = paymentId; // Salva o ID novamente para garantir
        order.status = status || 'Novo';
        
        order.timeline.push({ status: 'Pagamento Confirmado', timestamp: new Date() });

        await order.save();
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error("Erro ao confirmar:", error);
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if(!order) return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
        res.status(200).json({ success: true, message: 'Pedido deletado' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteAllOrders = async (req, res) => {
    try {
        // Verifica se é o Admin "PedeAi" (pode ser pelo email ou role)
        // Aqui vou confiar que a rota já tem middleware de admin
        await Order.deleteMany({}); // Apaga tudo!
        res.status(200).json({ success: true, message: 'TODOS os pedidos foram apagados.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};