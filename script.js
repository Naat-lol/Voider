// script.js
// Lógica para troca de telas, blackout instantâneo, e áudio gerado em WebAudio para simular lâmpada apagando e ruído estático.
// Arquivo propositalmente detalhado e extenso para garantir comportamento robusto.

/* -------------------------
   Elementos principais
   ------------------------- */
const screen1 = document.getElementById('screen-1');
const screen2 = document.getElementById('screen-2');
const fillBtn = document.getElementById('fill-btn');
const title = document.getElementById('the-title');
const answerForm = document.getElementById('answer-form');
const answerInput = document.getElementById('answer-input');

let audioCtx = null;
let staticNode = null;
let lampGain = null;
let isStaticPlaying = false;

/* -------------------------
   Helpers: criar contexto de áudio sob demanda
   ------------------------- */
function ensureAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

/* -------------------------
   Efeito: 'lâmpada apagando' com corte seco
   - Simula um som curto com um pitch drop e click seco.
   ------------------------- */
function playLampOff() {
  ensureAudio();

  const now = audioCtx.currentTime;

  // pequeno zumbido inicial (filament warming) - curta duração
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  lampGain = gain;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now); // base
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.12); // drop rápido
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  const noise = audioCtx.createBufferSource();
  // pequeno click - ruído branco curto e filtrado
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.02, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  noise.buffer = buffer;
  noise.loop = false;
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 800;

  // conectar
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  noise.connect(noiseFilter);
  noiseFilter.connect(audioCtx.destination);

  osc.start(now);
  noise.start(now + 0.02);

  // cortes
  osc.stop(now + 0.18);
  noise.stop(now + 0.05);
}

/* -------------------------
   Efeito: estática contínua para a segunda tela (backrooms fluorescent vibe)
   - Cria um nó de ruído branco filtrado + ligeira amplitude modulada.
   ------------------------- */
function startStaticHum() {
  if (isStaticPlaying) return;
  ensureAudio();

  const now = audioCtx.currentTime;
  // Buffer de ruído branco
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  // filtro para dar timbre de lâmpada fluorescente (bandpass)
  const bp = audioCtx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1500;
  bp.Q.value = 0.8;

  // leve tremolo para criar aquele "hum" oscilante
  const lfo = audioCtx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 2.4; // 2-3 Hz palpável
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 0.25;

  const staticGain = audioCtx.createGain();
  staticGain.gain.value = 0.06; // bem baixo, ambiente

  // conectar LFO -> ganho -> destination (modulador)
  lfo.connect(lfoGain);
  lfoGain.connect(staticGain.gain);

  whiteNoise.connect(bp);
  bp.connect(staticGain);
  staticGain.connect(audioCtx.destination);

  whiteNoise.start(now);
  lfo.start(now);

  staticNode = { whiteNoise, lfo, staticGain, bp };
  isStaticPlaying = true;
}

/* -------------------------
   Para quando precisar parar a estática
   ------------------------- */
function stopStaticHum() {
  if (!isStaticPlaying || !staticNode) return;
  try {
    staticNode.whiteNoise.stop();
    staticNode.lfo.stop();
  } catch (e) {
    // ignora
  }
  staticNode = null;
  isStaticPlaying = false;
}

/* -------------------------
   Apagão instantâneo: corte seco sem fade
   - Alterna display entre telas sem transição.
   - Toca som de lâmpada apagando e inicia estática logo em seguida.
   ------------------------- */
function blackoutAndSwitch() {
  // toca som de lampada apagando
  playLampOff();

  // corte seco: esconde tela 1, mostra tela 2 (após micro-delay para o som)
  // o pedido foi "sem fade out", então fazemos corte imediato visualmente
  screen1.classList.remove('active');
  screen1.setAttribute('aria-hidden', 'true');

  // pequena pausa de 120ms para criar a sensação do "click apagão" antes de aparecer tela 2
  setTimeout(() => {
    screen2.classList.add('active');
    screen2.setAttribute('aria-hidden', 'false');

    // começar a estática sonora imediatamente
    // um atraso minúsculo para sincronizar com o blackout
    setTimeout(() => {
      startStaticHum();
    }, 60);

    // foco no input automaticamente para que usuário já possa digitar sem dicas
    setTimeout(() => {
      answerInput.focus();
    }, 160);
  }, 100);
}

