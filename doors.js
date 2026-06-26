const DOOR = {
  size: 32,
  color: "#9333ea",
};

const doors = [
  {
    id: "door1",
    mapId: "map1",
    col: 20,
    row: 13,
    opened: false,
    targetMap: "map2",
    targetSpawn: { col: 1, row: 8 },
  },
];

function getDoorsForCurrentMap() {
  return doors.filter((door) => door.mapId === getCurrentMapId());
}

function getDoorPosition(door) {
  return tileToWorldPosition(door.col, door.row, DOOR.size);
}

function getDoorAtTile(col, row) {
  for (const door of getDoorsForCurrentMap()) {
    if (door.col === col && door.row === row) {
      return door;
    }
  }

  return null;
}

function isClosedDoorAt(col, row) {
  const door = getDoorAtTile(col, row);
  return door !== null && !door.opened;
}

function isDoorBlockedRect(x, y, width, height) {
  for (const door of getDoorsForCurrentMap()) {
    if (door.opened) {
      continue;
    }

    const { x: doorX, y: doorY } = getDoorPosition(door);

    if (isRectOverlap(x, y, width, height, doorX, doorY, DOOR.size, DOOR.size)) {
      return true;
    }
  }

  return false;
}

function openDoor(door) {
  door.opened = true;
}

function tryInteractDoor(door) {
  if (door.opened) {
    return;
  }

  if (hasItem("key")) {
    openDoor(door);
    showTransientMessage("鍵を使って扉を開けた！");
    return;
  }

  showTransientMessage("鍵がかかっている。");
}

function checkDoorMapTransition(player, playerSize) {
  const col = worldToTile(player.x + playerSize / 2);
  const row = worldToTile(player.y + playerSize / 2);
  const door = getDoorAtTile(col, row);

  if (!door || !door.opened || !door.targetMap) {
    return;
  }

  switchMap(door.targetMap);

  const spawn = door.targetSpawn ?? findStartTileInMap(door.targetMap);
  if (!spawn) {
    throw new Error(`Spawn not found for map: ${door.targetMap}`);
  }

  const position = getMapSpawnPosition(
    door.targetMap,
    spawn.col,
    spawn.row,
    playerSize
  );

  player.x = position.x;
  player.y = position.y;
}

function drawDoors(ctx) {
  for (const door of getDoorsForCurrentMap()) {
    if (door.opened) {
      continue;
    }

    const { x, y } = getDoorPosition(door);

    ctx.fillStyle = DOOR.color;
    ctx.fillRect(x, y, DOOR.size, DOOR.size);
  }
}

function getDoorsSaveState() {
  return doors.map(({ id, mapId, opened }) => ({
    id,
    mapId,
    opened,
  }));
}

function applyDoorsSaveState(savedDoors) {
  for (const saved of savedDoors) {
    const door = doors.find(
      (entry) => entry.id === saved.id && entry.mapId === saved.mapId
    );

    if (door) {
      door.opened = saved.opened;
    }
  }
}
