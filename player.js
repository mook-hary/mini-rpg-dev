const PLAYER = {
  size: 32,
  speed: 4,
};

// 歩行中の足踏み揺れ量（px）
const WALK_BOB_AMOUNT = 2;

// 主人公スプライト設定
const PLAYER_SPRITE = {
  // PNG ファイルパス（ファイルを置くだけで自動読み込み）
  paths: {
    up: "sprites/player/up.png",
    down: "sprites/player/down.png",
    left: "sprites/player/left.png",
    right: "sprites/player/right.png",
  },
  // 読み込み済み Image オブジェクト（未読込・失敗時は null のまま）
  images: {
    up: null,
    down: null,
    left: null,
    right: null,
  },
  // 画像がない間のフォールバック色（M8/M9）
  colors: {
    up: "#60a5fa",
    down: "#3b82f6",
    left: "#2563eb",
    right: "#1d4ed8",
  },
};

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

// 全方向の PNG を非同期読み込み（失敗した方向は四角描画にフォールバック）
async function loadPlayerSprites() {
  const directions = Object.keys(PLAYER_SPRITE.paths);

  await Promise.all(
    directions.map(async (direction) => {
      const image = await loadImage(PLAYER_SPRITE.paths[direction]);

      if (image) {
        PLAYER_SPRITE.images[direction] = image;
      }
    })
  );
}

// 指定方向の PNG が利用可能か判定
function getPlayerSpriteImage(direction) {
  const image = PLAYER_SPRITE.images[direction];

  if (image && image.complete && image.naturalWidth > 0) {
    return image;
  }

  return null;
}

function getPlayerSpriteColor(direction) {
  return PLAYER_SPRITE.colors[direction] ?? PLAYER_SPRITE.colors.down;
}

function updatePlayerAnimation(player, dx, dy) {
  player.isMoving = dx !== 0 || dy !== 0;

  if (player.isMoving) {
    player.animationFrame++;
    return;
  }

  player.animationFrame = 0;
}

function resetPlayerAnimation(player) {
  player.isMoving = false;
  player.animationFrame = 0;
}

function getWalkBobOffset(player) {
  if (!player.isMoving) {
    return { x: 0, y: 0 };
  }

  const bob = Math.sin(player.animationFrame * 0.3) * WALK_BOB_AMOUNT;

  if (player.direction === "left" || player.direction === "right") {
    return { x: bob, y: 0 };
  }

  return { x: 0, y: bob };
}

function drawPlayerPlaceholder(ctx, x, y, direction) {
  ctx.fillStyle = getPlayerSpriteColor(direction);
  ctx.fillRect(x, y, PLAYER.size, PLAYER.size);
}

function drawPlayerSprite(ctx, player) {
  const { x: bobX, y: bobY } = getWalkBobOffset(player);
  const drawX = player.x + bobX;
  const drawY = player.y + bobY;
  const image = getPlayerSpriteImage(player.direction);

  if (image) {
    ctx.drawImage(image, drawX, drawY, PLAYER.size, PLAYER.size);
    return;
  }

  drawPlayerPlaceholder(ctx, drawX, drawY, player.direction);
}

function drawPlayer(ctx, player) {
  drawPlayerSprite(ctx, player);
}

loadPlayerSprites();
