const NPC = {
  size: 32,
  color: "#e74c3c",
};

const npcs = [
  { id: "npc1", mapId: "map1", col: 28, row: 12 },
  { id: "npc2", mapId: "map1", col: 12, row: 18 },
  {
    id: "dog",
    mapId: "map1",
    col: 18,
    row: 14,
    color: "#a16207",
    spritePath: "sprites/npc/dog.png",
  },
];

preloadSprites(npcs.map((npc) => npc.spritePath).filter(Boolean));

function getNpcDrawColor(npc) {
  return npc.color ?? NPC.color;
}

function getNpcsForCurrentMap() {
  return npcs.filter((npc) => npc.mapId === getCurrentMapId());
}

function tileToWorldPosition(col, row, size) {
  return {
    x: col * MAP.tileSize + (MAP.tileSize - size) / 2,
    y: row * MAP.tileSize + (MAP.tileSize - size) / 2,
  };
}

function getNpcPosition(npc) {
  return tileToWorldPosition(npc.col, npc.row, NPC.size);
}

function drawNpcs(ctx) {
  for (const npc of getNpcsForCurrentMap()) {
    const { x, y } = getNpcPosition(npc);

    drawSpriteOrRect(ctx, {
      x,
      y,
      width: NPC.size,
      height: NPC.size,
      spritePath: npc.spritePath,
      color: getNpcDrawColor(npc),
    });
  }
}

function isRectOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function isNpcBlockedRect(x, y, width, height) {
  for (const npc of getNpcsForCurrentMap()) {
    const { x: npcX, y: npcY } = getNpcPosition(npc);

    if (isRectOverlap(x, y, width, height, npcX, npcY, NPC.size, NPC.size)) {
      return true;
    }
  }

  return false;
}

function getNpcAtTile(col, row) {
  for (const npc of getNpcsForCurrentMap()) {
    if (npc.col === col && npc.row === row) {
      return npc;
    }
  }

  return null;
}
