const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante que a pasta de uploads existe para não dar erro ao salvar
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Gera um nome único: timestamp-nome_limpo.extensao
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const cleanFileName = file.originalname.replace(/\s/g, '_').toLowerCase();
        cb(null, uniqueSuffix + '-' + cleanFileName);
    }
});

// Filtro de segurança (Apenas imagens reais)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de imagem inválido. Use JPEG, PNG ou WebP.'), false);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por imagem
});

module.exports = upload;