/* -------------------------
   Eventos
   ------------------------- */
fillBtn.addEventListener('click', (e) => {
  // ativar áudio do usuário (alguns navegadores exigem interação antes de criar ctx)
  ensureAudio();
  // blackout instantâneo
  blackoutAndSwitch();
});

answerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // pega resposta do usuário
  const val = answerInput.value.trim();

  // comportamento intencionalmente minimalista: não dar dicas ou feedback elaborado.
  // Para ser seguro e não mandar a resposta pra lugar nenhum, só limpamos o campo e
  // acionamos um micro-feedback sonoro curto (sem revelar nada).
  // micro-som curto para "confirmação" (não é necessário enviar a resposta).
  try {
    ensureAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (err) {
    // nada
  }

  // limpa input e mantém a estática
  answerInput.value = '';

  // pequena animação visual do botão de submit para feedback
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  setTimeout(() => { btn.disabled = false; }, 220);
});

/* -------------------------
   Para garantir comportamentos acessíveis e previsíveis:
   - Atalhos de teclado.
   - ESC para retornar à tela inicial (sem reiniciar áudio automaticamente).
   ------------------------- */
window.addEventListener('keydown', (e) => {
  // se estiver na tela 2 e apertar ESC, volta para screen 1
  if (e.key === 'Escape' || e.key === 'Esc') {
    if (screen2.classList.contains('active')) {
      // para estática sonora
      stopStaticHum();

      screen2.classList.remove('active');
      screen2.setAttribute('aria-hidden', 'true');
      screen1.classList.add('active');
      screen1.setAttribute('aria-hidden', 'false');

      // força foco no botão inicial
      setTimeout(() => { fillBtn.focus(); }, 50);
    }
  }

  // Enter no input envia (já coberto pelo form), mas Enter fora de inputs habilita o botão
  if (e.key === 'Enter') {
    const active = document.activeElement;
    if (active !== answerInput && screen1.classList.contains('active')) {
      fillBtn.click();
    }
  }
});

/* -------------------------
   Melhorias estéticas JS-driven (subtil):
   - Pequeno jitter no título para reforçar glitch.
   - Pequenos cortes aleatórios (visuais) adicionais via transform.
   ------------------------- */
let glitchInterval = null;
function startTitleJitter() {
  const el = title;
  if (!el) return;
  glitchInterval = setInterval(() => {
    el.style.transform = `translateX(${(Math.random() - 0.5) * 6}px) skewX(${(Math.random() - 0.5) * 1.2}deg)`;
    setTimeout(() => { el.style.transform = ''; }, 80 + Math.random() * 160);
  }, 700 + Math.random() * 900);
}
function stopTitleJitter() {
  if (glitchInterval) clearInterval(glitchInterval);
  glitchInterval = null;
  if (title) title.style.transform = '';
}
startTitleJitter();

/* -------------------------
   Segurança: quando a página fica em background, parar sons que não fazem sentido
   ------------------------- */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // suspende áudio se necessário
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }
  } else {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }
});

/* -------------------------
   Inicialização e pequenas proteções
   ------------------------- */
(function init() {
  // forçar tela 1 ativa ao carregar
  screen1.classList.add('active');
  screen1.setAttribute('aria-hidden', 'false');
  screen2.classList.remove('active');
  screen2.setAttribute('aria-hidden', 'true');

  // prevenir submit por Enter no botão principal por acidente
  fillBtn.addEventListener('keydown', (ev) => {
    if (ev.key === ' ' || ev.key === 'Spacebar') {
      ev.preventDefault();
      fillBtn.click();
    }
  });
})();

