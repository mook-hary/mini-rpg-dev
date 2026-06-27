const FRAMES = [
  "sprites/player/player_idle_down_0.png",
  "sprites/player/player_idle_down_1.png",
  "sprites/player/player_idle_down_2.png",
  "sprites/player/player_idle_down_3.png",
];

const images = [];
let currentFrame = 0;
let lastTick = 0;
let frameMs = 120;
let scale = 2;
let paused = false;

const animCanvas = document.getElementById("anim-canvas");
const animCtx = animCanvas.getContext("2d");
const smallCanvas = document.getElementById("small-canvas");
const smallCtx = smallCanvas.getContext("2d");
const framesRow = document.getElementById("frames-row");
const frameMsInput = document.getElementById("frame-ms");
const frameMsVal = document.getElementById("frame-ms-val");
const scaleSelect = document.getElementById("scale");
const pausedCheckbox = document.getElementById("paused");
const frameLabel = document.getElementById("frame-label");

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function resizeAnimCanvas() {
  const size = 32 * scale;
  animCanvas.width = size;
  animCanvas.height = size;
}

function drawFrame(ctx, img, x, y, s) {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, x, y, 32 * s, 32 * s);
}

function renderAnim() {
  const img = images[currentFrame];
  if (!img) return;

  animCtx.clearRect(0, 0, animCanvas.width, animCanvas.height);
  drawFrame(animCtx, img, 0, 0, scale);
  frameLabel.textContent = `frame ${currentFrame} (${frameMs}ms)`;
}

function renderSmall() {
  smallCtx.clearRect(0, 0, smallCanvas.width, smallCanvas.height);
  const img = images[currentFrame];
  if (!img) return;

  for (let i = 0; i < 3; i++) {
    drawFrame(smallCtx, img, 8 + i * 28, 32, 1);
  }
}

function buildFrameStrip() {
  framesRow.innerHTML = "";
  images.forEach((img, i) => {
    const box = document.createElement("div");
    box.className = "frame-box";
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    c.className = "bg-grass";
    drawFrame(c.getContext("2d"), img, 0, 0, 2);
    box.appendChild(c);
    box.appendChild(document.createTextNode(`down_${i}`));
    framesRow.appendChild(box);
  });
}

function tick(now) {
  if (!paused && images.length === FRAMES.length) {
    if (now - lastTick >= frameMs) {
      currentFrame = (currentFrame + 1) % FRAMES.length;
      lastTick = now;
      renderAnim();
      renderSmall();
    }
  }
  requestAnimationFrame(tick);
}

frameMsInput.addEventListener("input", () => {
  frameMs = Number(frameMsInput.value);
  frameMsVal.textContent = String(frameMs);
});

scaleSelect.addEventListener("change", () => {
  scale = Number(scaleSelect.value);
  resizeAnimCanvas();
  renderAnim();
});

pausedCheckbox.addEventListener("change", () => {
  paused = pausedCheckbox.checked;
});

Promise.all(FRAMES.map(loadImage))
  .then((loaded) => {
    images.push(...loaded);
    resizeAnimCanvas();
    buildFrameStrip();
    renderAnim();
    renderSmall();
    lastTick = performance.now();
    requestAnimationFrame(tick);
  })
  .catch((err) => {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<p style="color:#f88">Load error: ${err.message}</p>`
    );
  });
