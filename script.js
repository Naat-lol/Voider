// ====== TV NOISE (canvas) ======
const noiseCanvas = document.getElementById('noise');
const nCtx = noiseCanvas.getContext('2d', { willReadFrequently: true });

let running = true;
function resizeNoise() {
  noiseCanvas.width = Math.floor(window.innerWidth);
  noiseCanvas.height = Math.floor(window.innerHeight);
}
resizeNoise();
window.addEventListener('resize', resizeNoise);

function drawNoiseFrame() {
  if (!running) return;
  const w = noiseCanvas.width;
  const h = noiseCanvas.height;
  const imgData = nCtx.createImageData(w, h);
  const d = imgData.data;

  // ruído escuro predominante (P&B)
  for (let i = 0; i < d.length; i += 4) {
    // faixa escura: 0-60
    const v = (Math.random() * 60) | 0;
    d[i] = v;     // R
    d[i+1] = v;   // G
    d[i+2] = v;   // B
    d[i+3] = 255; // A
  }
  nCtx.putImageData(imgData, 0, 0);
  // variação de "rolagem" vertical leve estilo CRT
  nCtx.globalCompositeOperation = 'lighter';
  nCtx.fillStyle = 'rgba(255,255,255,0.02)';
  const bandY = (Date.now() / 13) % h;
  nCtx.fillRect(0, bandY, w, 2);
  nCtx.globalCompositeOperation = 'source-over';

  requestAnimationFrame(drawNoiseFrame);
}
requestAnimationFrame(drawNoiseFrame);

// ====== ÁUDIO (Web Audio API) ======
let ac;
let humNode;
let humGain;
let lampBurstGain;

function ensureAudio() {
  if (ac) return;
  ac = new (window.AudioContext || window.webkitAudioContext)();

  // Nó de ganho mestre para hum
  humGain = ac.createGain();
  humGain.gain.value = 0.18; // volume baixo para não estourar ouvido
  humGain.connect(ac.destination);
}

function playLampOffBurst() {
  if (!ac) return;
  const duration = 0.18;
  const bufferSize = ac.sampleRate * duration;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);

  // Estalo + queda rápida (como lâmpada apagando)
  for (let i = 0; i < bufferSize; i++) {
    // ruído branco com decaimento exponencial
    const t = i / ac.sampleRate;
    const decay = Math.pow(0.0001, t / duration);
    data[i] = (Math.random() * 2 - 1) * decay;
    // micro-click inicial
    if (i < 12) data[i] += (Math.random() * 2 - 1) * 0.65;
  }

  const src = ac.createBufferSource();
  src.buffer = buffer;

  lampBurstGain = ac.createGain();
  lampBurstGain.gain.value = 0.9;

  src.connect(lampBurstGain);
  lampBurstGain.connect(ac.destination);
  src.start();

  // clean
  src.onended = () => {
    if (lampBurstGain) {
      lampBurstGain.disconnect();
      lampBurstGain = null;
    }
  };
}

function startFluorescentHum() {
  if (!ac) return;
  // cria ruído branco contínuo
  const bufferSize = 2 * ac.sampleRate;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseSrc = ac.createBufferSource();
  noiseSrc.buffer = buffer;
  noiseSrc.loop = true;

  // modelar em "hum" usando filtros
  const bp = ac.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 180;      // grave, vibe backrooms
  bp.Q.value = 0.8;

  const hp = ac.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 60;       // tira o subgrave chato

  const comp = ac.createDynamicsCompressor(); // dá uma colada
  comp.threshold.value = -26;
  comp.knee.value = 20;
  comp.ratio.value = 3;
  comp.attack.value = 0.003;
  comp.release.value = 0.25;

  noiseSrc.connect(bp);
  bp.connect(hp);
  hp.connect(comp);
  comp.connect(humGain);

  noiseSrc.start();
  humNode = noiseSrc;
}

function stopHum() {
  try {
    if (humNode) humNode.stop();
  } catch {}
  humNode = null;
}

// ====== TROCA DE TELAS ======
const btn = document.getElementById('fillBtn');
const screenStart = document.getElementById('screen-start');
const screenQuestion = document.getElementById('screen-question');
const answerForm = document.getElementById('answerForm');
const answerInput = document.getElementById('answerInput');

btn.addEventListener('click', async () => {
  ensureAudio();

  // APAGÃO SECO: corta a tela sem fade
  document.body.classList.add('blackout');

  // toca o som de lâmpada apagando
  playLampOffBurst();

  // interrompe animação de ruído e esconde canvas
  running = false;

  // mostra tela preta com pergunta
  screenQuestion.setAttribute('aria-hidden', 'false');

  // inicia o hum/estática contínuo
  startFluorescentHum();

  // foco no input quando possível
  setTimeout(() => {
    answerInput.focus({ preventScroll: true });
  }, 10);
});

// Do nada não vamos “resolver” nada aqui. Só previne reload
answerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Se quiser fazer algo com a resposta, edita aqui:
  const valor = answerInput.value.trim();
  console.log('Resposta:', valor);
  answerInput.value = 'tiririca';
});
