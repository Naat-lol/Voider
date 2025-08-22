// script.js
(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);

  const screenStart = $('#screen-start');
  const screenQuestion = $('#screen-question');
  const blackout = $('#blackout');
  const btnFillFog = $('#btnFillFog');
  const noiseCanvas = $('#noiseCanvas');
  const questionText = $('#questionText');
  const answerForm = $('#answerForm');
  const answerInput = $('#answerInput');
  const feedback = $('#feedback');

  // Estado de áudio
  let audioCtx = null;
  let humNode = null;
  let humGain = null;
  let staticNode = null;
  let staticGain = null;
  let masterGain = null;

  // Configuração inicial
  function init() {
    screenStart.classList.add('active');
    screenQuestion.classList.remove('active');
    blackout.classList.remove('active');
    drawNoiseLoop();
    bindEvents();
  }

  function bindEvents() {
    btnFillFog.addEventListener('click', handleFillFog);
    answerForm.addEventListener('submit', handleSubmit);
    // Evita zoom por duplo toque no mobile
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
