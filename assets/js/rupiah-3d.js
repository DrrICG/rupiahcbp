const banknotes = [
    {id:"1000",title:"Rp1.000",series:"TE 2022",label:"Seribu Rupiah",front:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-1000-depan.JPG",back:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-1000-belakang.JPG"},
    {id:"2000",title:"Rp2.000",series:"TE 2022",label:"Dua Ribu Rupiah",front:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-2000-depan.JPG",back:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-2000-belakang.JPG"},
    {id:"5000",title:"Rp5.000",series:"TE 2022",label:"Lima Ribu Rupiah",front:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-5000-depan.JPG",back:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-5000-belakang.JPG"},
    {id:"10000",title:"Rp10.000",series:"TE 2022",label:"Sepuluh Ribu Rupiah",front:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-10000-depan.JPG",back:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-10000-belakang.JPG"},
    {id:"20000",title:"Rp20.000",series:"TE 2022",label:"Dua Puluh Ribu Rupiah",front:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-20000-depan.JPG",back:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-20000-belakang.JPG"},
    {id:"50000",title:"Rp50.000",series:"TE 2022",label:"Lima Puluh Ribu Rupiah",front:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-50000-depan.JPG",back:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-50000-belakang.JPG"},
    {id:"75000",title:"Rp75.000",series:"UPK 75 Tahun RI 2020",label:"Tujuh Puluh Lima Ribu Rupiah",front:"https://www.bi.go.id/upk75/PublishingImages/Default/upk-75.jpg",back:"https://www.bi.go.id/upk75/PublishingImages/Default/upk-75.jpg"},
    {id:"100000",title:"Rp100.000",series:"TE 2022",label:"Seratus Ribu Rupiah",front:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-100000-depan.JPG",back:"https://www.bi.go.id/Gambar%20Uang/TE2022/TE-2022-100000-belakang.JPG"}
];

const denomGrid = document.getElementById("denomGrid");
const activeTitle = document.getElementById("activeTitle");
const activeSeries = document.getElementById("activeSeries");
const frontImg = document.getElementById("frontImg");
const backImg = document.getElementById("backImg");
const money3d = document.getElementById("money3d");
const stage = document.getElementById("stage");
const toggleAuto = document.getElementById("toggleAuto");
const resetView = document.getElementById("resetView");
const flipView = document.getElementById("flipView");

let activeIndex = banknotes.length - 1;
let rotateX = -7;
let rotateY = 20;
let autoRotate = true;
let isDragging = false;
let lastX = 0;
let lastY = 0;
let velocity = 0;

function renderButtons(){
    denomGrid.innerHTML = "";
    banknotes.forEach((note, index) => {
        const button = document.createElement("button");
        button.className = "denom-btn";
        button.type = "button";
        button.innerHTML = `<strong>${note.title}</strong><span>${note.label}</span>`;
        button.addEventListener("click", () => setActive(index));
        denomGrid.appendChild(button);
    });
}

function setActive(index){
    activeIndex = index;
    const note = banknotes[index];
    activeTitle.textContent = note.title;
    activeSeries.textContent = note.series;
    frontImg.src = note.front;
    backImg.src = note.back;
    frontImg.alt = `Bagian depan ${note.title} specimen`;
    backImg.alt = `Bagian belakang ${note.title} specimen`;
    frontImg.onerror = () => showFallback(frontImg, note, "depan");
    backImg.onerror = () => showFallback(backImg, note, "belakang");

    document.querySelectorAll(".denom-btn").forEach((btn, i) => {
        btn.classList.toggle("active", i === index);
    });
}

function showFallback(img, note, side){
    img.onerror = null;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 564">
        <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#e32228"/><stop offset="1" stop-color="#0a4ea3"/></linearGradient>
            <pattern id="p" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M0 18H36M18 0V36" stroke="rgba(255,255,255,.20)" stroke-width="2"/></pattern>
        </defs>
        <rect width="1200" height="564" fill="url(#g)"/><rect width="1200" height="564" fill="url(#p)"/>
        <text x="80" y="120" font-family="Arial" font-size="78" font-weight="900" fill="white">${note.title}</text>
        <text x="80" y="200" font-family="Arial" font-size="36" font-weight="800" fill="rgba(255,255,255,.85)">${note.label}</text>
        <text x="600" y="320" text-anchor="middle" font-family="Arial" font-size="120" font-weight="900" fill="rgba(255,255,255,.35)" transform="rotate(-15 600 320)">SPECIMEN</text>
        <text x="1120" y="520" text-anchor="end" font-family="Arial" font-size="28" font-weight="800" fill="white">${side.toUpperCase()}</text>
    </svg>`;
    img.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function applyRotation(){
    money3d.style.setProperty("--rx", `${rotateX}deg`);
    money3d.style.setProperty("--ry", `${rotateY}deg`);
}

function startDrag(x, y){
    isDragging = true;
    autoRotate = false;
    toggleAuto.textContent = "Auto Rotate: OFF";
    lastX = x;
    lastY = y;
}

function moveDrag(x, y){
    if(!isDragging) return;
    const dx = x - lastX;
    const dy = y - lastY;
    rotateY += dx * 0.42;
    rotateX -= dy * 0.22;
    rotateX = Math.max(-65, Math.min(65, rotateX));
    velocity = dx * 0.08;
    lastX = x;
    lastY = y;
    applyRotation();
}

function endDrag(){isDragging = false}

stage.addEventListener("pointerdown", (e) => {
    stage.setPointerCapture(e.pointerId);
    startDrag(e.clientX, e.clientY);
});
stage.addEventListener("pointermove", (e) => moveDrag(e.clientX, e.clientY));
stage.addEventListener("pointerup", endDrag);
stage.addEventListener("pointercancel", endDrag);

money3d.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 15 : 5;
    if(e.key === "ArrowLeft") rotateY -= step;
    if(e.key === "ArrowRight") rotateY += step;
    if(e.key === "ArrowUp") rotateX -= step;
    if(e.key === "ArrowDown") rotateX += step;
    rotateX = Math.max(-65, Math.min(65, rotateX));
    applyRotation();
});

toggleAuto.addEventListener("click", () => {
    autoRotate = !autoRotate;
    toggleAuto.textContent = autoRotate ? "Auto Rotate: ON" : "Auto Rotate: OFF";
});

resetView.addEventListener("click", () => {
    rotateX = -7;
    rotateY = 20;
    velocity = 0;
    applyRotation();
});

flipView.addEventListener("click", () => {
    rotateY += 180;
    applyRotation();
});

function animate(){
    if(autoRotate){
        rotateY += 0.22;
    } else if(!isDragging && Math.abs(velocity) > 0.01){
        rotateY += velocity;
        velocity *= 0.94;
    }
    applyRotation();
    requestAnimationFrame(animate);
}

renderButtons();
setActive(activeIndex);
applyRotation();
animate();
