const multer = require('multer');
const path = require('path');

// Configuração de onde salvar e qual nome dar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Pasta de destino
    },
    filename: function (req, file, cb) {
        // Nome único: DataAtual + NomeOriginal (ex: 17823812-hamburguer.jpg)
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
    }
});

// Filtro (Só aceitar imagens)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;