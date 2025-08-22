const canvas = document.getElementById('noise');
const ctx = canvas.getContext('2d');
let w, h;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

function noise() {
  const imageData = ctx.createImageData(w, h);
  const buffer32 = new Uint32Array(imageData.data.buffer);
  const len = buffer32.length;
  for (let i = 0; i < len; i++) {
    buffer32[i] = ((Math.random() * 255) | 0) << 24;
  }
  ctx.putImageData(imageData, 0, 0);
}
setInterval(noise, 30);

const startButton = document.getElementById('startButton');
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const lampSound = document.getElementById('lampSound');
const staticSound = document.getElementById('staticSound');

startButton.addEventListener('click', () => {
  lampSound.play();
  screen1.style.display = 'none';
  screen2.style.display = 'flex';
  staticSound.play();
});
