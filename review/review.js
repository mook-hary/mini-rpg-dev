/**
 * M31 Sprite Review Tool
 * Standalone dev tool — no dependency on game code.
 */

const SPRITE_BASE = "../sprites/player/";

const CATEGORIES = {
  master: {
    label: "Master Sprite",
    assets: [
      {
        name: "player_master_32_redesign_v1.png ★ Official",
        frames: ["player_master_32_redesign_v1.png"],
      },
      {
        name: "player_master_32_v2.png",
        frames: ["player_master_32_v2.png"],
      },
      {
        name: "player_master_v1.png",
        frames: ["player_master_v1.png"],
      },
    ],
  },
  prototype: {
    label: "Prototype",
    assets: [
      { name: "player_idle_v2.png", frames: ["player_idle_v2.png"] },
      { name: "player_idle_v1.png", frames: ["player_idle_v1.png"] },
      { name: "player_face_test_v1.png", frames: ["player_face_test_v1.png"] },
      { name: "test_32.png", frames: ["test_32.png"] },
    ],
  },
  idle: {
    label: "Idle",
    assets: [
      { name: "player_idle_v2.png", frames: ["player_idle_v2.png"] },
      { name: "player_idle_v1.png", frames: ["player_idle_v1.png"] },
      {
        name: "player_idle_down (4 frames)",
        frames: [
          "player_idle_down_0.png",
          "player_idle_down_1.png",
          "player_idle_down_2.png",
          "player_idle_down_3.png",
        ],
      },
    ],
  },
  walk: {
    label: "Walk",
    assets: [],
  },
  animation: {
    label: "Animation",
    assets: [
      {
        name: "Idle Down — 4 frames",
        frames: [
          "player_idle_down_0.png",
          "player_idle_down_1.png",
          "player_idle_down_2.png",
          "player_idle_down_3.png",
        ],
      },
    ],
  },
};

const state = {
  category: "master",
  assetIndex: 0,
  scale: 2,
  background: "transparent",
  frameIndex: 0,
  playing: false,
  loop: true,
  frameMs: 120,
  images: [],
  colorCounts: [],
  lastTick: 0,
  animId: null,
};

const els = {
  categoryTabs: document.getElementById("category-tabs"),
  assetSelect: document.getElementById("asset-select"),
  scaleSelect: document.getElementById("scale-select"),
  bgSelect: document.getElementById("bg-select"),
  viewport: document.getElementById("viewport"),
  canvas: document.getElementById("sprite-canvas"),
  emptyState: document.getElementById("empty-state"),
  frameStrip: document.getElementById("frame-strip"),
  btnPlay: document.getElementById("btn-play"),
  btnPause: document.getElementById("btn-pause"),
  btnPrev: document.getElementById("btn-prev"),
  btnNext: document.getElementById("btn-next"),
  loopCheck: document.getElementById("loop-check"),
  speedRange: document.getElementById("speed-range"),
  speedVal: document.getElementById("speed-val"),
  infoFilename: document.getElementById("info-filename"),
  infoSize: document.getElementById("info-size"),
  infoColors: document.getElementById("info-colors"),
  infoFrame: document.getElementById("info-frame"),
  infoScale: document.getElementById("info-scale"),
  infoCategory: document.getElementById("info-category"),
};

const ctx = els.canvas.getContext("2d", { willReadFrequently: true });

function getCategory() {
  return CATEGORIES[state.category];
}

function getAsset() {
  const cat = getCategory();
  return cat.assets[state.assetIndex] ?? null;
}

function pathFor(file) {
  return SPRITE_BASE + file;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ img, ok: true });
    img.onerror = () => resolve({ img: null, ok: false });
    img.src = src;
  });
}

function countColors(img) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const offCtx = off.getContext("2d");
  offCtx.drawImage(img, 0, 0);
  const data = offCtx.getImageData(0, 0, w, h).data;
  const colors = new Set();

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    colors.add(`${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]}`);
  }

  return colors.size;
}

