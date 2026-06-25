const camera = {
  x: 0,
  y: 0,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateCamera(viewportWidth, viewportHeight, player, playerSize) {
  const mapWidth = getMapPixelWidth();
  const mapHeight = getMapPixelHeight();

  if (mapWidth <= viewportWidth) {
    camera.x = (mapWidth - viewportWidth) / 2;
  } else {
    const targetX = player.x + playerSize / 2 - viewportWidth / 2;
    camera.x = clamp(targetX, 0, mapWidth - viewportWidth);
  }

  if (mapHeight <= viewportHeight) {
    camera.y = (mapHeight - viewportHeight) / 2;
  } else {
    const targetY = player.y + playerSize / 2 - viewportHeight / 2;
    camera.y = clamp(targetY, 0, mapHeight - viewportHeight);
  }
}

function applyCamera(ctx) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
}

function resetCamera(ctx) {
  ctx.restore();
}

function worldToScreenX(x) {
  return x - camera.x;
}

function worldToScreenY(y) {
  return y - camera.y;
}
