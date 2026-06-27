const SPRITE_CACHE = new Map();

function loadSprite(path) {
  if (!path || SPRITE_CACHE.has(path)) {
    return;
  }

  const image = new Image();

  image.onerror = () => {
    SPRITE_CACHE.set(path, null);
  };

  SPRITE_CACHE.set(path, image);
  image.src = path;
}

function getLoadedSprite(path) {
  if (!path) {
    return null;
  }

  const cached = SPRITE_CACHE.get(path);

  if (!cached) {
    return null;
  }

  if (cached.complete && cached.naturalWidth > 0) {
    return cached;
  }

  return null;
}

function drawSpriteOrRect(ctx, { x, y, width, height, spritePath, color }) {
  if (spritePath && !SPRITE_CACHE.has(spritePath)) {
    loadSprite(spritePath);
  }

  const sprite = getLoadedSprite(spritePath);

  if (sprite) {
    ctx.drawImage(sprite, x, y, width, height);
    return;
  }

  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function preloadSprites(paths) {
  for (const path of paths) {
    loadSprite(path);
  }
}