function buildCategoryTabs() {
  els.categoryTabs.innerHTML = "";

  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab-btn" + (state.category === key ? " active" : "");
    btn.textContent = cat.label;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", state.category === key ? "true" : "false");
    btn.addEventListener("click", () => {
      state.category = key;
      state.assetIndex = 0;
      state.frameIndex = 0;
      stopAnimation();
      buildCategoryTabs();
      buildAssetSelect();
      loadCurrentAsset();
    });
    els.categoryTabs.appendChild(btn);
  });
}

function buildAssetSelect() {
  const cat = getCategory();
  els.assetSelect.innerHTML = "";

  if (cat.assets.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = "（なし）";
    els.assetSelect.appendChild(opt);
    els.assetSelect.disabled = true;
    return;
  }

  els.assetSelect.disabled = false;
  cat.assets.forEach((asset, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = asset.name;
    if (i === state.assetIndex) opt.selected = true;
    els.assetSelect.appendChild(opt);
  });
}

function setEmpty(visible) {
  els.emptyState.hidden = !visible;
  els.viewport.hidden = visible;
  els.frameStrip.hidden = visible;
  setAnimControlsEnabled(!visible);
}

function setAnimControlsEnabled(enabled) {
  const asset = getAsset();
  const multi = enabled && asset && asset.frames.length > 1;

  els.btnPlay.disabled = !multi;
  els.btnPause.disabled = !multi || !state.playing;
  els.btnPrev.disabled = !enabled || !asset;
  els.btnNext.disabled = !enabled || !asset;
  els.loopCheck.disabled = !multi;
  els.speedRange.disabled = !multi;
}

async function loadCurrentAsset() {
  stopAnimation();
  const cat = getCategory();
  const asset = getAsset();

  if (!asset) {
    state.images = [];
    state.colorCounts = [];
    setEmpty(true);
    updateInfo();
    return;
  }

  setEmpty(false);
  state.frameIndex = Math.min(state.frameIndex, asset.frames.length - 1);

  const results = await Promise.all(
    asset.frames.map((file) => loadImage(pathFor(file)))
  );

  state.images = results.map((r) => r.img);
  state.colorCounts = results.map((r, i) =>
    r.ok ? countColors(r.img) : null
  );

  buildFrameStrip();
  render();
  updateInfo();
  setAnimControlsEnabled(true);
}

function buildFrameStrip() {
  const asset = getAsset();
  els.frameStrip.innerHTML = "";

  if (!asset || asset.frames.length <= 1) {
    els.frameStrip.hidden = true;
    return;
  }

  els.frameStrip.hidden = false;
  const thumbScale = 2;

  asset.frames.forEach((file, i) => {
    const wrap = document.createElement("div");
    wrap.className = "frame-thumb" + (i === state.frameIndex ? " active" : "");
    wrap.title = file;

    const c = document.createElement("canvas");
    const img = state.images[i];
    if (img) {
      c.width = img.naturalWidth * thumbScale;
      c.height = img.naturalHeight * thumbScale;
      const cctx = c.getContext("2d");
      cctx.imageSmoothingEnabled = false;
      cctx.drawImage(img, 0, 0, c.width, c.height);
    }

    const label = document.createElement("span");
    label.textContent = String(i);

    wrap.appendChild(c);
    wrap.appendChild(label);
    wrap.addEventListener("click", () => {
      state.frameIndex = i;
      render();
      updateInfo();
      highlightThumb();
    });

    els.frameStrip.appendChild(wrap);
  });
}

function highlightThumb() {
  els.frameStrip.querySelectorAll(".frame-thumb").forEach((el, i) => {
    el.classList.toggle("active", i === state.frameIndex);
  });
}

function render() {
  const asset = getAsset();
  const img = state.images[state.frameIndex];

  if (!asset || !img) {
    ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
    return;
  }

  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const displayW = w * state.scale;
  const displayH = h * state.scale;

  els.canvas.width = displayW;
  els.canvas.height = displayH;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, displayW, displayH);
  ctx.drawImage(img, 0, 0, displayW, displayH);
}

