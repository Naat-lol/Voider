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
    resposta: "eu nao consigo mais" 
  },

  // 12 - Tap Code
  {
    pergunta: "... .  ... ....  .... .....  . ...  .... .....  .... ..  . .  .... ...  / . ..  . .  .... ....  ... ..  . .  ... ...  ",
    resposta: "loucuras batman"
  },

  // 13 - Cidades
  {
    pergunta: "BH, MG\nPR, PR\nGO = 3,1415926",
    resposta: "goiânia, goiás"
  },

  // 14
  {
    pergunta: "piero di cosima em chamas",
    resposta: "the forest fire"
  },

  // 15 - Som com números
  {
    pergunta: "escute e transcreva",
    resposta: "113271736512778",
    audio: "113 271 736 512 778.mp3"
  },

  // 16 - Caixa Schrödinger
  {
    pergunta: "Dentro da caixa",
    resposta: "schrödinger",
    imagem: "Caixa.png"
  },

  // 17 - Base64 + ASCII
  {
    pergunta: "99 88 86 108 89 110 74 104 73 71 78 104 89 109 86 106 89 81 61 61",
    resposta: "quebra cabeça"
  },
  // 18 - Imagem House
  {
    pergunta: "Criação",
    resposta: "microsoft",
    imagem: "House.png"
  }
];

let currentEnigma = 0;
let morseAudio = null;
let numberAudio = null;
let audioTimeout = null;

const questionContainer = document.querySelector('.question-container');
const questionTextElem = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submitAnswer');

function stopAllAudio() {
    if (morseAudio) {
        morseAudio.pause();
        morseAudio.currentTime = 0;
        morseAudio.onended = null; // limpa callback
        morseAudio = null;
    }
    if (numberAudio) {
        numberAudio.pause();
        numberAudio.currentTime = 0;
        numberAudio.onended = null; // limpa callback
        numberAudio = null;
    }
    if (audioTimeout) {
        clearTimeout(audioTimeout);
        audioTimeout = null;
    }
}

function playAudioWithDelay(audioObj, delay = 3000) {
    stopAllAudio();
    if (!audioObj) return;

    // guarda referência global, pra poder parar depois
    if (audioObj.src.includes("morse")) {
        morseAudio = audioObj;
    } else {
        numberAudio = audioObj;
    }

    audioObj.play();
    audioObj.onended = () => {
        audioTimeout = setTimeout(() => {
            if (audioObj) {
                audioObj.currentTime = 0;
                audioObj.play();
            }
        }, delay);
    };
}

function showEnigma(index) {
    if (index >= enigmas.length) return;
    currentEnigma = index;
    questionTextElem.innerHTML = '';
    answerInput.value = '';
    answerInput.focus();
    questionContainer.style.display = 'flex';
    stopAllAudio();

    if (index === 7) { // Enigma 8
        const img = document.createElement('img');
        img.src = "8.png";
        img.style.maxWidth = "90%";
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
        morseAudio = new Audio("morse inverso.mp3");
        morseAudio.volume = 0.5;
        playAudioWithDelay(morseAudio, 3000);

    } else if (index === 14) { // Enigma 15
        questionTextElem.innerText = "";
        numberAudio = new Audio(enigmas[index].audio);
        playAudioWithDelay(numberAudio, 3000);

    } else if (index === 15 || index === 17) { // Enigma 16 e Enigma 18
        questionTextElem.innerHTML = '';
        const container = document.createElement('div');
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";
        container.style.padding = "10px";

        const img = document.createElement('img');
        img.src = enigmas[index].imagem;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.cursor = "pointer";
        container.appendChild(img);

        const textNode = document.createElement('p');
        textNode.innerText = enigmas[index].pergunta;
        textNode.style.textAlign = "center";
        textNode.style.marginTop = "10px";
        container.appendChild(textNode);

        questionTextElem.appendChild(container);

        img.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = enigmas[index].imagem;
            link.download = enigmas[index].imagem.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

    } else {
        questionTextElem.innerText = enigmas[index].pergunta;
    }

    // Fundos especiais
    if (index === 1) {
        document.body.style.backgroundImage = "url('2.png')";
        document.body.style.backgroundSize = "95% auto";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
    } else if (index === 2 || index === 5) {
        document.body.style.backgroundImage = "none";
    } else if (index === 4) {
        document.body.style.backgroundImage = "url('5.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    }

    // Fonte para Brainfuck
    if (index === 6) {
        questionTextElem.style.fontSize = "12px";
        questionTextElem.style.lineHeight = "1.1em";
    } else {
        questionTextElem.style.fontSize = "";
        questionTextElem.style.lineHeight = "";
    }
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = enigmas[currentEnigma].resposta.toLowerCase();

    if (userAnswer === "pinto") {
        currentEnigma = enigmas.length - 1;
        showEnigma(currentEnigma);
        return;
    }

    if (userAnswer === correctAnswer) {
        currentEnigma++;
        showEnigma(currentEnigma);
        if (currentEnigma === enigmas.length) setTimeout(() => alert("UPDATE EM BREVE!"), 100);
    } else {
        if (currentEnigma === 5) alert("É o fim da linha! DESISTA AGORA!");
        const wrongSound = new Audio("wrong.mp3");
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

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswer(); });

document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAllAudio();
});