/* -------------------------
   Nota de implementação:
   - O áudio é gerado via WebAudio para evitar necessidade de assets externos.
   - A experiência depende de interação do usuário para permitir sons em alguns navegadores.
   - O blackout é propositalmente um corte seco, conforme pedido.
   ------------------------- */
    let lastTouch = 0;
    document.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTouch <= 300) e.preventDefault();
      lastTouch = now;
    }, { passive:false });
    window.addEventListener('resize', resizeCanvas, { passive:true });
  }

  // Blackout seco + som de lâmpada apagando
  async function handleFillFog() {
    blackoutInstant();
    await ensureAudio();
    playLampOff();
    stopStartHum();
    await wait(300);
    showQuestion();
    startStaticBed();
  }

  function blackoutInstant() {
    document.body.classList.add('black');
    blackout.classList.add('active');
    screenStart.classList.remove('active');
  }

  function showQuestion() {
    blackout.classList.remove('active'); // sai do blackout mas mantém fundo preto
    screenQuestion.classList.add('active');
    answerInput.focus({ preventScroll:true });
  }

  // Pergunta sem dicas
  function handleSubmit(e) {
    e.preventDefault();
    const value = answerInput.value.trim();
    // Sem dicas. Só valida vazio para UX.
    if (!value) {
      pulse(feedback, 'Nada dito no escuro continua sendo nada.');
      return;
    }
    // Espaço para lógica do jogo. Mantém resposta opaca.
    answerInput.value = '';
    pulse(feedback, 'O nevoeiro engoliu sua resposta.');
  }

  // Canvas de ruído (tela de TV PB escura)
  let rafId = null;
  let ctx = null;
  function resizeCanvas() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = noiseCanvas.clientWidth || window.innerWidth;
    const h = noiseCanvas.clientHeight || window.innerHeight;
    noiseCanvas.width = Math.floor(w * dpr);
    noiseCanvas.height = Math.floor(h * dpr);
    ctx = noiseCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
  }

  function drawNoiseFrame() {
    if (!ctx) return;
    const { width:w, height:h } = noiseCanvas;
    const id = ctx.createImageData(w, h);
    const data = id.data;
    // Ruído mais escuro, PB
    for (let i = 0; i < data.length; i += 4) {
      // faixa horizontal leve para simular linhas
      const row = Math.floor((i / 4) / w);
      const lineBias = (row % 2) ? -8 : 0;
      let v = (Math.random() * 255) | 0;
      v = Math.max(0, Math.min(255, v * 0.45 + 20 + lineBias));
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(id, 0, 0);
    // leve deslocamento vertical para jitter
    if (Math.random() < 0.03) {
      const y = (Math.random() * 6) | 0;
      const slice = ctx.getImageData(0, y, w, h - y);
      ctx.putImageData(slice, 0, 0);
    }
  }

  function loop() {
    drawNoiseFrame();
    rafId = requestAnimationFrame(loop);
  }

  function drawNoiseLoop() {
    try {
      resizeCanvas();
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    } catch {
      document.documentElement.classList.add('no-canvas');
    }
  }

  // Áudio: criar contexto e nós
  async function ensureAudio() {
    if (audioCtx) return audioCtx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx({ latencyHint: 'interactive', sampleRate: 44100 });
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.9;
    masterGain.connect(audioCtx.destination);
    // Prepara gains
    humGain = audioCtx.createGain();
    humGain.gain.value = 0.0;
    humGain.connect(masterGain);

    staticGain = audioCtx.createGain();
    staticGain.gain.value = 0.0;
    staticGain.connect(masterGain);
    // inicia hum silencioso para desbloquear no iOS
    initHum();
    await audioCtx.resume();
    return audioCtx;
  }

  // Som: hum de lâmpada fluorescente (ruído filtrado + oscilador sutil)
  function initHum() {
    if (humNode) return;
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    // Pink-ish noise
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      output[i] = pink * 0.1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const humFilter = audioCtx.createBiquadFilter();
    humFilter.type = 'bandpass';
    humFilter.frequency.value = 100; // 50/60Hz band
    humFilter.Q.value = 1.2;

    const harmonics = audioCtx.createOscillator();
    harmonics.type = 'sawtooth';
    harmonics.frequency.value = 120; // leve harmônico
    const harmonicsGain = audioCtx.createGain();
    harmonicsGain.gain.value = 0.006;

    noise.connect(humFilter);
    humFilter.connect(humGain);
    harmonics.connect(harmonicsGain).connect(humGain);

    noise.start();
    harmonics.start();

    humNode = noise; // guarda referência para controle
  }

  function stopStartHum() {
    if (!audioCtx) return;
    // Fade out rápido do hum
    const now = audioCtx.currentTime;
    humGain.gain.cancelScheduledValues(now);
    humGain.gain.setTargetAtTime(0.0, now, 0.05);
  }

  function startHumBed() {
    if (!audioCtx) return;
    initHum();
    const now = audioCtx.currentTime;
    humGain.gain.cancelScheduledValues(now);
    humGain.gain.setTargetAtTime(0.14, now, 0.6);
  }

  // Som: estática contínua para segunda tela
  function startStaticBed() {
    if (!audioCtx) return;
    if (!staticNode) {
      const bufferSize = 2 * audioCtx.sampleRate;
      const buf = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.35; // mais agressivo
      }
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const hp = audioCtx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 600;

      const lp = audioCtx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 6000;

      src.connect(hp).connect(lp).connect(staticGain);
      src.start();
      staticNode = src;
    }
    const now = audioCtx.currentTime;
    staticGain.gain.cancelScheduledValues(now);
    staticGain.gain.setTargetAtTime(0.18, now, 0.3);

    // hum de fundo bem baixo para sensação de neon
    startHumBed();
  }

  // Som: "lâmpada apagando" (click + sub queda rápida)
  function playLampOff() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    // Clique curto
    const clickOsc = audioCtx.createOscillator();
    clickOsc.type = 'square';
    clickOsc.frequency.value = 800;
    const clickGain = audioCtx.createGain();
    clickGain.gain.value = 0.0;
    clickOsc.connect(clickGain).connect(masterGain);
    clickOsc.start(now);
    clickGain.gain.setValueAtTime(0.2, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    clickOsc.stop(now + 0.06);

    // Estalo grave com decaimento
    const thump = audioCtx.createOscillator();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(160, now);
    thump.frequency.exponentialRampToValueAtTime(40, now + 0.18);
    const thumpGain = audioCtx.createGain();
    thumpGain.gain.setValueAtTime(0.3, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    thump.connect(thumpGain).connect(masterGain);
    thump.start(now);
    thump.stop(now + 0.2);
  }

  // Utilidades
  function wait(ms){ return new Promise(res => setTimeout(res, ms)); }

  function pulse(el, text){
    el.textContent = text;
    el.style.transition = 'none';
    el.style.opacity = '0.2';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity .18s ease';
      el.style.opacity = '1';
    });
  }

  // Bloqueio de rolagem
  document.addEventListener('touchmove', e => {
    if (e.target.closest('.answer-input')) return;
    e.preventDefault();
  }, { passive:false });

  // Início
  init();

  // Opcional: mudar pergunta programaticamente aqui se quiser
  // questionText.textContent = 'Sua pergunta aqui...';

  // Focus fix para Android
  window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 250);
  });

  // Segurança: parar áudio ao sair
  document.addEventListener('visibilitychange', () => {
    if (!audioCtx) return;
    if (document.hidden) {
      const now = audioCtx.currentTime;
      [humGain, staticGain].forEach(g => {
        if (!g) return;
        g.gain.cancelScheduledValues(now);
        g.gain.setTargetAtTime(0.0, now, 0.1);
      });
    } else if (screenQuestion.classList.contains('active')) {
      startStaticBed();
    }
  });

  // Reduz harshness em volumes altos
  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
      if (!masterGain) return;
      masterGain.gain.value = Math.max(0, masterGain.gain.value - 0.1);
      pulse(feedback, 'volume down');
    }
  });
})();
