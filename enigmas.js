// enigmas.js - Banco de dados ofuscado

// ============================================================
// BANCO DE DADOS OFUSCADO
// ============================================================
// Cada entrada é uma string codificada no formato:
// PERGUNTA|||RESPOSTA
// 
// OBS: Para enigmas com áudio ou imagem, os dados extras
// são armazenados separadamente no objeto "extras"
// ============================================================

const banco = [
    // Enigma 1
    "QSBzZW5oYSDDqSBTRU5IQXx8fGFfc2VuaGEgw6kgU0VOSEE=",
    
    // Enigma 2
    "Tm8gZXNjdXJvLi4ufHx8TyBjb21lw6dv",
    
    // Enigma 3
    "RSAgIFIgIE0gWCBJID8gTCBFIFQgRSBBIE58fHxSRUFMRU1FTlRFIEVYSVNURT8=",
    
    // Enigma 4
    "w4kgTMOTWETDl8OEUiBSIFUgVUhBQUxJREFEQ0g/fHx8w4kgSUxVU8ODTyBPVSBST0FMSURBREU/",
    
    // Enigma 5
    "MSAwfHx8QU1BUiDDqSBERUlYQVIgSVI=",
    
    // Enigma 6
    "fHx8REVTSVNUQSBBR09SQQ==",
    
    // Enigma 7 - Brainfuck (mantido igual)
    "CisrKysrKysrK1srPisrPisrKys+PisrKysrKysrPisrKysrKysrKys8PDw8LV0KPj4+PisrKysrKysrKysrKysuCi0tLS0tLS0tLS0uKysrKysrKysrKysuCi0tLS0uKysrKy48PCsrLgo+Pi0uLS0tLS0tLS0tLS4rKysrKysrKysrKy4KLS0tLS4rKysrLjw8KysrKysrKysrKysuCi0tLS0tLS0tLS0tLS0uPj4tLS0tLS0tLS0tLS4rKysrKysrKysrKysuLgotLS0tLjw8Lj4+LS0tLS0tLS0tLS0uPDwuPj4tLS0uKysrKysrKysrKysrKysrKysuCi0tLS0tLS0tLS0uKysrKysrKy4tLS0tLS0tLS0tLS4tLS4rKysrLisrKysuKysrKysrKysuCi0tLS0tLS0tLS0tLS0tLS08PC4+PisrKysuKy48PD4+LS0uKysrKysrKysrKysrKysrLgotLS0tLS0tLS0uLS0tLS0tLS0uKysrKysrKysrKysrKysuLS0tLS0tLS0tLS0tLS0tLS0uLS0u",
    
    // Enigma 8 - Imagem
    "fHx8TmFhdCBlc3RldmUgYXF1aQ==",
    
    // Enigma 9 - Línguas estranhas
    "w7JkaSBiYW5kaW5nYSBmcmplbWR8fHxvZGVpbyBsaW5ndWFzIGVzdHJhbmdlaXJhcw==",
    
    // Enigma 10 - Imagem
    "fHx8bWV1cyBvbGhvcw==",
    
    // Enigma 11 - Áudio
    "fHx8ZXUgbmFvIGNvbnNpZ28gbWFp",
    
    // Enigma 12 - Tap Code
    "Li4uIC4gIC4uLiAuLi4uICAuLi4uIC4uLi4uICAuIC4uLiAgLi4uLiAuLi4uLiAgLi4uLiAuLiAgLiAuICAuLi4uIC4uLiAgLyAuIC4uICAuIC4gIC4uLi4gLi4uLiAgLi4uIC4uICAuIC4gIC4uLiAuLi4gIHx8fGxvdWN1cmFzIGJhdG1hbg==",
    
    // Enigma 13 - Cidades
    "QkgsIE1HCgpQUiwgUFIKR08gPSAzLDE0MTU5MjZ8fHxnb2nDom5pYSwgZ295w6Fz",
    
    // Enigma 14 - Texto
    "cGllcm8gZGkgY29zaW1hIGVtIGNoYW1hc3x8fHRoZSBmb3Jlc3QgZmlyZQ==",
    
    // Enigma 15 - Áudio com números
    "ZXNjdXRlIGUgdHJhbnNjcmV2YXx8fDExMzI3MTczNjUxMjc3OA==",
    
    // Enigma 16 - Imagem Caixa
    "RGVudHJvIGRhIGNhaXhhfHx8c2NocnPDtmRpbmc=",
    
    // Enigma 17 - Base64 + ASCII
    "OTkgODggODYgMTA4IDg5IDExMCA3NCA5OSA3MSA3OCA5NSA3MyA4NyA3MSA2MSA2MXx8fHF1ZWJyYSBjYWLDp2E=",
    
    // Enigma 18 - Imagem House
    "Q3JpYcOnw6NvfHx8bWljcm9zb2Z0"
];

// ============================================================
// DADOS EXTRAS (Áudio, Imagem, etc.)
// ============================================================
// Mapeamento de índices (0-based) para dados extras
// ============================================================

