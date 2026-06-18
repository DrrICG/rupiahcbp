const denominations = [
  {
    value: 1000,
    label: "Rp1.000",
    text: "SERIBU RUPIAH",
    colors: ["#3caa63", "#0a4ea3", "#ffffff"],
    ink: "#ffffff",
    serial: "CBP001KID"
  },
  {
    value: 2000,
    label: "Rp2.000",
    text: "DUA RIBU RUPIAH",
    colors: ["#9b4fd7", "#0a4ea3", "#ffffff"],
    ink: "#ffffff",
    serial: "CBP002KID"
  },
  {
    value: 5000,
    label: "Rp5.000",
    text: "LIMA RIBU RUPIAH",
    colors: ["#b98724", "#6b3f15", "#ffffff"],
    ink: "#ffffff",
    serial: "CBP005KID"
  },
  {
    value: 10000,
    label: "Rp10.000",
    text: "SEPULUH RIBU RUPIAH",
    colors: ["#8a56d8", "#d54b78", "#ffffff"],
    ink: "#ffffff",
    serial: "CBP010KID"
  },
  {
    value: 20000,
    label: "Rp20.000",
    text: "DUA PULUH RIBU RUPIAH",
    colors: ["#23a9a6", "#0a4ea3", "#ffffff"],
    ink: "#ffffff",
    serial: "CBP020KID"
  },
  {
    value: 50000,
    label: "Rp50.000",
    text: "LIMA PULUH RIBU RUPIAH",
    colors: ["#1b6dd8", "#06265d", "#ffffff"],
    ink: "#ffffff",
    serial: "CBP050KID"
  },
  {
    value: 75000,
    label: "Rp75.000",
    text: "TUJUH PULUH LIMA RIBU RUPIAH",
    colors: ["#e32228", "#ffffff", "#0a4ea3"],
    ink: "#ffffff",
    serial: "CBP075KID"
  },
  {
    value: 100000,
    label: "Rp100.000",
    text: "SERATUS RIBU RUPIAH",
    colors: ["#e32228", "#a70f19", "#ffffff"],
    ink: "#ffffff",
    serial: "CBP100KID"
  }
];

const root = document.documentElement;
const denomGrid = document.getElementById("denomGrid");
const noteObject = document.getElementById("noteObject");
const stage = document.getElementById("stage");

const currentTitle = document.getElementById("currentTitle");
const frontNominal = document.getElementById("frontNominal");
const frontText = document.getElementById("frontText");
const backNominal = document.getElementById("backNominal");
const backText = document.getElementById("backText");
const serialFront = document.getElementById("serialFront");
const serialBack = document.getElementById("serialBack");

const autoRotateBtn = document.getElementById("autoRotateBtn");
const resetBtn = document.getElementById("resetBtn");

let activeIndex = denominations.length - 1;
let rotateX = -8;
let rotateY = 20;
let autoRotate = true;
let isDragging = false;
let lastX = 0;
let lastY = 0;
let velocityY = 0;

function formatNominal(value){
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function buildButtons(){
  denomGrid.innerHTML = "";
  denominations.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.className = "denom-btn";
    btn.type = "button";
    btn.dataset.index = index;
    btn.innerHTML = `<span>${item.label}</span><small>${item.text}</small>`;
    btn.addEventListener("click", () => setDenomination(index));
    denomGrid.appendChild(btn);
  });
}

function setDenomination(index){
  activeIndex = index;
  const item = denominations[index];

  root.style.setProperty("--note-a", item.colors[0]);
  root.style.setProperty("--note-b", item.colors[1]);
  root.style.setProperty("--note-c", item.colors[2]);
  root.style.setProperty("--note-ink", item.ink);

  currentTitle.textContent = item.label;
  frontNominal.textContent = formatNominal(item.value);
  frontText.textContent = item.text;
  backNominal.textContent = item.label;
  backText.textContent = item.value === 75000
    ? "Edisi khusus specimen edukasi untuk mengenang perjalanan Indonesia."
    : "Kenali, rawat, dan gunakan Rupiah dengan bijak.";
  serialFront.textContent = `${item.serial}-${String(item.value).padStart(6, "0")}`;
  serialBack.textContent = `ID-${item.serial}-${new Date().getFullYear()}`;

  document.querySelectorAll(".denom-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
}

function applyRotation(){
  noteObject.style.setProperty("--rx", `${rotateX}deg`);
  noteObject.style.setProperty("--ry", `${rotateY}deg`);
}

function pointerDown(x, y){
  isDragging = true;
  autoRotate = false;
  autoRotateBtn.setAttribute("aria-pressed", "false");
  autoRotateBtn.textContent = "Auto Rotate: OFF";
  lastX = x;
  lastY = y;
}

function pointerMove(x, y){
  if(!isDragging) return;
  const dx = x - lastX;
  const dy = y - lastY;

  rotateY += dx * 0.45;
  rotateX -= dy * 0.25;
  rotateX = Math.max(-65, Math.min(65, rotateX));
  velocityY = dx * 0.08;

  lastX = x;
  lastY = y;
  applyRotation();
}

function pointerUp(){
  isDragging = false;
}

stage.addEventListener("mousedown", (e) => pointerDown(e.clientX, e.clientY));
window.addEventListener("mousemove", (e) => pointerMove(e.clientX, e.clientY));
window.addEventListener("mouseup", pointerUp);

stage.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  pointerDown(t.clientX, t.clientY);
}, {passive:true});

stage.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  pointerMove(t.clientX, t.clientY);
}, {passive:true});

window.addEventListener("touchend", pointerUp);

noteObject.addEventListener("keydown", (e) => {
  const step = e.shiftKey ? 15 : 5;
  if(e.key === "ArrowLeft") rotateY -= step;
  if(e.key === "ArrowRight") rotateY += step;
  if(e.key === "ArrowUp") rotateX -= step;
  if(e.key === "ArrowDown") rotateX += step;
  rotateX = Math.max(-65, Math.min(65, rotateX));
  applyRotation();
});

autoRotateBtn.addEventListener("click", () => {
  autoRotate = !autoRotate;
  autoRotateBtn.setAttribute("aria-pressed", String(autoRotate));
  autoRotateBtn.textContent = autoRotate ? "Auto Rotate: ON" : "Auto Rotate: OFF";
});

resetBtn.addEventListener("click", () => {
  rotateX = -8;
  rotateY = 20;
  velocityY = 0;
  applyRotation();
});

function animate(){
  if(autoRotate){
    rotateY += 0.22;
  } else if(!isDragging && Math.abs(velocityY) > 0.01){
    rotateY += velocityY;
    velocityY *= 0.94;
  }
  applyRotation();
  requestAnimationFrame(animate);
}

buildButtons();
setDenomination(activeIndex);
applyRotation();
animate();
