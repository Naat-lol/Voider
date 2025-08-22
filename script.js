const startBtn = document.getElementById("startBtn");
const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const lampSound = document.getElementById("lampSound");
const staticSound = document.getElementById("staticSound");

startBtn.addEventListener("click", () => {
  // Som de lâmpada
  lampSound.play();

  // Corte seco: apagar screen1 e mostrar screen2
  screen1.classList.remove("active");
  screen2.classList.add("active");

  // Iniciar som de estática
  staticSound.play();
});
