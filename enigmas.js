const enigmas = [
  // 1
  { pergunta: "A senha é SENHA", resposta: "a senha é SENHA" },

  // 2
  { pergunta: "No escuro...", resposta: "O COMEÇO" },

  // 3
  { pergunta: "E   R  M X I ? L E T E A N", resposta: "REALMENTE EXISTE?" },

  // 4
  { pergunta: "É LÓXVDÕ RX UHDOLGDGH?", resposta: "É ILUSÃO OU REALIDADE?" },

  // 5
  { pergunta: "1 0", resposta: "AMAR É DEIXAR IR" },

  // 6
  { pergunta: "", resposta: "DESISTA AGORA" },

  // 7 - Brainfuck
  { 
    pergunta: `
++++++++++[>+>+++>+++++++>++++++++++<<<<-]
>>>>++++++++++++++.
---------.++++++++++.
----.++++.<<++.
>>-.---------.++++++++++.
----.++++.<<++++++++++++.
------------.>>----------.++++++++++..
----.<<.>>----------.<<.>>---.++++++++++++++++.
---------.+++++.-----------.--.+++.+.++++.+++++++++.
-----------------.<<.>>+++.+.<<.>>--.+++++++++++++++.
---------.--------.+++++++++++++.-----------.--.`,
    resposta: "risos risos"
  },

  // 8 - Imagem
  { 
    pergunta: "", 
    resposta: "Naat esteve aqui" 
  },

  // 9 - Línguas estranhas
  { 
    pergunta: "òdi bandinga frjemd", 
    resposta: "odeio linguas estrangeiras" 
  },

  // 10 - Imagem
  { 
    pergunta: "", 
    resposta: "meus olhos" 
  },

  // 11 - Enigma especial com áudio
  { 
    pergunta: "", 
    resposta: "eu não consigo mais" 
  },

  // 12 - Tap Code
  {
    pergunta: "... .  ... ....  .... .....  . ...  .... .....  .... ..  . .  .... ...  / . ..  . .  .... ....  ... ..  . .  ... ...  ",
    resposta: "loucuras batman"
  }
];

let currentEnigma = 0;
let morseAudio = null;

const questionContainer = document.querySelector('.question-container');
const questionTextElem = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submitAnswer');

function showEnigma(index) {
    if (index >= enigmas.length) return;

    currentEnigma = index;
    questionTextElem.innerHTML = '';

    // Enigmas com imagem
    if (index === 7) { // Enigma 8
        const img = document.createElement('img');
        img.src = "8.png";
        img.style.maxWidth = "90%"; // diminui 30%
        img.style.height = "auto";
        questionTextElem.appendChild(img);
    } else if (index === 9) { // Enigma 10
        const img = document.createElement('img');
        img.src = "10.png";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        questionTextElem.appendChild(img);
    } else if (index === 10) { // Enigma 11
        questionTextElem.innerText = "";
        morseAudio = new Audio("souns/morse inverso.mp3");
        morseAudio.volume = 0.5;
        function playWithDelay() {
            morseAudio.play();
            morseAudio.onended = () => setTimeout(playWithDelay, 3000);
        }
        playWithDelay();
    } else {
        questionTextElem.innerText = enigmas[index].pergunta;
    }

    answerInput.value = '';
    answerInput.focus();
    questionContainer.style.display = 'flex';

    // Fundo especial enigma 2 (diminuído 30%)
    if (index === 1) {
        document.body.style.backgroundImage = "url('2.png')";
        document.body.style.backgroundSize = "95% auto"; // diminui 30%
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
    } else if (index === 2 || index === 5) {
        document.body.style.backgroundImage = "none";
    } else if (index === 4) {
        document.body.style.backgroundImage = "url('5.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    }

    // Diminui fonte só para Brainfuck (enigma 7)
    if (index === 6) {
        questionTextElem.style.fontSize = "12px";
        questionTextElem.style.lineHeight = "1.1em";
    } else {
        questionTextElem.style.fontSize = "";
        questionTextElem.style.lineHeight = "";
    }
}

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = enigmas[currentEnigma].resposta.toLowerCase();

    // Senha reserva para pular tudo
    if (userAnswer === "pinto") {
        currentEnigma = enigmas.length - 1;
        showEnigma(currentEnigma);
        return;
    }

    if (userAnswer === correctAnswer) {
        currentEnigma++;
        showEnigma(currentEnigma);

        // Gran Finalle: se passou do último enigma
        if (currentEnigma === enigmas.length) {
            setTimeout(() => {
                alert("UPDATE EM BREVE!");
            }, 100);
        }

    } else {
        if (currentEnigma === 5) {
            alert("É o fim da linha! DESISTA AGORA!");
        }

        const wrongSound = new Audio("souns/wrong.mp3");
        wrongSound.play();

        answerInput.style.transition = "box-shadow 0.1s";
        answerInput.style.boxShadow = "0 0 8px 3px #ffffff";
        setTimeout(() => answerInput.style.boxShadow = "none", 100);

        let text = answerInput.value;
        const interval = setInterval(() => {
            text = text.slice(0, -1);
            answerInput.value = text;
            if (text.length === 0) clearInterval(interval);
        }, 80);
    }
}  // 8 - Imagem
  { 
    pergunta: "", 
    resposta: "Naat esteve aqui" 
  },

  // 9 - Línguas estranhas
  { 
    pergunta: "òdi bandinga frjemd", 
    resposta: "odeio linguas estrangeiras" 
  },

  // 10 - Imagem
  { 
    pergunta: "", 
    resposta: "meus olhos" 
  },

  // 11 - Enigma especial com áudio
  { 
    pergunta: "", 
    resposta: "eu não consigo mais" 
  },

  // 12 - Tap Code
  {
    pergunta: "... .  ... ....  .... .....  . ...  .... .....  .... ..  . .  .... ...  / . ..  . .  .... ....  ... ..  . .  ... ...  ",
    resposta: "loucuras batman"
  }
];

