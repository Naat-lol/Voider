// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona estrelas dinâmicas
    createStars();
    
    // Adiciona efeito de partículas ao botão
    const button = document.querySelector('.void-button');
    button.addEventListener('click', function() {
        createParticles(event);
        // Aqui você pode adicionar mais ações para o clique no botão
        console.log('Botão "Fill The Void..." clicado!');
    });
});

// Função para criar estrelas dinâmicas
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const starsCount = 150;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Posição aleatória
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Tamanho aleatório
        const size = Math.random() * 3;
        
        // Duração da animação aleatória
        const duration = Math.random() * 10 + 5;
        
        // Atraso aleatório
        const delay = Math.random() * 5;
        
        star.style.cssText = `
            position: absolute;
            top: ${posY}vh;
            left: ${posX}vw;
            width: ${size}px;
            height: ${size}px;
            background: white;
            border-radius: 50%;
            animation: twinkle ${duration}s ${delay}s infinite;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        `;
        
        starsContainer.appendChild(star);
    }
    
    // Adiciona a animação de twinkle para as estrelas dinâmicas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Função para criar partículas ao clicar no botão
function createParticles(event) {
    const particlesContainer = document.createElement('div');
    particlesContainer.style.position = 'fixed';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '100';
    document.body.appendChild(particlesContainer);
    
    const particleCount = 30;
    const colors = ['#8a2be2', '#9370db', '#6a5acd', '#7b68ee', '#483d8b'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 10px currentColor';
        
        // Posição inicial (onde o botão foi clicado)
        const buttonRect = event.target.getBoundingClientRect();
        const startX = buttonRect.left + buttonRect.width / 2;
        const startY = buttonRect.top + buttonRect.height / 2;
        
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        // Direção aleatória
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const distance = Math.random() * 100 + 50;
        
        // Animação
        particle.animate([
            { 
                transform: `translate(0, 0) scale(1)`,
                opacity: 1
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: Math.random() * 1000 + 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });
        
        particlesContainer.appendChild(particle);
        
        // Remove a partícula após a animação
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
    
    // Remove o container de partículas após um tempo
    setTimeout(() => {
        particlesContainer.remove();
    }, 2000);
}
