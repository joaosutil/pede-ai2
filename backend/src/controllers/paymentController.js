const { MercadoPagoConfig, Payment, Refund } = require('mercadopago');
const Order = require('../models/Order');

// ⚠️ SEU TOKEN DE PRODUÇÃO (APP_USR-...)
const YOUR_ACCESS_TOKEN = 'APP_USR-1213437280053926-011322-647950d555f8dbccc0b72ab666d09c16-281708794'; // <--- CONFIRA SEU TOKEN AQUI

const client = new MercadoPagoConfig({ accessToken: YOUR_ACCESS_TOKEN });

// 1. CRIAR PIX
exports.createPixPayment = async (req, res) => {
    try {
        const { amount, description, payer, orderId } = req.body;
        const payment = new Payment(client);

        const body = {
            transaction_amount: parseFloat(amount),
            description: description || 'Pedido PedeAi',
            payment_method_id: 'pix',
            payer: {
                email: payer.email || 'cliente@email.com',
                first_name: payer.name ? payer.name.split(' ')[0] : 'Cliente',
                last_name: payer.name ? payer.name.split(' ').slice(1).join(' ') : ''
            },
        };

        const result = await payment.create({ body });
        
        // Vincula ao pedido
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                paymentId: result.id.toString(),
                paymentStatus: 'Aguardando Pagamento'
            });
        }

        const responseData = {
            id: result.id,
            status: result.status,
            qr_code: result.point_of_interaction.transaction_data.qr_code,
            qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64
        };

        res.status(201).json({ success: true, data: responseData });
    } catch (error) {
        console.error("Erro Pix:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. CRIAR PAGAMENTO CARTÃO (NOVO!)
exports.createCardPayment = async (req, res) => {
    try {
        // Recebemos todos os dados do Frontend
        const { 
            token, issuer_id, payment_method_id, transaction_amount, 
            installments, payer, orderId 
        } = req.body;

        console.log("💳 Iniciando pagamento Cartão:", { amount: transaction_amount, email: payer.email });

        const payment = new Payment(client);

        // Montagem Cuidadosa do Payload
        const body = {
            token,
            issuer_id,
            payment_method_id,
            transaction_amount: parseFloat(transaction_amount),
            installments: Number(installments),
            description: `Pedido #${orderId ? orderId.slice(-4) : 'Loja'}`,
            payer: {
                email: payer.email || 'cliente@pedeai.com',
                entity_type: payer.entity_type || 'individual', // Garante que vá preenchido
                identification: {
                    type: payer.identification.type,
                    number: payer.identification.number
                }
            }
        };

        // Cria o pagamento
        const result = await payment.create({ body });

        // SE APROVADO, ATUALIZA O PEDIDO
        if (result.status === 'approved') {
            console.log("✅ Pagamento Aprovado!");
            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    paymentId: result.id.toString(),
                    paymentStatus: 'Pago',
                    status: 'Novo' // Agora a loja vai conseguir ver (graças ao filtro do passo 1)
                });
            }
            res.status(201).json({ success: true, data: result });
        } else {
            console.log("❌ Pagamento Recusado/Pendente:", result.status);
            // Se não aprovou, não marcamos como pago, então a loja NÃO VÊ.
            res.status(400).json({ success: false, error: "Pagamento não aprovado: " + result.status });
        }

    } catch (error) {
        console.error("❌ Erro Crítico Cartão:", error);
        // Tenta extrair a mensagem real do Mercado Pago
        const msg = error.cause && error.cause[0] ? error.cause[0].description : error.message;
        res.status(400).json({ success: false, error: msg });
    }
};

// 3. VERIFICAR STATUS
exports.checkPaymentStatus = async (req, res) => {
    try {
        const payment = new Payment(client);
        const result = await payment.get({ id: req.params.id });
        res.status(200).json({ success: true, status: result.status });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. REEMBOLSO (Blindado via API)
exports.refundPayment = async (paymentId) => {
    try {
        if (!paymentId) return { success: false, error: "Sem ID" };
        
        console.log(`💸 Reembolsando: ${paymentId}`);
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': `${Date.now()}`
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Erro API MP');
        
        return { success: true, data: data };
    } catch (error) {
        console.error("Erro Reembolso:", error.message);
        return { success: false, error: error.message };
    }
};