let currentEnigma = 0;
let morseAudio = null;

const questionContainer = document.querySelector('.question-container');
const questionTextElem = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submitAnswer');

function showEnigma(index) {
    if (index >= enigmas.length) return;

    currentEnigma = index;
    questionTextElem.innerHTML = '';

    // Enigmas com imagem
    if (index === 7) { // Enigma 8
        const img = document.createElement('img');
        img.src = "Imagens/8.png";
        img.style.maxWidth = "70%"; // diminui 30%
        img.style.height = "auto";
        questionTextElem.appendChild(img);
    } else if (index === 9) { // Enigma 10
        const img = document.createElement('img');
        img.src = "Imagens/10.png";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        questionTextElem.appendChild(img);
    } else if (index === 10) { // Enigma 11
        questionTextElem.innerText = "";
        morseAudio = new Audio("souns/morse inverso.mp3");
        morseAudio.volume = 0.5;
        function playWithDelay() {
            morseAudio.play();
            morseAudio.onended = () => setTimeout(playWithDelay, 3000);
        }
        playWithDelay();
    } else {
        questionTextElem.innerText = enigmas[index].pergunta;
    }

    answerInput.value = '';
    answerInput.focus();
    questionContainer.style.display = 'flex';

    // Fundo especial enigma 2 (diminuído 30%)
    if (index === 1) {
        document.body.style.backgroundImage = "url('Imagens/2.png')";
        document.body.style.backgroundSize = "70% auto"; // diminui 30%
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
    } else if (index === 2 || index === 5) {
        document.body.style.backgroundImage = "none";
    } else if (index === 4) {
        document.body.style.backgroundImage = "url('Imagens/5.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    }

    // Diminui fonte só para Brainfuck (enigma 7)
    if (index === 6) {
        questionTextElem.style.fontSize = "12px";
        questionTextElem.style.lineHeight = "1.1em";
    } else {
        questionTextElem.style.fontSize = "";
        questionTextElem.style.lineHeight = "";
    }
}

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = enigmas[currentEnigma].resposta.toLowerCase();

    // Senha reserva para pular tudo
    if (userAnswer === "pinto") {
        currentEnigma = enigmas.length - 1;
        showEnigma(currentEnigma);
        return;
    }

    if (userAnswer === correctAnswer) {
        currentEnigma++;
        showEnigma(currentEnigma);

        // Gran Finalle: se passou do último enigma
        if (currentEnigma === enigmas.length) {
            setTimeout(() => {
                alert("UPDATE EM BREVE!");
            }, 100);
        }

    } else {
        if (currentEnigma === 5) {
            alert("É o fim da linha! DESISTA AGORA!");
        }

        const wrongSound = new Audio("souns/wrong.mp3");
        wrongSound.play();

        answerInput.style.transition = "box-shadow 0.1s";
        answerInput.style.boxShadow = "0 0 8px 3px #ffffff";
        setTimeout(() => answerInput.style.boxShadow = "none", 100);

        let text = answerInput.value;
        const interval = setInterval(() => {
            text = text.slice(0, -1);
            answerInput.value = text;
            if (text.length === 0) clearInterval(interval);
        }, 80);
    }
}  // 8 - Imagem
  { 
    pergunta: "", 
    resposta: "Naat esteve aqui" 
  },

  // 9 - Línguas estranhas
  { 
    pergunta: "òdi bandinga frjemd", 
    resposta: "odeio linguas estrangeiras" 
  },

  // 10 - Imagem
  { 
    pergunta: "", 
    resposta: "meus olhos" 
  },

  // 11 - Enigma especial com áudio
  { 
    pergunta: "", 
    resposta: "eu não consigo mais" 
  },

  // 12 - Tap Code
  {
    pergunta: "... .  ... ....  .... .....  . ...  .... .....  .... ..  . .  .... ...  / . ..  . .  .... ....  ... ..  . .  ... ...  ",
    resposta: "loucuras batman"
  }
];

