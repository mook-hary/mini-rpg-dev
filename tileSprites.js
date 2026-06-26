const TILE_SPRITES = {
  paths: {
    floor: "assets/tiles/floor.png",
    wall: "assets/tiles/wall.png",
  },
  images: {
    floor: null,
    wall: null,
  },
};

function loadTileImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function loadTileSprites() {
  const keys = Object.keys(TILE_SPRITES.paths);

  await Promise.all(
    keys.map(async (key) => {
      const image = await loadTileImage(TILE_SPRITES.paths[key]);

      if (image) {
        TILE_SPRITES.images[key] = image;
      }
    })
  );
}

function getTileSpriteKey(tile) {
  if (tile === TILE.WALL) {
    return "wall";
  }

  return "floor";
}

function getTileSpriteImage(tile) {
  const key = getTileSpriteKey(tile);
  const image = TILE_SPRITES.images[key];

  if (image && image.complete && image.naturalWidth > 0) {
    return image;
  }

  return null;
}

function drawTilePlaceholder(ctx, tile, x, y) {
  ctx.fillStyle = getTileColor(tile);
  ctx.fillRect(x, y, MAP.tileSize, MAP.tileSize);
}

function drawTileSprite(ctx, tile, x, y) {
  const image = getTileSpriteImage(tile);

  if (image) {
    ctx.drawImage(image, x, y, MAP.tileSize, MAP.tileSize);
    return;
  }

  drawTilePlaceholder(ctx, tile, x, y);
}

function drawTile(ctx, tile, x, y) {
  drawTileSprite(ctx, tile, x, y);
}

loadTileSprites();
