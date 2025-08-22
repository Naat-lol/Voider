// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const voidButton = document.getElementById('voidButton');
    const container = document.querySelector('.container');
    const questionScreen = document.querySelector('.question-screen');
    const answerInput = document.querySelector('.answer-input');
    const submitAnswer = document.querySelector('.submit-answer');
    const lightOffSound = document.getElementById('lightOffSound');
    const lightOnSound = document.getElementById('lightOnSound');
    
    // Adiciona evento de clique no botão
    voidButton.addEventListener('click', function() {
        // Toca o som de luz se apagando
        if (lightOffSound) {
            lightOffSound.play().catch(e => {
                console.log("Erro ao reproduzir áudio: ", e);
            });
        }
        
        // Esconde o container principal
        container.style.opacity = '0';
        
        // Cria tela preta
        const blackScreen = document.createElement('div');
        blackScreen.classList.add('black-screen');
        document.body.appendChild(blackScreen);
        
        // Mostra a tela preta
        setTimeout(() => {
            blackScreen.classList.add('visible');
        }, 1000);
        
        // Após 3 segundos, mostra a pergunta com som de luz acendendo
        setTimeout(() => {
            // Toca som de luz acendendo
            if (lightOnSound) {
                lightOnSound.play().catch(e => {
                    console.log("Erro ao reproduzir áudio: ", e);
                });
            }
            
            blackScreen.classList.remove('visible');
            setTimeout(() => {
                blackScreen.remove();
            }, 1000);
            
            questionScreen.classList.remove('hidden');
            
            // Adiciona pequeno delay para a transição de opacidade
            setTimeout(() => {
                questionScreen.classList.add('visible');
                answerInput.focus();
            }, 100);
        }, 3000);
    });
    
    // Adiciona evento de clique no botão de enviar resposta
    submitAnswer.addEventListener('click', function() {
        checkAnswer();
    });
    
    // Adiciona evento de pressionar Enter no campo de resposta
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    // Função para verificar a resposta
    function checkAnswer() {
        const answer = answerInput.value.trim().toLowerCase();
        
        // Resposta correta (pode ser alterada)
        const correctAnswer = 'o desconhecido';
        
        if (answer === correctAnswer) {
            // Resposta correta
            alert('Resposta correta! Você enfrentou seu medo.');
            resetExperience();
        } else {
            // Resposta incorreta
            alert('Resposta incorreta. Tente novamente.');
            answerInput.value = '';
            answerInput.focus();
        }
    }
    
    // Função para resetar a experiência
    function resetExperience() {
        const questionScreen = document.querySelector('.question-screen');
        questionScreen.classList.remove('visible');
        
        setTimeout(() => {
            questionScreen.classList.add('hidden');
            
            const container = document.querySelector('.container');
            container.style.opacity = '1';
        }, 1000);
    }
});
