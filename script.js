document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const overlay = document.getElementById('overlay');
    const title = document.querySelector('h1');
    const questionContainer = document.querySelector('.question-container');
    const body = document.body;
    let firstTime = true;
    const switchSound = new Audio('souns/luzinha.mp3'); // Som do interruptor

    startBtn.addEventListener('click', () => {
        if (firstTime) {
            // Som do interruptor
            switchSound.currentTime = 0;
            switchSound.play().catch(e => console.log("Erro ao tocar som:", e));

            // Mostrar overlay e esconder título, botão e fundo
            overlay.style.display = 'flex';
            overlay.classList.add('show');
            title.style.display = 'none';
            startBtn.style.display = 'none';
            body.classList.add('hide-tv-background'); // classe para esconder o fundo

            questionContainer.style.display = 'none';

            setTimeout(() => {
                // Depois de 5s, esconder overlay
                overlay.style.display = 'none';

                // Tocar som do interruptor novamente
                switchSound.currentTime = 0;
                switchSound.play().catch(e => console.log("Erro ao tocar som:", e));

                // Mostrar a primeira pergunta
                showEnigma(currentEnigma);

                firstTime = false;
            }, 3000);
        } else {
            // Mostrar pergunta normalmente
            showEnigma(currentEnigma);
        }
    });
});
