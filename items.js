const ITEM = {
  size: 16,
  color: "#facc15",
};

const items = [
  {
    id: "coin",
    name: "Coin",
    mapId: "map1",
    col: 16,
    row: 10,
    collected: false,
    collectMessage: "コインを手に入れた！",
  },
  {
    id: "coin",
    name: "Coin",
    mapId: "map1",
    col: 18,
    row: 10,
    collected: false,
    collectMessage: "コインを手に入れた！",
  },
  {
    id: "potion",
    name: "Potion",
    mapId: "map1",
    col: 22,
    row: 10,
    collected: false,
    collectMessage: "ポーションを手に入れた！",
    color: "#4ade80",
  },
  {
    id: "key",
    name: "Key",
    mapId: "map1",
    col: 17,
    row: 13,
    collected: false,
    collectMessage: "鍵を手に入れた！",
    color: "#c084fc",
  },
];

function getItemsForCurrentMap() {
  return items.filter((item) => item.mapId === getCurrentMapId());
}

function getItemPosition(item) {
  const offset = (MAP.tileSize - ITEM.size) / 2;

  return {
    x: item.col * MAP.tileSize + offset,
    y: item.row * MAP.tileSize + offset,
  };
}

function getItemAtTile(col, row) {
  for (const item of getItemsForCurrentMap()) {
    if (!item.collected && item.col === col && item.row === row) {
      return item;
    }
  }

  return null;
}

function collectItem(item) {
  item.collected = true;
  addItem(item.id, item.name);
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
  for (const item of getItemsForCurrentMap()) {
    if (item.collected) {
      continue;
    }

    const { x, y } = getItemPosition(item);
    const centerX = x + ITEM.size / 2;
    const centerY = y + ITEM.size / 2;
    const radius = ITEM.size / 2;

    ctx.fillStyle = item.color ?? ITEM.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function getItemsSaveState() {
  return items.map(({ id, mapId, col, row, collected }) => ({
    id,
    mapId,
    col,
    row,
    collected,
  }));
}

function applyItemsSaveState(savedItems) {
  for (const saved of savedItems) {
    const item = items.find(
      (entry) =>
        entry.id === saved.id &&
        entry.mapId === saved.mapId &&
        entry.col === saved.col &&
        entry.row === saved.row
    );

    if (item) {
      item.collected = saved.collected;
    }
  }
}
