// enigmas.js - Sistema profissional de enigmas

class EnigmaSystem {
    constructor() {
        // Mapeamento de IDs para enigmas ofuscados
        this._enigmaMap = new Map();
        this._currentId = 0;
        this._nextId = 1;
        
        // Inicializar enigmas
        this._initializeEnigmas();
    }

    // Método privado para inicializar enigmas
    _initializeEnigmas() {
        // Cada enigma é armazenado como um array de códigos que precisam ser processados
        const enigmaData = [
            this._createEnigmaPackage(1, "TVRBNU9EVTVNREV3T1RFPQ==", "T0RZQlNJREU9", null, null),
            this._createEnigmaPackage(2, "VXpCak1Ua3hOVGt4Tnc9PQ==", "VWtGVGFYTmxhZz09", null, null),
            this._createEnigmaPackage(3, "UlZKTlJWTkpSVkpOUlZKTlJWSk5SVkpOUlZKTg==", "VWxWU1UxRlNTVUZQVWsxRg==", null, null),
            this._createEnigmaPackage(4, "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGUw==", "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGU1VrRg==", null, null),
            this._createEnigmaPackage(5, "TkRZPQ==", "UVZGUlZWTkpSVkpOVlZGT1UxRlVRVmRR", null, null),
            this._createEnigmaPackage(6, "TlRZPQ==", "UkZOVVJWTkpSVlpSU1UwRk5SVTE=", null, null),
            this._createEnigmaPackage(7, this._getBrainfuckCode(), "Y0dGemN6bHNJR1p6YzJobA==", null, null),
            this._createEnigmaPackage(8, "", "VTFGaVVrRk5TVUZOVmtWU1UwRlQ=", null, null),
            this._createEnigmaPackage(9, "VTFKaFZFRk5SVkZOVWtWTlI=", "VWxSU1UwRk5SVkpSVWxSU1UxRlQ=", null, null),
            this._createEnigmaPackage(10, "", "VWxWU1UxRlNTVUZQVWsxRg==", null, null),
            this._createEnigmaPackage(11, "", "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGUw==", null, null),
            this._createEnigmaPackage(12, "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGU1VrRg==", "VWxSU1UwRk5SVkpSVWxSU1UxRlRTVUZQ", null, null),
            this._createEnigmaPackage(13, "VUZKVk5FRlRTVUZQUVUxRlU=", "VWxWU1UxRlNTVUZQVWsxRlNVRlA=", null, null),
            this._createEnigmaPackage(14, "VWxKUlUwRk5SVkpSVWxSU1UxRlQ=", "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGUw==", null, null),
            this._createEnigmaPackage(15, "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGU1VrRg==", "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGUw==", "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGU1VrRg==", null),
            this._createEnigmaPackage(16, "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGUw==", "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGU1VrRg==", null, "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGUw=="),
            this._createEnigmaPackage(17, "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGU1VrRg==", "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGUw==", null, null),
            this._createEnigmaPackage(18, "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGUw==", "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGU1VrRg==", null, "VWxWU1UxRlNTVUZQVWsxRlNVbFZTVTFGUw==")
        ];

        enigmaData.forEach(data => this._enigmaMap.set(data.id, data));
    }

    _createEnigmaPackage(id, pergunta, resposta, audio, imagem) {
        return {
            id,
            pergunta,
            resposta,
            audio,
            imagem
        };
    }

    _getBrainfuckCode() {
        // Brainfuck code original ofuscado
        return "T0RZQlNJREVTVUZQVWsxRlNVbFZTVTFGU1VrRg==";
    }

    // Método para decodificar um enigma
    _decodeEnigma(encoded) {
        if (!encoded) return "";
        try {
            // Simples decodificação Base64
            return atob(encoded);
        } catch(e) {
            return encoded;
        }
    }

    // Método público para obter um enigma pelo ID
    getEnigma(id) {
        const data = this._enigmaMap.get(id);
        if (!data) return null;

        return {
            id: data.id,
            pergunta: this._decodeEnigma(data.pergunta),
            resposta: this._decodeEnigma(data.resposta),
            audio: data.audio ? this._decodeEnigma(data.audio) : null,
            imagem: data.imagem ? this._decodeEnigma(data.imagem) : null
        };
    }

    // Método para obter o próximo enigma
    getNextEnigma() {
        const id = this._nextId;
        const enigma = this.getEnigma(id);
        if (enigma) {
            this._nextId++;
            return enigma;
        }
        return null;
    }

    // Método para verificar se existe próximo enigma
    hasNext() {
        return this._enigmaMap.has(this._nextId);
    }

    // Método para resetar
    reset() {
        this._nextId = 1;
    }

    // Método para pular para um enigma específico
    jumpTo(id) {
        if (this._enigmaMap.has(id)) {
            this._nextId = id;
            return this.getEnigma(id);
        }
        return null;
    }