const extras = {
    7: { imagem: "8.png" },          // Enigma 8
    9: { imagem: "10.png" },         // Enigma 10
    10: { audio: "morse inverso.mp3" }, // Enigma 11
    14: { audio: "113 271 736 512 778.mp3" }, // Enigma 15
    15: { imagem: "Caixa.png" },     // Enigma 16
    17: { imagem: "House.png" }      // Enigma 18
};

// ============================================================
// LEITOR DE ENIGMAS
// ============================================================

function obterEnigma(index) {
    if (index >= banco.length) return null;
    
    try {
        // Decodificar Base64
        const decoded = atob(banco[index]);
        
        // Separar pergunta e resposta usando "|||" como delimitador
        const parts = decoded.split("|||");
        
        return {
            pergunta: parts[0] || "",
            resposta: parts[1] || "",
            ...(extras[index] || {})
        };
    } catch (e) {
        console.error("Erro ao decodificar enigma:", e);
        return null;
    }
}

// ============================================================
// COMPATIBILIDADE COM O SCRIPT EXISTENTE
// ============================================================

// Substituir o array antigo
const enigmas = [];
const totalEnigmas = banco.length;

// Pré-carregar todos os enigmas para compatibilidade
for (let i = 0; i < totalEnigmas; i++) {
    const enigma = obterEnigma(i);
    if (enigma) {
        enigmas.push(enigma);
    }
}

// Variáveis globais (mantidas para compatibilidade)
let currentEnigma = 0;
let morseAudio = null;
let numberAudio = null;
let audioTimeout = null;

// ============================================================
// FUNÇÕES AUXILIARES (mantidas do original)
// ============================================================

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

// ============================================================
// FUNÇÃO PRINCIPAL showEnigma (substitui a original)
// ============================================================

function showEnigma(index) {
    if (index >= enigmas.length) {
        questionContainer.style.display = 'none';
        setTimeout(() => alert("UPDATE EM BREVE!"), 100);
        return;
    }
    
    currentEnigma = index;
    const enigma = enigmas[index];
    const questionTextElem = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const questionContainer = document.querySelector('.question-container');

    questionTextElem.innerHTML = '';
    answerInput.value = '';
    answerInput.focus();
    questionContainer.style.display = 'flex';
    stopAllAudio();

    // Processar enigmas especiais baseado no índice
    if (index === 7) { // Enigma 8 - Imagem
        const img = document.createElement('img');
        img.src = enigma.imagem;
        img.style.maxWidth = "90%";
        img.style.height = "auto";
        questionTextElem.appendChild(img);

    } else if (index === 9) { // Enigma 10 - Imagem
        const img = document.createElement('img');
        img.src = enigma.imagem;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        questionTextElem.appendChild(img);

    } else if (index === 10) { // Enigma 11 - Áudio morse
        questionTextElem.innerText = "";
        morseAudio = new Audio(enigma.audio);
        morseAudio.volume = 0.5;
        playAudioWithDelay(morseAudio, 3000);

    } else if (index === 14) { // Enigma 15 - Áudio números
        questionTextElem.innerText = "";
        numberAudio = new Audio(enigma.audio);
        playAudioWithDelay(numberAudio, 3000);

    } else if (index === 15 || index === 17) { // Enigma 16 e 18 - Imagens com download
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
    if (index === 0) {
        document.body.style.backgroundImage = "url('2.png')";
        document.body.style.backgroundSize = "95% auto";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
    } else if (index === 1 || index === 4) {
        document.body.style.backgroundImage = "none";
    } else if (index === 3) {
        document.body.style.backgroundImage = "url('5.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    }

    // Fonte para Brainfuck (índice 6)
    if (index === 6) {
        questionTextElem.style.fontSize = "12px";
        questionTextElem.style.lineHeight = "1.1em";
    } else {
        questionTextElem.style.fontSize = "";
        questionTextElem.style.lineHeight = "";
    }
}

// ============================================================
// FUNÇÃO checkAnswer (substitui a original)
// ============================================================

function checkAnswer() {
    const answerInput = document.getElementById('answer');
    const userAnswer = answerInput.value.trim().toLowerCase();
    const enigma = enigmas[currentEnigma];
    
    if (!enigma) return;

    const correctAnswer = enigma.resposta.toLowerCase();

    // Easter egg
    if (userAnswer === "pinto") {
        const lastIndex = enigmas.length - 1;
        currentEnigma = lastIndex;
        showEnigma(lastIndex);
        return;
    }

    if (userAnswer === correctAnswer) {
        const nextIndex = currentEnigma + 1;
        if (nextIndex < enigmas.length) {
            showEnigma(nextIndex);
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

// ============================================================
// EVENT LISTENERS (mantidos do original)
// ============================================================

// Os event listeners já estão no script.js
// Esta é apenas uma referência para manter compatibilidade

// O script.js espera que estas variáveis estejam disponíveis:
// - enigmas (array)
// - currentEnigma (number)
// - showEnigma (function)
// - checkAnswer (function)
// - stopAllAudio (function)
// - playAudioWithDelay (function)

console.log(`✅ Sistema de enigmas carregado: ${enigmas.length} enigmas disponíveis`););

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
