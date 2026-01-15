const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Adicione um nome'],
        trim: true,
        maxlength: [50, 'Nome não pode ter mais de 50 caracteres']
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Adicione um email válido'
        ]
    },
    password: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: 6,
        select: false 
    },
    role: {
        type: String,
        enum: ['restaurant', 'admin'],
        default: 'restaurant'
    },
    category: {
        type: String,
        required: true,
        enum: ['Hamburgueria', 'Pizzaria', 'Japonês', 'Brasileira', 'Doces', 'Saudável', 'Outros']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    deliveryTime: String,
    deliveryFee: Number,

    addressState: { type: String }, // Ex: SC
    addressCity: { type: String },  // Ex: Joinville

    deliveryZones: [
        {
            name: { type: String, required: true }, // Nome do Bairro
            price: { type: Number, required: true } // Valor da Taxa
        }
    ],
    image: String,
    // --- NOVOS CAMPOS DE HORÁRIO ---
    opensAt: { type: String, default: "18:00" }, 
    closesAt: { type: String, default: "23:59" },
    // -------------------------------
    
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    phone: { 
        type: String, 
        default: "5500000000000" // Formato internacional (55 + DDD + Numero)
    },
    whatsappTemplate: {
        type: String,
        default: `🤖 *PEDIDO #{id}*\n--------------------------------\n👤 *Cliente:* {nome}\n📱 *Tel:* {telefone}\n📍 *Endereço:* {endereco}\n--------------------------------\n🍔 *RESUMO:*\n{itens}\n--------------------------------\n🛵 *Taxa:* R$ {taxa}\n💳 *Pagamento:* {pagamento}\n💰 *TOTAL:* R$ {total}\n--------------------------------\n✅ *Aguardando confirmação!*`
    }
});

// Criptografia de senha
RestaurantSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Comparar senha
RestaurantSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Restaurant', RestaurantSchema);