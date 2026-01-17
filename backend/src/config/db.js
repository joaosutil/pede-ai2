const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Tenta conectar usando a URI do .env
    // Removidas as opções useNewURLParser e useUnifiedTopology pois são padrão nas versões recentes do driver
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Erro ao conectar ao MongoDB: ${err.message}`);
    // Não encerra o processo imediatamente para permitir debug
    console.warn("Dica: Verifique se o seu serviço do MongoDB está rodando ou se a MONGO_URI no .env está correta.");
  }
};

module.exports = connectDB;