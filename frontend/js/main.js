// frontend/js/main.js

const API_URL = 'http://localhost:3000/api/restaurants';
const container = document.getElementById('restaurants-container');

// 1. Função para buscar dados da API Real
async function fetchRestaurants() {
    try {
        // Mostra um estado de loading simples (opcional)
        // container.innerHTML = '<p style="text-align:center; padding: 20px;">Carregando sabores...</p>';

        const response = await fetch(API_URL);
        const json = await response.json();

        if (json.success) {
            renderRestaurants(json.data);
        } else {
            console.error('Erro na API:', json.message);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        container.innerHTML = '<p style="text-align:center; color: var(--color-danger)">Erro ao carregar restaurantes. O servidor está rodando?</p>';
    }
}

// 2. Função de Renderização (Reutilizando a lógica visual)
function renderRestaurants(restaurants) {
    container.innerHTML = ''; // Limpa antes de renderizar

    restaurants.forEach(restaurant => {
        const card = createCardHTML(restaurant);
        container.innerHTML += card;
    });
}

// 3. Monta o HTML do Card
function createCardHTML(restaurant) {
    const feeDisplay = restaurant.deliveryFee === 0 
        ? '<span style="color: var(--color-action)">Grátis</span>' 
        : `R$ ${restaurant.deliveryFee.toFixed(2).replace('.', ',')}`;

    // A MUDANÇA ESTÁ AQUI EMBAIXO:
    // Envolvemos o card em um <a href> passando o slug
    return `
        <a href="loja.html?slug=${restaurant.slug}" class="card-link">
            <article class="card">
                <div class="card-badge">⭐ ${restaurant.rating}</div>
                <img src="${restaurant.image}" alt="${restaurant.name}" class="card-image" loading="lazy">
                <div class="card-content">
                    <h3 class="card-title">${restaurant.name}</h3>
                    <div class="card-meta">
                        <span>${restaurant.category}</span>
                        <span class="dot-separator"></span>
                        <span>${restaurant.deliveryTime}</span>
                        <span class="dot-separator"></span>
                        <span>${feeDisplay}</span>
                    </div>
                </div>
            </article>
        </a>
    `;
}

function displayRestaurants(restaurants) {
            const container = document.getElementById('restaurants-grid');
            container.innerHTML = '';

            restaurants.forEach(r => {
                // Define classes baseado no status que veio do backend
                const isOpen = r.isOpen; // O backend já calculou isso pra gente!
                
                const statusClass = isOpen ? 'status-open' : 'status-closed';
                const statusText = isOpen ? 'Aberto' : 'Fechado';
                const cardClass = isOpen ? '' : 'card-closed';
                
                // Formata horário para mostrar no card (opcional)
                const hoursText = `${r.opensAt} às ${r.closesAt}`;

                const card = `
                    <div class="restaurant-card ${cardClass}" onclick="if(${isOpen}) window.location.href='loja.html?slug=${r.slug}'">
                        
                        <div class="status-badge ${statusClass}">
                            ${statusText}
                        </div>

                        <img src="${r.image}" alt="${r.name}" class="restaurant-img">
                        
                        <div class="restaurant-info">
                            <div class="restaurant-header">
                                <h3 class="restaurant-name">${r.name}</h3>
                                <span class="restaurant-rating">⭐ ${r.rating}</span>
                            </div>
                            
                            <div class="restaurant-details">
                                <span>${r.category}</span>
                                <span>•</span>
                                <span>${r.deliveryTime}</span>
                                <span>•</span>
                                <span style="color:${r.deliveryFee === 0 ? '#28a745' : '#666'}">
                                    ${r.deliveryFee === 0 ? 'Grátis' : 'R$ ' + r.deliveryFee.toFixed(2)}
                                </span>
                            </div>

                            <div style="font-size: 0.75rem; color: #999; margin-top: 8px;">
                                🕒 ${hoursText}
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(domParser(card));
            });
        }
        
        function domParser(string) {
            const parser = new DOMParser();
            return parser.parseFromString(string, 'text/html').body.firstChild;
        }

// Inicia
document.addEventListener('DOMContentLoaded', fetchRestaurants);