function updateInfo() {
  const cat = getCategory();
  const asset = getAsset();

  els.infoCategory.textContent = cat.label;

  if (!asset) {
    els.infoFilename.textContent = "—";
    els.infoSize.textContent = "—";
    els.infoColors.textContent = "—";
    els.infoFrame.textContent = "—";
    els.infoScale.textContent = `${state.scale * 100}%`;
    return;
  }

  const img = state.images[state.frameIndex];
  const file = asset.frames[state.frameIndex];

  els.infoFilename.textContent = file;
  els.infoScale.textContent = `${state.scale * 100}%`;

  if (img) {
    els.infoSize.textContent = `${img.naturalWidth} × ${img.naturalHeight} px`;
    const cc = state.colorCounts[state.frameIndex];
    els.infoColors.textContent = cc != null ? `${cc} 色` : "—";
  } else {
    els.infoSize.textContent = "読込失敗";
    els.infoColors.textContent = "—";
  }

  if (asset.frames.length > 1) {
    els.infoFrame.textContent = `${state.frameIndex} / ${asset.frames.length - 1}（全 ${asset.frames.length} コマ）`;
  } else {
    els.infoFrame.textContent = "0（静止画）";
  }
}

function stopAnimation() {
  state.playing = false;
  if (state.animId != null) {
    cancelAnimationFrame(state.animId);
    state.animId = null;
  }
  els.btnPlay.disabled = false;
  els.btnPause.disabled = true;
}

function startAnimation() {
  const asset = getAsset();
  if (!asset || asset.frames.length <= 1) return;

  state.playing = true;
  state.lastTick = performance.now();
  els.btnPlay.disabled = true;
  els.btnPause.disabled = false;
  tick();
}

function tick(now = performance.now()) {
  if (!state.playing) return;

  const asset = getAsset();
  if (!asset || asset.frames.length <= 1) {
    stopAnimation();
    return;
  }

  if (now - state.lastTick >= state.frameMs) {
    const next = state.frameIndex + 1;

    if (next >= asset.frames.length) {
      if (state.loop) {
        state.frameIndex = 0;
      } else {
        state.frameIndex = asset.frames.length - 1;
        stopAnimation();
        render();
        updateInfo();
        highlightThumb();
        return;
      }
    } else {
      state.frameIndex = next;
    }

    state.lastTick = now;
    render();
    updateInfo();
    highlightThumb();
  }

  state.animId = requestAnimationFrame(tick);
}

function stepFrame(delta) {
  const asset = getAsset();
  if (!asset) return;

  stopAnimation();

  if (asset.frames.length <= 1) return;

  let next = state.frameIndex + delta;

  if (next < 0) next = state.loop ? asset.frames.length - 1 : 0;
  if (next >= asset.frames.length) next = state.loop ? 0 : asset.frames.length - 1;

  state.frameIndex = next;
  render();
  updateInfo();
  highlightThumb();
}

function setBackground(bg) {
  state.background = bg;
  els.viewport.className = "viewport bg-" + bg;
}

els.assetSelect.addEventListener("change", () => {
  state.assetIndex = Number(els.assetSelect.value);
  state.frameIndex = 0;
  loadCurrentAsset();
});

els.scaleSelect.addEventListener("change", () => {
  state.scale = Number(els.scaleSelect.value);
  render();
  updateInfo();
});

els.bgSelect.addEventListener("change", () => {
  setBackground(els.bgSelect.value);
});

els.btnPlay.addEventListener("click", startAnimation);
els.btnPause.addEventListener("click", stopAnimation);
els.btnPrev.addEventListener("click", () => stepFrame(-1));
els.btnNext.addEventListener("click", () => stepFrame(1));

els.loopCheck.addEventListener("change", () => {
  state.loop = els.loopCheck.checked;
});

els.speedRange.addEventListener("input", () => {
  state.frameMs = Number(els.speedRange.value);
  els.speedVal.textContent = String(state.frameMs);
});

buildCategoryTabs();
buildAssetSelect();
setBackground("transparent");
loadCurrentAsset();
