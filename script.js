document.addEventListener('DOMContentLoaded', function() {
    const voidButton = document.getElementById('voidButton');
    const container = document.querySelector('.container');
    const questionScreen = document.querySelector('.question-screen');
    const answerInput = document.querySelector('.answer-input');
    const submitAnswer = document.querySelector('.submit-answer');
    const lightOffSound = document.getElementById('lightOffSound');
    const lightOnSound = document.getElementById('lightOnSound');

    voidButton.addEventListener('click', function() {
        if (lightOffSound) {
            lightOffSound.play().catch(e => console.log("Erro no áudio: ", e));
        }

        container.style.opacity = '0';

        const blackScreen = document.createElement('div');
        blackScreen.classList.add('black-screen');
        document.body.appendChild(blackScreen);

        setTimeout(() => {
            blackScreen.classList.add('visible');
        }, 300);

        setTimeout(() => {
            if (lightOnSound) {
                lightOnSound.play().catch(e => console.log("Erro no áudio: ", e));
            }

            blackScreen.classList.remove('visible');
            setTimeout(() => blackScreen.remove(), 500);

            questionScreen.classList.remove('hidden');
            setTimeout(() => {
                questionScreen.classList.add('visible');
                answerInput.focus();
            }, 100);
        }, 2000);
    });

    submitAnswer.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkAnswer();
    });

    function checkAnswer() {
        const answer = answerInput.value.trim().toLowerCase();
        const correctAnswer = 'o desconhecido';

        if (answer === correctAnswer) {
            alert('Resposta correta! Você enfrentou seu medo.');
            resetExperience();
        } else {
            alert('Resposta incorreta. Tente novamente.');
            answerInput.value = '';
            answerInput.focus();
        }
    }

    function resetExperience() {
        questionScreen.classList.remove('visible');
        setTimeout(() => {
            questionScreen.classList.add('hidden');
            container.style.opacity = '1';
        }, 1000);
    }
});
