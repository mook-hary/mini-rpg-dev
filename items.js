const ITEM = {
  size: 16,
  color: "#facc15",
};

const items = [
  {
    id: "coin1",
    name: "コイン",
    col: 16,
    row: 10,
    collected: false,
    collectMessage: "コインを手に入れた！",
  },
];

function getItemPosition(item) {
  const offset = (MAP.tileSize - ITEM.size) / 2;

  return {
    x: item.col * MAP.tileSize + offset,
    y: item.row * MAP.tileSize + offset,
  };
}

function getItemAtTile(col, row) {
  for (const item of items) {
    if (!item.collected && item.col === col && item.row === row) {
      return item;
    }
  }

  return null;
}

function collectItem(item) {
  item.collected = true;
  showTransientMessage(item.collectMessage);
}

function checkItemCollection(player, playerSize) {
  const col = worldToTile(player.x + playerSize / 2);
  const row = worldToTile(player.y + playerSize / 2);
  const item = getItemAtTile(col, row);

  if (item) {
    collectItem(item);
  }
}

function drawItems(ctx) {
  for (const item of items) {
    if (item.collected) {
      continue;
    }

    const { x, y } = getItemPosition(item);
    const centerX = x + ITEM.size / 2;
    const centerY = y + ITEM.size / 2;
    const radius = ITEM.size / 2;

    ctx.fillStyle = ITEM.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