let currentEnigma = 0;
let morseAudio = null;

const questionContainer = document.querySelector('.question-container');
const questionTextElem = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submitAnswer');

function showEnigma(index) {
    if (index >= enigmas.length) return;

    currentEnigma = index;
    questionTextElem.innerHTML = '';

    // Enigmas com imagem
    if (index === 7) { // 8
        const img = document.createElement('img');
        img.src = "8.png";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        questionTextElem.appendChild(img);
    } else if (index === 9) { // 10
        const img = document.createElement('img');
        img.src = "10.png";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        questionTextElem.appendChild(img);
    } else if (index === 10) { // 11
        questionTextElem.innerText = "";
        morseAudio = new Audio("morse inverso.mp3");
        morseAudio.volume = 0.5;
        function playWithDelay() {
            morseAudio.play();
            morseAudio.onended = () => setTimeout(playWithDelay, 3000);
        }
        playWithDelay();
    } else {
        questionTextElem.innerText = enigmas[index].pergunta;
    }

    answerInput.value = '';
    answerInput.focus();
    questionContainer.style.display = 'flex';

    // Fundo especial
    if (index === 1) {
        document.body.style.backgroundImage = "url('2.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    } else if (index === 2 || index === 5) {
        document.body.style.backgroundImage = "none";
    } else if (index === 4) {
        document.body.style.backgroundImage = "url('5.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    }

    // Diminui fonte só para Brainfuck (enigma 7)
    if (index === 6) {
        questionTextElem.style.fontSize = "12px";
        questionTextElem.style.lineHeight = "1.1em";
    } else {
        questionTextElem.style.fontSize = "";
        questionTextElem.style.lineHeight = "";
    }
}

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = enigmas[currentEnigma].resposta.toLowerCase();

    // Senha reserva para pular tudo
    if (userAnswer === "pinto") {
        currentEnigma = enigmas.length - 1;
        showEnigma(currentEnigma);
        return;
    }

    if (userAnswer === correctAnswer) {
        currentEnigma++;
        showEnigma(currentEnigma);

        // Gran Finalle: se passou do último enigma
        if (currentEnigma === enigmas.length) {
            setTimeout(() => {
                alert("UPDATE EM BREVE!");
            }, 100);
        }

    } else {
        if (currentEnigma === 5) {
            alert("É o fim da linha! DESISTA AGORA!");
        }

        const wrongSound = new Audio("souns/wrong.mp3");
        wrongSound.play();

        answerInput.style.transition = "box-shadow 0.1s";
        answerInput.style.boxShadow = "0 0 8px 3px #ffffff";
        setTimeout(() => answerInput.style.boxShadow = "none", 100);

        let text = answerInput.value;
        const interval = setInterval(() => {
            text = text.slice(0, -1);
            answerInput.value = text;
            if (text.length === 0) clearInterval(interval);
        }, 80);
    }
}