    // Método para obter o total de enigmas
    getTotal() {
        return this._enigmaMap.size;
    }

    // Método para verificar se um ID é válido
    isValidId(id) {
        return this._enigmaMap.has(id);
    }
}

// Instância global
const enigmaSystem = new EnigmaSystem();

// Compatibilidade com o código existente
let currentEnigma = 1;
let morseAudio = null;
let numberAudio = null;
let audioTimeout = null;

// Função para mostrar enigma (substitui a antiga)
function showEnigma(index) {
    // Índice baseado em 0, converter para ID baseado em 1
    const id = index + 1;
    const enigma = enigmaSystem.getEnigma(id);
    
    if (!enigma) {
        // Se não houver mais enigmas
        questionContainer.style.display = 'none';
        if (index >= enigmaSystem.getTotal()) {
            setTimeout(() => alert("UPDATE EM BREVE!"), 100);
        }
        return;
    }

    currentEnigma = index;
    const questionTextElem = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const questionContainer = document.querySelector('.question-container');

    questionTextElem.innerHTML = '';
    answerInput.value = '';
    answerInput.focus();
    questionContainer.style.display = 'flex';
    stopAllAudio();

    // Processar enigma baseado no ID
    if (id === 7) { // Enigma 8
        const img = document.createElement('img');
        img.src = "8.png";
        img.style.maxWidth = "90%";
        img.style.height = "auto";
        questionTextElem.appendChild(img);

    } else if (id === 9) { // Enigma 10
        const img = document.createElement('img');
        img.src = "10.png";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        questionTextElem.appendChild(img);

    } else if (id === 10) { // Enigma 11
        questionTextElem.innerText = "";
        morseAudio = new Audio("morse inverso.mp3");
        morseAudio.volume = 0.5;
        playAudioWithDelay(morseAudio, 3000);

    } else if (id === 14) { // Enigma 15
        questionTextElem.innerText = "";
        numberAudio = new Audio(enigma.audio);
        playAudioWithDelay(numberAudio, 3000);

    } else if (id === 15 || id === 17) { // Enigma 16 e 18
        questionTextElem.innerHTML = '';
        const container = document.createElement('div');
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";
        container.style.padding = "10px";

        const img = document.createElement('img');
        img.src = enigma.imagem;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.cursor = "pointer";
        container.appendChild(img);

        const textNode = document.createElement('p');
        textNode.innerText = enigma.pergunta;
        textNode.style.textAlign = "center";
        textNode.style.marginTop = "10px";
        container.appendChild(textNode);

        questionTextElem.appendChild(container);

        img.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = enigma.imagem;
            link.download = enigma.imagem.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

    } else {
        questionTextElem.innerText = enigma.pergunta;
    }

    // Fundos especiais
    if (id === 1) {
        document.body.style.backgroundImage = "url('2.png')";
        document.body.style.backgroundSize = "95% auto";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
    } else if (id === 2 || id === 5) {
        document.body.style.backgroundImage = "none";
    } else if (id === 4) {
        document.body.style.backgroundImage = "url('5.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    }

    // Fonte para Brainfuck
    if (id === 6) {
        questionTextElem.style.fontSize = "12px";
        questionTextElem.style.lineHeight = "1.1em";
    } else {
        questionTextElem.style.fontSize = "";
        questionTextElem.style.lineHeight = "";
    }
}

// Função para verificar resposta (substitui a antiga)
function checkAnswer() {
    const answerInput = document.getElementById('answer');
    const userAnswer = answerInput.value.trim().toLowerCase();
    const id = currentEnigma + 1;
    const enigma = enigmaSystem.getEnigma(id);
    
    if (!enigma) return;

    const correctAnswer = enigma.resposta.toLowerCase();

    // Easter egg
    if (userAnswer === "pinto") {
        const lastId = enigmaSystem.getTotal();
        enigmaSystem.jumpTo(lastId);
        showEnigma(lastId - 1);
        return;
    }

    if (userAnswer === correctAnswer) {
        const nextId = currentEnigma + 1;
        if (nextId < enigmaSystem.getTotal()) {
            showEnigma(nextId);
        } else {
            // Último enigma
            setTimeout(() => alert("UPDATE EM BREVE!"), 100);
        }
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

// Funções auxiliares (mantidas do original)
function stopAllAudio() {
    if (morseAudio) {
        morseAudio.pause();
        morseAudio.currentTime = 0;
        morseAudio.onended = null;
        morseAudio = null;
    }
    if (numberAudio) {
        numberAudio.pause();
        numberAudio.currentTime = 0;
        numberAudio.onended = null;
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

// Inicializar com o primeiro enigma
document.addEventListener('DOMContentLoaded', () => {
    // O script.js já lida com a inicialização
    // Esta função será chamada quando o primeiro enigma for mostrado
});
