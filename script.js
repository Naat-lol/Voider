const startBtn = document.getElementById("startBtn");
const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const lampSound = document.getElementById("lampSound");
const staticSound = document.getElementById("staticSound");

startBtn.addEventListener("click", () => {
  // Som da lâmpada
  lampSound.currentTime = 0;
  lampSound.play();

  // Corte seco para a segunda tela
  screen1.classList.remove("active");
  screen2.classList.add("active");

  // Inicia som de estática
  staticSound.currentTime = 0;
  staticSound.play();
});
