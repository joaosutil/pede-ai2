// frontend/js/auth-guard.js

(function() {
    const token = localStorage.getItem('pedeai_token');

    // 1. Se não tem token, tchau!
    if (!token) {
        window.location.href = 'login.html';
    }

    // 2. Função de Logout (para usarmos no botão Sair)
    window.logout = function() {
        if(confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('pedeai_token');
            localStorage.removeItem('pedeai_user');
            window.location.href = 'login.html';
        }
    };
})();