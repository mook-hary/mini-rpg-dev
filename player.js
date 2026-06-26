const PLAYER = {
  size: 32,
  speed: 4,
};

// 歩行中の足踏み揺れ量（px）
const WALK_BOB_AMOUNT = 2;

// M8: 向きごとの仮色。PNG 導入後は images を使い colors はフォールバック用に残せる
const PLAYER_SPRITE = {
  colors: {
    up: "#60a5fa",
    down: "#3b82f6",
    left: "#2563eb",
    right: "#1d4ed8",
  },
  // 将来の PNG パス（M8 では null のまま未使用）
  images: {
    up: null,
    down: null,
    left: null,
    right: null,
  },
};

function getPlayerSpriteColor(direction) {
  return PLAYER_SPRITE.colors[direction] ?? PLAYER_SPRITE.colors.down;
}

// 移動入力に応じて isMoving / animationFrame を更新（PNG フレーム切替にも流用可）
function updatePlayerAnimation(player, dx, dy) {
  player.isMoving = dx !== 0 || dy !== 0;

  if (player.isMoving) {
    player.animationFrame++;
    return;
  }

  player.animationFrame = 0;
}

// 会話中など、移動停止時にアニメーション状態をリセット
function resetPlayerAnimation(player) {
  player.isMoving = false;
  player.animationFrame = 0;
}

// 歩行中だけ描画位置を少しずらして足踏みを表現（当たり判定座標は変えない）
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

// 仮描画：向きに応じた色の四角（画像がない間のプレースホルダー）
function drawPlayerPlaceholder(ctx, x, y, direction) {
  ctx.fillStyle = getPlayerSpriteColor(direction);
  ctx.fillRect(x, y, PLAYER.size, PLAYER.size);
}

// スプライト本体。PNG があれば drawImage、なければプレースホルダー
function drawPlayerSprite(ctx, player) {
  const { x: bobX, y: bobY } = getWalkBobOffset(player);
  const drawX = player.x + bobX;
  const drawY = player.y + bobY;
  const image = PLAYER_SPRITE.images[player.direction];

  if (image) {
    ctx.drawImage(image, drawX, drawY, PLAYER.size, PLAYER.size);
    return;
  }

  drawPlayerPlaceholder(ctx, drawX, drawY, player.direction);
}

// 主人公描画のエントリポイント（render からはこの関数だけ呼ぶ）
function drawPlayer(ctx, player) {
  drawPlayerSprite(ctx, player);
}
